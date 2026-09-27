/** The microphone stream is opened on the mic-check screen and reused for the whole speaking test. */
let stream: MediaStream | null = null

export async function getMicStream(): Promise<MediaStream> {
  if (stream && stream.getAudioTracks().some((t) => t.readyState === 'live')) return stream
  stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } })
  return stream
}

export function currentMicStream(): MediaStream | null {
  return stream
}

export function releaseMic() {
  stream?.getTracks().forEach((t) => t.stop())
  stream = null
}

export function recorderMimeType(): string {
  if (typeof MediaRecorder === 'undefined') return ''
  for (const type of ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'])
    if (MediaRecorder.isTypeSupported(type)) return type
  return ''
}

/** Live input level (0–1) of a stream, for the level meter. */
export function createLevelMeter(source: MediaStream): { read: () => number; close: () => void } {
  const AudioCtx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  const ctx = new AudioCtx()
  const analyser = ctx.createAnalyser()
  analyser.fftSize = 512
  ctx.createMediaStreamSource(source).connect(analyser)
  const data = new Uint8Array(analyser.fftSize)
  return {
    read() {
      analyser.getByteTimeDomainData(data)
      let sum = 0
      for (const v of data) sum += ((v - 128) / 128) ** 2
      return Math.min(1, Math.sqrt(sum / data.length) * 4)
    },
    close() {
      void ctx.close()
    },
  }
}
