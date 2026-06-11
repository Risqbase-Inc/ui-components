// Design site — tiny JS helpers. No framework, no build step.

// Copy-to-clipboard on .code-block buttons + .swatch + .copy-on-click
(function () {
  function copyText(text, source) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => flash(source));
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); flash(source); } finally { document.body.removeChild(ta); }
    }
  }
  function flash(el) {
    if (!el) return;
    const prev = el.textContent;
    el.classList.add('copied');
    el.textContent = '✓ Copied';
    setTimeout(() => { el.classList.remove('copied'); el.textContent = prev; }, 900);
  }

  document.addEventListener('click', (e) => {
    const copyBtn = e.target.closest('.code-block .copy');
    if (copyBtn) {
      const code = copyBtn.parentElement.querySelector('pre, code');
      if (code) copyText(code.textContent.trim(), copyBtn);
      return;
    }
    const swatch = e.target.closest('.swatch[data-copy]');
    if (swatch) {
      copyText(swatch.dataset.copy, swatch);
      const flashEl = swatch.querySelector('.hex') || swatch;
      flashEl.style.transition = 'background 200ms';
      const prev = flashEl.style.background;
      flashEl.style.background = 'rgba(255,255,255,0.2)';
      setTimeout(() => { flashEl.style.background = prev; }, 600);
      return;
    }
    const copyClick = e.target.closest('[data-copy]');
    if (copyClick && !swatch) {
      copyText(copyClick.dataset.copy, copyClick);
    }
  });

  // Chart-type filter (charts.html)
  const filterBtns = document.querySelectorAll('[data-filter-group]');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.dataset.filterGroup;
      document.querySelectorAll('[data-filter-group]').forEach(b => b.classList.toggle('is-active', b === btn));
      document.querySelectorAll('[data-group]').forEach(card => {
        const matches = group === 'all' || card.dataset.group === group;
        card.style.display = matches ? '' : 'none';
      });
    });
  });
})();

// Theme switcher (v4.4 B4) — persists to localStorage, defaults to
// prefers-color-scheme. The pre-paint init script in <head> applies the
// stored choice before first render; this handler just toggles + persists.
(function () {
  var KEY = 'risqbase-design-site-theme';
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-theme-toggle]');
    if (!btn) return;
    var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem(KEY, next); } catch (err) { /* private mode */ }
  });
})();
