#!/usr/bin/env python3
"""
Render listening recordings and speaking-examiner prompts with Kokoro TTS.

Reads scripts/.audio-jobs.json (written by `npm run audio:export`), writes MP3
files under public/ and a timing manifest to src/content/audio-manifest.json.
Jobs whose content has not changed since the last run are skipped.

Setup (once) — see "Audio" in README.md:
    python3 -m venv scripts/.tts/venv
    scripts/.tts/venv/bin/pip install -r scripts/requirements-audio.txt
    # model files (~350 MB) from https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0
    curl -L -o scripts/.tts/kokoro-v1.0.onnx https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx
    curl -L -o scripts/.tts/voices-v1.0.bin  https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin

Run:
    npm run audio:export
    scripts/.tts/venv/bin/python scripts/generate_audio.py
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import shutil
import sys
import tempfile
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
JOBS_FILE = ROOT / "scripts" / ".audio-jobs.json"
MANIFEST_FILE = ROOT / "src" / "content" / "audio-manifest.json"
PUBLIC_DIR = ROOT / "public"
SAMPLE_RATE = 24000
BITRATE_KBPS = 64
TARGET_RMS = 0.075


def load_kokoro(model_dir: Path):
    from kokoro_onnx import Kokoro
    from kokoro_onnx.config import EspeakConfig
    import espeakng_loader

    # espeak-ng truncates long data paths, so use a short copy of its data dir.
    data_src = Path(espeakng_loader.get_data_path())
    data_dir = Path(tempfile.gettempdir()) / "espeak-ng-data"
    if not (data_dir / "phontab").exists():
        shutil.copytree(data_src, data_dir, dirs_exist_ok=True)

    model = model_dir / "kokoro-v1.0.onnx"
    voices = model_dir / "voices-v1.0.bin"
    for f in (model, voices):
        if not f.exists():
            sys.exit(f"Missing {f}. See the setup notes at the top of this script.")
    return Kokoro(str(model), str(voices), espeak_config=EspeakConfig(data_path=str(data_dir)))


def job_hash(job: dict) -> str:
    return hashlib.sha1(json.dumps(job["segments"], sort_keys=True).encode()).hexdigest()[:12]


def normalise(samples: np.ndarray) -> np.ndarray:
    """Bring every voice to a similar loudness without clipping."""
    rms = float(np.sqrt(np.mean(samples**2))) if samples.size else 0.0
    if rms > 1e-5:
        samples = samples * (TARGET_RMS / rms)
    peak = float(np.max(np.abs(samples))) if samples.size else 0.0
    if peak > 0.97:
        samples = samples * (0.97 / peak)
    return samples


def render(kokoro, job: dict) -> tuple[np.ndarray, list[dict]]:
    pieces: list[np.ndarray] = []
    timeline: list[dict] = []
    cursor = 0
    for seg in job["segments"]:
        if seg["type"] == "pause":
            n = int(seg["seconds"] * SAMPLE_RATE)
            pieces.append(np.zeros(n, dtype=np.float32))
            timeline.append({"start": round(cursor / SAMPLE_RATE, 2), "end": round((cursor + n) / SAMPLE_RATE, 2)})
            cursor += n
            continue
        audio, sr = kokoro.create(seg["text"], voice=seg["voice"], speed=seg["speed"], lang=seg["lang"])
        assert sr == SAMPLE_RATE, sr
        audio = normalise(np.asarray(audio, dtype=np.float32))
        pieces.append(audio)
        timeline.append({"start": round(cursor / SAMPLE_RATE, 2), "end": round((cursor + len(audio)) / SAMPLE_RATE, 2)})
        cursor += len(audio)
        gap = int(seg.get("gapAfter", 0) * SAMPLE_RATE)
        if gap:
            pieces.append(np.zeros(gap, dtype=np.float32))
            cursor += gap
    return np.concatenate(pieces) if pieces else np.zeros(0, dtype=np.float32), timeline


def encode_mp3(samples: np.ndarray, target: Path) -> None:
    import lameenc

    pcm = (np.clip(samples, -1, 1) * 32767).astype(np.int16)
    encoder = lameenc.Encoder()
    encoder.set_bit_rate(BITRATE_KBPS)
    encoder.set_in_sample_rate(SAMPLE_RATE)
    encoder.set_channels(1)
    encoder.set_quality(2)
    data = encoder.encode(pcm.tobytes()) + encoder.flush()
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(data)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--models", default=os.environ.get("KOKORO_DIR", str(ROOT / "scripts" / ".tts")), help="folder with kokoro-v1.0.onnx and voices-v1.0.bin")
    parser.add_argument("--force", action="store_true", help="re-render every job")
    parser.add_argument("--only", help="only render jobs whose id starts with this prefix")
    args = parser.parse_args()

    if not JOBS_FILE.exists():
        sys.exit("Run `npm run audio:export` first.")
    jobs = json.loads(JOBS_FILE.read_text())["jobs"]
    manifest = json.loads(MANIFEST_FILE.read_text()) if MANIFEST_FILE.exists() else {}

    kokoro = None
    for job in jobs:
        if args.only and not job["id"].startswith(args.only):
            continue
        digest = job_hash(job)
        target = PUBLIC_DIR / job["out"]
        existing = manifest.get(job["id"])
        if not args.force and existing and existing.get("hash") == digest and target.exists():
            continue
        if kokoro is None:
            kokoro = load_kokoro(Path(args.models))
        samples, timeline = render(kokoro, job)
        encode_mp3(samples, target)
        entry = {"src": job["out"], "duration": round(len(samples) / SAMPLE_RATE, 2), "hash": digest}
        if len(job["segments"]) > 1:
            entry["segments"] = timeline
        manifest[job["id"]] = entry
        print(f"{job['id']}: {entry['duration']:.1f}s -> {job['out']}", flush=True)
        # Write as we go so an interrupted run keeps its progress.
        MANIFEST_FILE.write_text(json.dumps(dict(sorted(manifest.items())), indent=2) + "\n")

    valid = {job["id"] for job in jobs}
    stale = [key for key in manifest if key not in valid]
    for key in stale:
        del manifest[key]
    MANIFEST_FILE.write_text(json.dumps(dict(sorted(manifest.items())), indent=2) + "\n")
    print(f"Manifest has {len(manifest)} entries ({len(stale)} stale removed).")


if __name__ == "__main__":
    main()
