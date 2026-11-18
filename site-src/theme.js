/* 主题切换：auto / light / dark
 * 用法：页面 <head> 里放一段内联脚本先应用主题（避免闪白），
 *       body 里放 <div class="theme-slot"></div>，最后引入本文件。
 */
(function () {
  var KEY = 'bp-theme';
  var root = document.documentElement;

  function systemPref() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function resolve(choice) {
    return choice === 'auto' ? systemPref() : choice;
  }
  function apply(choice, persist) {
    var t = resolve(choice);
    root.dataset.choice = choice;
    root.dataset.theme = t;
    if (persist) {
      try { localStorage.setItem(KEY, choice); } catch (e) {}
    }
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', t === 'light' ? '#f7f6f3' : '#0a0b0d');
    document.dispatchEvent(new CustomEvent('themechange', { detail: { theme: t, choice: choice } }));
  }

  function currentChoice() {
    try { return localStorage.getItem(KEY) || 'auto'; } catch (e) { return 'auto'; }
  }

  var CSS = `
  .theme-switch{display:inline-flex;align-items:center;gap:2px;padding:2px;border:1px solid var(--line);
    border-radius:9px;background:var(--bg-2);font-family:var(--mono,ui-monospace,monospace)}
  .theme-switch button{appearance:none;border:0;background:transparent;color:var(--ink-faint,#6b7280);
    font:inherit;font-size:11.5px;line-height:1;padding:5px 8px;border-radius:7px;cursor:pointer;
    letter-spacing:.02em;transition:background .15s,color .15s;display:inline-flex;align-items:center;gap:4px}
  .theme-switch button:hover{color:var(--ink,#111)}
  .theme-switch button[aria-pressed="true"]{background:var(--accent-soft,rgba(224,121,92,.14));
    color:var(--accent,#e0795c)}
  .theme-switch svg{width:12px;height:12px;stroke:currentColor;fill:none;stroke-width:1.6;
    stroke-linecap:round;stroke-linejoin:round}
  `;

  function mount() {
    var slot = document.querySelector('.theme-slot');
    if (!slot) return;
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var icons = {
      auto: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 4v16"/></svg>',
      light: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5.6 5.6 4.2 4.2M19.8 19.8l-1.4-1.4M18.4 5.6l1.4-1.4M4.2 19.8l1.4-1.4"/></svg>',
      dark: '<svg viewBox="0 0 24 24"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a7 7 0 1 0 10.5 10.5z"/></svg>'
    };
    var labels = { auto: '自动', light: '浅色', dark: '深色' };

    var wrap = document.createElement('div');
    wrap.className = 'theme-switch';
    wrap.setAttribute('role', 'group');
    wrap.setAttribute('aria-label', '主题');
    wrap.innerHTML = ['auto', 'light', 'dark']
      .map(function (k) {
        return '<button type="button" data-theme-choice="' + k + '" title="' + labels[k] + '">' + icons[k] + labels[k] + '</button>';
      })
      .join('');
    slot.appendChild(wrap);

    function sync() {
      var c = currentChoice();
      wrap.querySelectorAll('button').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.dataset.themeChoice === c));
      });
    }

    wrap.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-theme-choice]');
      if (!b) return;
      apply(b.dataset.themeChoice, true);
      sync();
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
      if (currentChoice() === 'auto') apply('auto', false);
    });

    sync();
    apply(currentChoice(), false);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
