(function () {
  const { $, esc, fmtBand, fmtDate, fmtDuration, profile, history } = window.IELTS;

  const p = profile.get();
  const all = history.all();
  const reading = all.filter(h => h.module === 'reading');

  $('#home-target').textContent = fmtBand(p.target);
  $('#home-latest').textContent = reading.length ? fmtBand(reading[reading.length - 1].band) : '–';
  $('#home-tests').textContent = reading.length;
  $('#home-essays').textContent = all.filter(h => h.module === 'writing').length;
  $('#home-time').textContent = fmtDuration(all.reduce((a, h) => a + (h.seconds || 0), 0)).replace(/ 0s$/, '');

  const article = (window.IELTS_DATA.articles || [])[0];
  const box = $('#home-article');
  if (article) {
    box.href = 'articles.html?id=' + encodeURIComponent(article.id);
    const first = article.body.find(b => typeof b === 'string') || '';
    box.innerHTML = `
      <div class="row"><span class="chip brand">Day ${article.day}</span><span class="faint small">${esc(fmtDate(article.date))} · ${esc(article.source)}</span></div>
      <h3 style="margin-top:12px;font-size:22px">${esc(article.title)}</h3>
      <p class="muted" style="margin:0">${esc(first.slice(0, 220))}${first.length > 220 ? '…' : ''}</p>`;
  } else {
    box.classList.add('hidden');
  }
})();
