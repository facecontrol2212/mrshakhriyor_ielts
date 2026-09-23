(function () {
  const { $, $$, rawToBand, overallBand, fmtBand, store } = window.IELTS;

  let module = store.get('calc-module', 'academic');
  const bands = [];
  for (let b = 9; b >= 0; b -= 0.5) bands.push(b);
  ['#c-writing', '#c-speaking'].forEach(sel => {
    $(sel).innerHTML = '<option value="">Select…</option>' + bands.map(b => `<option value="${b}">${b.toFixed(1)}</option>`).join('');
  });

  // Restore last inputs
  const saved = store.get('calc', {});
  ['listening', 'reading', 'writing', 'speaking'].forEach(k => { if (saved[k] != null) $('#c-' + k).value = saved[k]; });

  $$('#module-tabs .tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.module === module);
    btn.addEventListener('click', () => {
      module = btn.dataset.module;
      store.set('calc-module', module);
      $$('#module-tabs .tab').forEach(b => b.classList.toggle('active', b === btn));
      update();
    });
  });

  $$('input, select').forEach(el => el.addEventListener('input', update));

  function readRaw(id) {
    const el = $(id);
    if (el.value === '') return null;
    const v = Math.max(0, Math.min(40, Math.round(Number(el.value))));
    if (String(v) !== el.value) el.value = v;
    return v;
  }

  function update() {
    const l = readRaw('#c-listening');
    const r = readRaw('#c-reading');
    const w = $('#c-writing').value === '' ? null : Number($('#c-writing').value);
    const s = $('#c-speaking').value === '' ? null : Number($('#c-speaking').value);
    store.set('calc', { listening: l, reading: r, writing: w, speaking: s });

    const lb = l == null ? null : rawToBand(l, 'listening');
    const rb = r == null ? null : rawToBand(r, module);
    $('#b-listening').textContent = fmtBand(lb);
    $('#b-reading').textContent = fmtBand(rb);
    $('#b-writing').textContent = fmtBand(w);
    $('#b-speaking').textContent = fmtBand(s);

    const all = [lb, rb, w, s];
    const filled = all.filter(x => x != null);
    const overall = overallBand(filled);
    $('#c-overall').textContent = fmtBand(overall);
    if (!filled.length) {
      $('#c-note').textContent = 'Fill in all four skills to see your overall band.';
    } else if (filled.length < 4) {
      $('#c-note').textContent = `Estimate based on ${filled.length} of 4 skills.`;
    } else {
      const avg = filled.reduce((a, b) => a + b, 0) / 4;
      $('#c-note').textContent = `Average ${avg.toFixed(3).replace(/0+$/, '').replace(/\.$/, '')} → rounded to ${fmtBand(overall)}.`;
    }
    renderTable();
  }

  function renderTable() {
    const ranges = [];
    for (let raw = 40; raw >= 0; raw--) {
      const b = rawToBand(raw, module);
      const last = ranges[ranges.length - 1];
      if (last && last.band === b) last.min = raw;
      else ranges.push({ band: b, max: raw, min: raw });
    }
    const rows = ranges.filter(x => x.band >= 4);
    $('#c-table').innerHTML = `<thead><tr><th>Correct answers</th><th>Band</th></tr></thead><tbody>` +
      rows.map(x => `<tr><td>${x.min === x.max ? x.min : x.min + '–' + x.max}</td><td><strong>${fmtBand(x.band)}</strong></td></tr>`).join('') +
      '</tbody>';
  }

  update();
})();
