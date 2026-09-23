(function () {
  const { $, $$, esc, param, fmtTime, fmtDuration, fmtBand, estimateBand, history, createTimer, toast } = window.IELTS;
  const tests = window.IELTS_DATA.readingTests || [];

  const OPTIONS = {
    tfng: ['TRUE', 'FALSE', 'NOT GIVEN'],
    ynng: ['YES', 'NO', 'NOT GIVEN']
  };

  const countQuestions = t => t.groups.reduce((n, g) => n + g.questions.length, 0);
  const normalise = s => String(s || '').toLowerCase().replace(/[’']/g, "'").replace(/[.,;:!?"]+$/g, '').replace(/\s+/g, ' ').trim();
  const accepted = a => (Array.isArray(a) ? a : [a]).map(normalise);

  const id = param('id');
  const test = id && tests.find(t => t.id === id);
  if (test) runTest(test); else renderList();

  /* ---------------- List ---------------- */
  function renderList() {
    if (id) toast('Test not found — showing all tests');
    const past = history.all().filter(h => h.module === 'reading');
    $('#test-list').innerHTML = tests.map(t => {
      const attempts = past.filter(h => h.id === t.id);
      const best = attempts.length ? Math.max(...attempts.map(a => a.score)) : null;
      const total = countQuestions(t);
      return `
        <div class="card test-card">
          <div class="row">
            <span class="chip brand">${esc(t.level)}</span>
            ${t.topics.map(x => `<span class="chip">${esc(x)}</span>`).join('')}
          </div>
          <h3 style="margin:4px 0 0">${esc(t.title)}</h3>
          <p class="muted small" style="margin:0">${esc(t.subtitle || '')}</p>
          <div class="foot">
            <span class="faint small">${total} questions · ${t.minutes} min${best != null ? ` · best <strong style="color:var(--good)">${best}/${total}</strong>` : ''}</span>
            <a class="btn sm" href="reading.html?id=${encodeURIComponent(t.id)}">${attempts.length ? 'Retake' : 'Start'}</a>
          </div>
        </div>`;
    }).join('') || '<div class="card empty">No tests yet.</div>';
  }

  /* ---------------- Runner ---------------- */
  function runTest(t) {
    document.title = t.title + ' — Reading — mrshakhriyor_ielts';
    $('#list-view').classList.add('hidden');
    $('#test-view').classList.remove('hidden');

    const total = countQuestions(t);
    $('#t-title').textContent = t.title;
    $('#t-meta').textContent = `${total} questions · ${t.minutes} min`;

    // Passage
    const letter = i => String.fromCharCode(65 + i);
    $('#t-passage').innerHTML = `
      <h2>${esc(t.title)}</h2>
      ${t.subtitle ? `<div class="sub">${esc(t.subtitle)}</div>` : ''}
      ${t.paragraphs.map((p, i) => `<p>${t.labelled ? `<span class="para-label">${letter(i)}</span>` : ''}${esc(p)}</p>`).join('')}`;

    // Questions
    let n = 0;
    const flat = [];
    const form = $('#t-form');
    form.innerHTML = t.groups.map((g, gi) => {
      const first = n + 1;
      const items = g.questions.map(q => {
        n++;
        flat.push({ n, q, group: g });
        return `<div class="q" id="q${n}">
          <div class="q-text"><span class="q-num">${n}</span>${renderText(q.text)}</div>
          ${renderInput(g, n)}
        </div>`;
      }).join('');
      return `<div class="q-group">
        <h3>Questions ${first}${n > first ? '–' + n : ''}</h3>
        <p class="instructions">${esc(g.instructions)}</p>
        ${items}
      </div>`;
    }).join('') + `<button type="submit" class="btn block">Submit answers</button>
      <p class="faint tiny" style="text-align:center;margin-top:8px">Answers are saved on this device only.</p>`;

    // Timer
    const timerEl = $('#t-timer');
    const timer = createTimer({
      seconds: t.minutes * 60,
      countdown: true,
      onTick: s => { timerEl.textContent = fmtTime(s); timerEl.classList.toggle('low', s <= 120); },
      onEnd: () => { toast("Time's up — your answers were submitted"); submit(true); }
    });
    timer.start();

    form.addEventListener('submit', e => { e.preventDefault(); submit(false); });

    let submitted = false;
    function submit(auto) {
      if (submitted) return;
      const fd = new FormData(form);
      const blanks = flat.filter(f => !String(fd.get('q' + f.n) || '').trim()).length;
      if (!auto && blanks && !confirm(`You have ${blanks} unanswered question${blanks > 1 ? 's' : ''}. Submit anyway?`)) return;
      submitted = true;
      timer.stop();

      let score = 0;
      flat.forEach(({ n, q }) => {
        const given = String(fd.get('q' + n) || '').trim();
        const ok = given !== '' && accepted(q.answer).includes(normalise(given));
        if (ok) score++;
        const el = $('#q' + n);
        el.classList.add(ok ? 'correct' : 'wrong');
        const correct = Array.isArray(q.answer) ? q.answer[0] : q.answer;
        el.insertAdjacentHTML('beforeend', `<div class="feedback ${ok ? 'good' : 'bad'}">
          ${ok ? '✓ Correct' : `✗ Your answer: <strong>${esc(given || 'blank')}</strong> · Correct: <strong>${esc(correct)}</strong>`}
          ${q.explain ? `<span class="why">${esc(q.explain)}</span>` : ''}
        </div>`);
      });
      $$('input, select', form).forEach(i => { i.disabled = true; });
      form.querySelector('button[type=submit]').classList.add('hidden');

      const seconds = timer.elapsed;
      const band = estimateBand(score, total, 'academic');
      history.add({ module: 'reading', id: t.id, title: t.title, score, total, band, seconds });

      const res = $('#t-result');
      res.classList.remove('hidden');
      res.innerHTML = `
        <div class="result-box">
          <div class="eyebrow">Your score</div>
          <div class="score">${score} / ${total}</div>
          <div class="row" style="justify-content:center">
            <span class="chip brand">Estimated band ${fmtBand(band)}</span>
            <span class="chip">Time ${fmtDuration(seconds)}</span>
          </div>
          <p class="faint tiny" style="margin:12px 0 0">The band is an estimate: your score is scaled to a 40-question Academic test.</p>
          <div class="row" style="justify-content:center;margin-top:14px">
            <a class="btn sm" href="reading.html?id=${encodeURIComponent(t.id)}">Try again</a>
            <a class="btn ghost sm" href="dashboard.html">View progress</a>
          </div>
        </div>
        <p class="muted small">Review the explanations below each question.</p>`;
      // Show the result at the top of the questions pane
      const pane = $('#t-questions-pane');
      pane.prepend(res);
      pane.scrollTop = 0;
      res.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    window.addEventListener('beforeunload', e => {
      if (!submitted && timer.elapsed > 10) { e.preventDefault(); e.returnValue = ''; }
    });

    setupHighlighter();
  }

  function renderText(text) {
    // "____" marks a gap in sentence/note completion questions
    return esc(text).replace(/_{3,}/g, '<span style="color:var(--brand);font-weight:800">________</span>');
  }

  function renderInput(g, n) {
    if (g.type === 'gap') {
      return `<input class="input" type="text" name="q${n}" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Your answer" aria-label="Answer ${n}" />`;
    }
    const opts = g.type === 'choice'
      ? g.options
      : (OPTIONS[g.type] || []).map(v => ({ value: v, label: v }));
    return `<div class="options${g.column ? ' col' : ''}" role="radiogroup" aria-label="Answer ${n}">
      ${opts.map(o => `<label class="opt"><input type="radio" name="q${n}" value="${esc(o.value)}" /><span>${esc(o.label)}</span></label>`).join('')}
    </div>`;
  }

  /* ---------------- Highlighter ---------------- */
  function setupHighlighter() {
    const passage = $('#t-passage');
    const toggle = $('#highlight-toggle');
    passage.addEventListener('mouseup', () => {
      if (!toggle.checked) return;
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.rangeCount) return;
      const range = sel.getRangeAt(0);
      if (!passage.contains(range.commonAncestorContainer)) return;
      try {
        const mark = document.createElement('mark');
        range.surroundContents(mark);
      } catch (e) {
        toast('Highlight within a single paragraph');
      }
      sel.removeAllRanges();
    });
    passage.addEventListener('click', e => {
      const m = e.target.closest('mark');
      if (!m || !toggle.checked) return;
      m.replaceWith(...m.childNodes);
      passage.normalize();
    });
  }
})();
