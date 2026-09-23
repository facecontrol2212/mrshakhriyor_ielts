(function () {
  const { $, $$, esc, fmtTime, wordCount, store, createTimer, toast, param } = window.IELTS;
  const prompts = window.IELTS_DATA.writingPrompts || [];
  const criteria = window.IELTS_DATA.writingCriteria || [];

  const essay = $('#essay');
  const select = $('#prompt-select');
  const timerEl = $('#w-timer');
  const startBtn = $('#w-start');
  let current = null;
  let saveTimer = null;

  const timer = createTimer({
    countdown: true,
    onTick: s => { timerEl.textContent = fmtTime(s); timerEl.classList.toggle('low', s <= 180); },
    onEnd: () => { startBtn.textContent = 'Start timer'; toast("Time's up! Finish your sentence and save."); }
  });

  // Criteria checklist
  $('#criteria').innerHTML = criteria.map(c => `
    <div style="margin-bottom:10px">
      <div class="eyebrow" style="margin:8px 0 2px">${esc(c.name)}</div>
      ${c.checks.map(ch => `<label><input type="checkbox" /> <span>${esc(ch)}</span></label>`).join('')}
    </div>`).join('');

  // Tabs
  $$('#task-tabs .tab').forEach(btn => btn.addEventListener('click', () => selectTask(Number(btn.dataset.task))));

  select.addEventListener('change', () => loadPrompt(select.value));

  function selectTask(task, promptId) {
    $$('#task-tabs .tab').forEach(b => {
      const on = Number(b.dataset.task) === task;
      b.classList.toggle('active', on);
      b.setAttribute('aria-selected', String(on));
    });
    const list = prompts.filter(p => p.task === task);
    select.innerHTML = list.map(p => `<option value="${esc(p.id)}">${esc(p.type)} — ${esc(p.prompt.slice(0, 48))}…</option>`).join('');
    const target = promptId && list.find(p => p.id === promptId) ? promptId : list[0] && list[0].id;
    if (target) { select.value = target; loadPrompt(target); }
  }

  function loadPrompt(id) {
    saveDraft();
    current = prompts.find(p => p.id === id);
    if (!current) return;
    $('#prompt-box').innerHTML = `
      <div class="row" style="margin-bottom:10px">
        <span class="chip brand">Task ${current.task}</span>
        <span class="chip">${esc(current.type)}</span>
      </div>
      <p class="small" style="white-space:pre-line">${esc(current.prompt)}</p>
      ${current.chart ? `<div class="chart-figure">${renderChart(current.chart)}</div>` : ''}
      <p class="faint tiny" style="margin:10px 0 0">Spend about ${current.minutes} minutes. Write at least ${current.minWords} words.</p>`;
    essay.value = store.get('draft:' + id, '');
    timer.reset(current.minutes * 60);
    startBtn.textContent = 'Start timer';
    $('#w-saved').textContent = essay.value ? 'Draft restored' : '';
    updateCount();
    window.history.replaceState(null, '', '?id=' + encodeURIComponent(id));
  }

  function updateCount() {
    const n = wordCount(essay.value);
    const min = current ? current.minWords : 0;
    const el = $('#w-count');
    el.textContent = `${n} / ${min} words`;
    el.className = 'chip ' + (n >= min ? 'good' : n >= min * 0.8 ? 'warn' : '');
  }

  function saveDraft() {
    if (!current) return;
    store.set('draft:' + current.id, essay.value);
    $('#w-saved').textContent = 'Saved ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  essay.addEventListener('input', () => {
    updateCount();
    if (!timer.running && timer.elapsed === 0 && essay.value.length === 1) {
      timer.start();
      startBtn.textContent = 'Pause';
    }
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveDraft, 800);
  });

  startBtn.addEventListener('click', () => {
    if (timer.running) { timer.stop(); startBtn.textContent = 'Resume'; }
    else { timer.start(); startBtn.textContent = 'Pause'; essay.focus(); }
  });
  $('#w-reset').addEventListener('click', () => { timer.reset(current.minutes * 60); startBtn.textContent = 'Start timer'; });
  $('#w-clear').addEventListener('click', () => {
    if (!essay.value || confirm('Clear your answer? This cannot be undone.')) {
      essay.value = ''; saveDraft(); updateCount();
    }
  });

  $('#w-finish').addEventListener('click', () => {
    const words = wordCount(essay.value);
    if (!words) return toast('Write something first');
    if (words < current.minWords && !confirm(`Your answer has ${words} words — fewer than the ${current.minWords} required. Under-length answers lose marks. Save anyway?`)) return;
    timer.stop();
    startBtn.textContent = 'Start timer';
    const essays = store.get('essays', []);
    essays.push({ id: current.id, task: current.task, type: current.type, prompt: current.prompt, text: essay.value, words, seconds: timer.elapsed, date: new Date().toISOString() });
    store.set('essays', essays);
    window.IELTS.history.add({ module: 'writing', id: current.id, title: `Task ${current.task}: ${current.type}`, words, seconds: timer.elapsed });
    store.remove('draft:' + current.id);
    essay.value = '';
    updateCount();
    toast('Saved to My Progress ✓');
  });

  window.addEventListener('beforeunload', saveDraft);

  /* Simple grouped bar chart as inline SVG */
  function renderChart(c) {
    const W = 340, H = 220, padL = 34, padB = 28, padT = 10;
    const plotW = W - padL - 8, plotH = H - padB - padT;
    const colors = ['var(--brand)', 'var(--good)', 'var(--warn)', 'var(--bad)'];
    const groupW = plotW / c.categories.length;
    const barW = (groupW * 0.7) / c.series.length;
    const y = v => padT + plotH - (v / c.max) * plotH;
    let svg = `<svg viewBox="0 0 ${W} ${H + 24}" width="100%" role="img" aria-label="Bar chart">`;
    for (let t = 0; t <= c.max; t += c.max / 4) {
      svg += `<line x1="${padL}" x2="${W - 8}" y1="${y(t)}" y2="${y(t)}" stroke="var(--border)" />
              <text x="${padL - 6}" y="${y(t) + 4}" font-size="10" text-anchor="end" fill="var(--text-3)">${t}${c.unit}</text>`;
    }
    c.categories.forEach((cat, ci) => {
      const gx = padL + ci * groupW + groupW * 0.15;
      c.series.forEach((s, si) => {
        const v = s.values[ci];
        svg += `<rect x="${gx + si * barW}" y="${y(v)}" width="${barW - 2}" height="${padT + plotH - y(v)}" fill="${colors[si % colors.length]}" rx="2"><title>${esc(s.name)} ${esc(cat)}: ${v}${c.unit}</title></rect>`;
      });
      svg += `<text x="${padL + ci * groupW + groupW / 2}" y="${H - 10}" font-size="11" text-anchor="middle" fill="var(--text-2)">${esc(cat)}</text>`;
    });
    let lx = padL;
    c.series.forEach((s, si) => {
      svg += `<rect x="${lx}" y="${H + 6}" width="10" height="10" fill="${colors[si % colors.length]}" rx="2"/>
              <text x="${lx + 14}" y="${H + 15}" font-size="11" fill="var(--text-2)">${esc(s.name)}</text>`;
      lx += 80;
    });
    return svg + '</svg>';
  }

  // Initial prompt (supports writing.html?id=…)
  const initial = prompts.find(p => p.id === param('id'));
  selectTask(initial ? initial.task : 1, initial && initial.id);
})();
