(function () {
  const { $, esc, fmtBand, fmtDate, fmtDuration, overallBand, profile, history, store, toast } = window.IELTS;
  const EXPORT_KEYS = ['profile', 'history', 'essays', 'articles-read'];

  // Profile
  const targetSel = $('#p-target');
  for (let b = 9; b >= 4; b -= 0.5) targetSel.insertAdjacentHTML('beforeend', `<option value="${b}">${b.toFixed(1)}</option>`);

  function loadProfile() {
    const p = profile.get();
    $('#p-name').value = p.name || '';
    targetSel.value = String(p.target || 7);
    $('#d-hello').textContent = p.name ? `${p.name}'s progress` : 'My progress';
  }

  $('#profile-form').addEventListener('submit', e => {
    e.preventDefault();
    profile.save({ name: $('#p-name').value.trim(), target: Number(targetSel.value) });
    loadProfile();
    render();
    toast('Profile saved');
  });

  function render() {
    const all = history.all();
    const reading = all.filter(h => h.module === 'reading');
    const target = profile.get().target || 7;

    $('#d-tests').textContent = reading.length;
    $('#d-band').textContent = reading.length ? fmtBand(overallBand(reading.map(h => h.band))) : '–';
    $('#d-essays').textContent = all.filter(h => h.module === 'writing').length;
    $('#d-time').textContent = fmtDuration(all.reduce((a, h) => a + (h.seconds || 0), 0));

    // Trend chart: last 10 reading attempts
    const last = reading.slice(-10);
    $('#d-chart').innerHTML = last.length ? `
      <div class="bars" role="img" aria-label="Estimated reading band for the last ${last.length} tests">
        ${last.map(h => `
          <div class="bar-col" title="${esc(h.title)} — ${h.score}/${h.total}">
            <span class="bar-val">${fmtBand(h.band)}</span>
            <div class="bar" style="height:${Math.max(4, (h.band / 9) * 120)}px;${h.band >= target ? 'background:var(--good)' : ''}"></div>
            <span class="bar-label">${esc(new Date(h.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }))}</span>
          </div>`).join('')}
      </div>
      <p class="faint tiny" style="margin:8px 0 0">Green bars reached your target of ${fmtBand(target)}.</p>`
      : '<div class="empty">Take a <a href="reading.html">reading test</a> to see your trend.</div>';

    // History table
    const label = { reading: 'Reading', writing: 'Writing', speaking: 'Speaking' };
    $('#d-history').innerHTML = all.slice().reverse().map(h => {
      let result = '';
      if (h.module === 'reading') result = `<strong>${h.score}/${h.total}</strong> · band ${fmtBand(h.band)}`;
      else if (h.module === 'writing') result = `${h.words} words`;
      else result = 'Completed';
      return `<tr>
        <td>${esc(fmtDate(h.date))}</td>
        <td><span class="chip">${label[h.module] || esc(h.module)}</span></td>
        <td>${esc(h.title)}</td>
        <td>${result}</td>
        <td class="faint">${fmtDuration(h.seconds)}</td>
      </tr>`;
    }).join('') || '<tr><td colspan="5" class="empty">No activity yet — start with a <a href="reading.html">reading test</a>.</td></tr>';

    // Essays
    const essays = store.get('essays', []);
    $('#d-essays-list').innerHTML = essays.slice().reverse().map(e => `
      <details class="item">
        <summary><strong>Task ${e.task}: ${esc(e.type)}</strong> <span class="faint small">· ${esc(fmtDate(e.date))} · ${e.words} words</span></summary>
        <p class="small muted" style="white-space:pre-line;margin-top:10px">${esc(e.prompt)}</p>
        <div style="white-space:pre-wrap;font-family:var(--serif);border-top:1px solid var(--border);padding-top:10px">${esc(e.text)}</div>
      </details>`).join('') || '<div class="empty">No essays yet. <a href="writing.html">Write your first one</a>.</div>';
  }

  // Export / import / reset
  $('#d-export').addEventListener('click', () => {
    const payload = { app: 'mrshakhriyor_ielts', exported: new Date().toISOString() };
    EXPORT_KEYS.forEach(k => { payload[k] = store.get(k, null); });
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `ielts-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });

  $('#d-import').addEventListener('change', async e => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (data.app !== 'mrshakhriyor_ielts') throw new Error('bad file');
      if (!confirm('Replace your current progress with the imported file?')) return;
      EXPORT_KEYS.forEach(k => { if (data[k] != null) store.set(k, data[k]); });
      loadProfile(); render();
      toast('Progress imported');
    } catch (err) {
      toast('That file is not a valid progress export');
    } finally {
      e.target.value = '';
    }
  });

  $('#d-reset').addEventListener('click', () => {
    if (!confirm('Delete all your test history and essays? Consider exporting first.')) return;
    history.clear();
    store.remove('essays');
    render();
    toast('History cleared');
  });

  loadProfile();
  render();
})();
