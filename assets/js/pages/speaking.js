(function () {
  const { $, $$, esc, fmtTime, history, createTimer, toast } = window.IELTS;
  const data = window.IELTS_DATA.speaking || { part1: [], part2: [] };

  const PREP = 60, TALK = 120;

  /* ---------------- Tabs ---------------- */
  $$('#part-tabs .tab').forEach(btn => btn.addEventListener('click', () => {
    $$('#part-tabs .tab').forEach(b => b.classList.toggle('active', b === btn));
    $('#part-1').classList.toggle('hidden', btn.dataset.part !== '1');
    $('#part-2').classList.toggle('hidden', btn.dataset.part !== '2');
  }));

  /* ---------------- Part 1 ---------------- */
  $('#p1-list').innerHTML = data.part1.map(t => `
    <div class="card">
      <div class="eyebrow">Topic</div>
      <h3>${esc(t.topic)}</h3>
      <ol class="small muted" style="padding-left:18px;margin:0">${t.questions.map(q => `<li style="margin-bottom:4px">${esc(q)}</li>`).join('')}</ol>
    </div>`).join('');

  /* ---------------- Part 2 ---------------- */
  let index = 0;
  function showCard(i) {
    stop(false);
    index = (i + data.part2.length) % data.part2.length;
    const c = data.part2[index];
    $('#cue-card').innerHTML = `
      <div class="spread"><span class="eyebrow">Cue card ${index + 1} of ${data.part2.length}</span></div>
      <h3 style="font-size:20px;margin-top:10px">${esc(c.title)}</h3>
      <div class="small muted">You should say:</div>
      <ul>${c.points.map(p => `<li>${esc(p)}</li>`).join('')}</ul>
      <p class="small" style="margin:8px 0 0">${esc(c.explain)}</p>`;
    $('#p3-list').innerHTML = c.part3.map(q => `<li>${esc(q)}</li>`).join('');
  }
  $('#prev-card').addEventListener('click', () => showCard(index - 1));
  $('#next-card').addEventListener('click', () => showCard(index + 1));
  $('#random-card').addEventListener('click', () => {
    if (data.part2.length < 2) return;
    let r; do { r = Math.floor(Math.random() * data.part2.length); } while (r === index);
    showCard(r);
  });

  const timerEl = $('#s-timer');
  const bar = $('#s-progress');
  const phaseEl = $('#phase');
  let phase = 'ready';
  let phaseTotal = PREP;

  const timer = createTimer({
    countdown: true,
    seconds: PREP,
    onTick: s => {
      timerEl.textContent = fmtTime(s);
      bar.style.width = ((phaseTotal - s) / phaseTotal) * 100 + '%';
    },
    onEnd: () => (phase === 'prep' ? startTalk() : finish())
  });

  function setButtons() {
    $('#s-start').classList.toggle('hidden', phase !== 'ready');
    $('#s-skip').classList.toggle('hidden', phase !== 'prep');
    $('#s-stop').classList.toggle('hidden', phase === 'ready');
  }

  function startPrep() {
    phase = 'prep'; phaseTotal = PREP;
    phaseEl.textContent = 'Preparation — make notes';
    $('#s-playback').classList.add('hidden');
    timer.reset(PREP); timer.start();
    setButtons();
  }

  function startTalk() {
    timer.stop();
    phase = 'talk'; phaseTotal = TALK;
    phaseEl.textContent = 'Speak now';
    timer.reset(TALK); timer.start();
    setButtons();
    if ($('#s-record').checked) startRecording();
  }

  function finish() {
    const spoke = phase === 'talk' ? timer.elapsed : 0;
    stop(true);
    if (spoke > 0) {
      history.add({ module: 'speaking', id: 'p2-' + index, title: data.part2[index].title, seconds: PREP + spoke });
      toast('Well done! Now try the Part 3 questions below.');
    }
  }

  function stop(keepRecording) {
    timer.stop();
    stopRecording(keepRecording);
    phase = 'ready';
    phaseEl.textContent = 'Ready';
    timer.reset(PREP);
    bar.style.width = '0';
    setButtons();
  }

  $('#s-start').addEventListener('click', startPrep);
  $('#s-skip').addEventListener('click', startTalk);
  $('#s-stop').addEventListener('click', finish);

  /* ---------------- Recording ---------------- */
  let recorder = null, chunks = [], stream = null, keep = true;

  async function startRecording() {
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      toast('Recording is not supported in this browser');
      return;
    }
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e) {
      toast('Microphone permission was denied');
      return;
    }
    if (phase !== 'talk') { stream.getTracks().forEach(t => t.stop()); return; }
    chunks = [];
    keep = true;
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = e => e.data.size && chunks.push(e.data);
    recorder.onstop = () => {
      stream.getTracks().forEach(t => t.stop());
      if (!keep || !chunks.length) return;
      const audio = $('#s-audio');
      if (audio.src) URL.revokeObjectURL(audio.src);
      audio.src = URL.createObjectURL(new Blob(chunks, { type: recorder.mimeType || 'audio/webm' }));
      $('#s-playback').classList.remove('hidden');
    };
    recorder.start();
    phaseEl.textContent = 'Speak now · ● recording';
  }

  function stopRecording(keepIt) {
    if (recorder && recorder.state !== 'inactive') { keep = keepIt; recorder.stop(); }
    recorder = null;
  }

  showCard(0);
})();
