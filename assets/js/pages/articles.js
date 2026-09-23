(function () {
  const { $, esc, param, fmtDate, store, toast } = window.IELTS;
  const articles = window.IELTS_DATA.articles || [];
  const read = store.get('articles-read', []);

  const id = param('id');
  const article = id && articles.find(a => a.id === id);
  if (article) renderArticle(article); else renderList();

  function renderList() {
    if (id) toast('Article not found');
    $('#article-list').innerHTML = articles.map(a => {
      const first = a.body.find(b => typeof b === 'string') || '';
      const done = read.includes(a.id);
      return `
        <a class="card module-card" href="articles.html?id=${encodeURIComponent(a.id)}">
          <div class="row">
            <span class="chip brand">Day ${a.day}</span>
            ${done ? '<span class="chip good">✓ Read</span>' : ''}
            <span class="faint small">${esc(fmtDate(a.date))}</span>
          </div>
          <h3 style="margin-top:12px">${esc(a.title)}</h3>
          <p class="muted small" style="margin:0">${esc(first.slice(0, 180))}${first.length > 180 ? '…' : ''}</p>
        </a>`;
    }).join('') || '<div class="card empty">No articles yet.</div>';
  }

  function renderArticle(a) {
    document.title = a.title + ' — mrshakhriyor_ielts';
    $('#list-view').classList.add('hidden');
    $('#article-view').classList.remove('hidden');

    const body = a.body.map(b => typeof b === 'string'
      ? `<p>${esc(b)}</p>`
      : `<blockquote>${esc(b.quote)}</blockquote>`).join('');

    const vocab = (a.vocab || []).map(v => `
      <div class="item">
        <span class="word">${esc(v.word)}</span><span class="pos">${esc(v.pos)}</span>
        <div class="small muted">${esc(v.meaning)}</div>
        ${v.example ? `<div class="small faint" style="font-style:italic">“…${esc(v.example)}…”</div>` : ''}
      </div>`).join('');

    const qs = (a.questions || []).map((q, i) => `
      <details class="item">
        <summary><strong>${i + 1}.</strong> ${esc(q.q)}</summary>
        <p class="small muted" style="margin:8px 0 0">${esc(q.a)}</p>
      </details>`).join('');

    const done = read.includes(a.id);
    $('#article-body').innerHTML = `
      <div class="card">
        <div class="spread" style="border-bottom:1px solid var(--border);padding-bottom:12px;margin-bottom:18px">
          <span class="chip brand">Daily Reading · Day ${a.day}</span>
          <span class="faint small">${esc(fmtDate(a.date))} · ${esc(a.source)}</span>
        </div>
        <h1 style="font-size:clamp(26px,4vw,36px);letter-spacing:-.02em">${esc(a.title)}</h1>
        <p class="muted small">${esc(a.byline || '')}</p>
        <div class="body">${body}</div>
      </div>
      ${vocab ? `<div class="section"><h2 style="font-size:20px">Key vocabulary</h2><div class="vocab grid-2 grid">${vocab}</div></div>` : ''}
      ${qs ? `<div class="section"><h2 style="font-size:20px">Check your understanding</h2><p class="muted small">Answer in your head or on paper first, then tap a question to see a model answer.</p><div class="vocab">${qs}</div></div>` : ''}
      <div class="section row">
        <button class="btn" id="mark-read" ${done ? 'disabled' : ''}>${done ? '✓ Marked as read' : 'Mark as read'}</button>
        <a class="btn ghost" href="reading.html">Take a reading test</a>
      </div>`;

    $('#mark-read').addEventListener('click', e => {
      if (!read.includes(a.id)) { read.push(a.id); store.set('articles-read', read); }
      e.target.textContent = '✓ Marked as read';
      e.target.disabled = true;
      toast('Nice work — keep your streak going!');
    });
  }
})();
