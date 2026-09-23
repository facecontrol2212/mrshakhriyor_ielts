/* mrshakhriyor_ielts — shared layout, storage and scoring helpers.
 * Plain script (no modules) so the site also works when opened from disk. */
(function () {
  'use strict';

  const SITE = {
    name: 'mrshakhriyor_ielts',
    tagline: 'IELTS practice & daily reading',
    telegram: '' // optional: e.g. 'https://t.me/your_channel'
  };

  const NAV = [
    { href: 'index.html', label: 'Home', key: 'home' },
    { href: 'reading.html', label: 'Reading', key: 'reading' },
    { href: 'writing.html', label: 'Writing', key: 'writing' },
    { href: 'speaking.html', label: 'Speaking', key: 'speaking' },
    { href: 'articles.html', label: 'Daily Articles', key: 'articles' },
    { href: 'calculator.html', label: 'Band Calculator', key: 'calculator' },
    { href: 'dashboard.html', label: 'My Progress', key: 'dashboard' }
  ];

  /* ---------------- Storage ---------------- */
  const PREFIX = 'msi:';
  const store = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem(PREFIX + key);
        return raw == null ? fallback : JSON.parse(raw);
      } catch (e) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); } catch (e) { /* private mode */ }
    },
    remove(key) {
      try { localStorage.removeItem(PREFIX + key); } catch (e) { /* ignore */ }
    }
  };

  const profile = {
    get() { return store.get('profile', { name: '', target: 7 }); },
    save(p) { store.set('profile', p); }
  };

  /** Activity log shared by every module: {module, id, title, score, total, band, seconds, date} */
  const history = {
    all() { return store.get('history', []); },
    add(entry) {
      const list = history.all();
      list.push(Object.assign({ date: new Date().toISOString() }, entry));
      store.set('history', list);
    },
    clear() { store.remove('history'); }
  };

  /* ---------------- Band scores ---------------- */
  // Official-style raw score (out of 40) → band conversion tables.
  const BAND_TABLES = {
    listening: [[39, 9], [37, 8.5], [35, 8], [32, 7.5], [30, 7], [26, 6.5], [23, 6], [18, 5.5], [16, 5], [13, 4.5], [10, 4], [8, 3.5], [6, 3], [4, 2.5], [2, 2], [1, 1], [0, 0]],
    academic: [[39, 9], [37, 8.5], [35, 8], [33, 7.5], [30, 7], [27, 6.5], [23, 6], [19, 5.5], [15, 5], [13, 4.5], [10, 4], [8, 3.5], [6, 3], [4, 2.5], [2, 2], [1, 1], [0, 0]],
    general: [[40, 9], [39, 8.5], [37, 8], [36, 7.5], [34, 7], [32, 6.5], [30, 6], [27, 5.5], [23, 5], [19, 4.5], [15, 4], [12, 3.5], [9, 3], [6, 2.5], [3, 2], [1, 1], [0, 0]]
  };

  function rawToBand(raw, table) {
    const rows = BAND_TABLES[table] || BAND_TABLES.academic;
    for (const [min, band] of rows) if (raw >= min) return band;
    return 0;
  }

  /** Estimate a band from a partial test by scaling the score to 40 questions. */
  function estimateBand(score, total, table) {
    if (!total) return 0;
    return rawToBand(Math.round((score / total) * 40), table || 'academic');
  }

  /** IELTS overall: mean of four skills, rounded to nearest half band (.25 and .75 round up). */
  function overallBand(bands) {
    const valid = bands.filter(b => typeof b === 'number' && !isNaN(b));
    if (!valid.length) return null;
    const avg = valid.reduce((a, b) => a + b, 0) / valid.length;
    return Math.floor(avg * 2 + 0.5) / 2;
  }

  function fmtBand(b) { return b == null ? '–' : Number(b).toFixed(1); }

  /* ---------------- Small utils ---------------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function fmtTime(totalSeconds) {
    const s = Math.max(0, Math.round(totalSeconds));
    const m = Math.floor(s / 60);
    return String(m).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
  }

  function fmtDuration(totalSeconds) {
    const s = Math.max(0, Math.round(totalSeconds || 0));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    if (h) return h + 'h ' + m + 'm';
    return m + 'm ' + (s % 60) + 's';
  }

  function fmtDate(iso) {
    const d = new Date(iso);
    if (isNaN(d)) return iso;
    return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function wordCount(text) {
    const m = String(text || '').trim().match(/[A-Za-z0-9À-ɏ'’-]+/g);
    return m ? m.length : 0;
  }

  function param(name) { return new URLSearchParams(location.search).get(name); }

  let toastTimer;
  function toast(msg) {
    let el = $('.toast');
    if (!el) { el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
  }

  /** Count-down or count-up timer. onTick(secondsShown), onEnd() for countdown. */
  function createTimer({ seconds = 0, countdown = false, onTick, onEnd }) {
    let elapsed = 0, id = null;
    const shown = () => (countdown ? seconds - elapsed : elapsed);
    return {
      start() {
        if (id) return;
        onTick && onTick(shown());
        id = setInterval(() => {
          elapsed++;
          onTick && onTick(shown());
          if (countdown && elapsed >= seconds) { this.stop(); onEnd && onEnd(); }
        }, 1000);
      },
      stop() { clearInterval(id); id = null; },
      reset(newSeconds) { this.stop(); elapsed = 0; if (newSeconds != null) seconds = newSeconds; onTick && onTick(shown()); },
      get elapsed() { return elapsed; },
      get running() { return !!id; }
    };
  }

  /* ---------------- Theme ---------------- */
  function applyTheme(t) {
    if (t) document.documentElement.setAttribute('data-theme', t);
    else document.documentElement.removeAttribute('data-theme');
  }
  applyTheme(store.get('theme', null));

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') ||
      (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next = current === 'dark' ? 'light' : 'dark';
    store.set('theme', next);
    applyTheme(next);
  }

  /* ---------------- Layout ---------------- */
  function renderLayout() {
    const page = document.body.dataset.page;
    const header = document.createElement('header');
    header.className = 'site-header';
    header.innerHTML = `
      <div class="container bar">
        <a class="logo" href="index.html">
          <span class="logo-mark">SI</span>
          <span>${esc(SITE.name)}<small>${esc(SITE.tagline)}</small></span>
        </a>
        <nav class="nav" id="site-nav" aria-label="Main">
          ${NAV.map(n => `<a href="${n.href}" class="${n.key === page ? 'active' : ''}"${n.key === page ? ' aria-current="page"' : ''}>${n.label}</a>`).join('')}
        </nav>
        <div class="header-actions">
          <button class="icon-btn" id="theme-btn" title="Toggle dark mode" aria-label="Toggle dark mode">◐</button>
          <button class="icon-btn menu-btn" id="menu-btn" aria-label="Open menu" aria-expanded="false" aria-controls="site-nav">☰</button>
        </div>
      </div>`;
    document.body.prepend(header);

    const footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.innerHTML = `
      <div class="container">
        <span>© ${new Date().getFullYear()} ${esc(SITE.name)} — practise a little every day.</span>
        <span>IELTS is a registered trademark of the University of Cambridge, the British Council and IDP. This site is an independent study resource.</span>
      </div>`;
    document.body.appendChild(footer);

    $('#theme-btn').addEventListener('click', toggleTheme);
    const menuBtn = $('#menu-btn');
    menuBtn.addEventListener('click', () => {
      const nav = $('#site-nav');
      const open = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(open));
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', renderLayout);
  else renderLayout();

  window.IELTS = {
    SITE, store, profile, history,
    rawToBand, estimateBand, overallBand, fmtBand,
    $, $$, esc, fmtTime, fmtDuration, fmtDate, wordCount, param, toast, createTimer,
    data: window.IELTS_DATA || (window.IELTS_DATA = {})
  };
})();
