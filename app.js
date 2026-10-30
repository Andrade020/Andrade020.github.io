/* shared site logic */
(function () {
  const root = document.body;
  const html = document.documentElement;
  const isPT = () => root.classList.contains('lang-pt');
  const isLight = () => root.classList.contains('light-mode');

  // theme
  if (localStorage.getItem('lra-theme') === 'light') root.classList.add('light-mode');

  // language
  if (localStorage.getItem('lra-lang') === 'pt') root.classList.add('lang-pt');

  // keep <html lang>, control labels and button glyphs in step with the active language/theme
  function syncControls() {
    const pt = isPT();
    html.lang = pt ? 'pt-BR' : 'en';

    document.querySelectorAll('[data-lang-btn]').forEach(btn => {
      btn.innerHTML = pt
        ? '<span>en</span> · <span class="is-current">pt</span>'
        : '<span class="is-current">en</span> · <span>pt</span>';
      const label = pt ? 'Mudar idioma para inglês' : 'Switch language to Portuguese';
      btn.setAttribute('aria-label', label);
      btn.title = label;
    });

    document.querySelectorAll('[data-action="theme"]').forEach(btn => {
      const light = isLight();
      btn.textContent = light ? '☾' : '☀';
      const label = light
        ? (pt ? 'Mudar para o tema escuro' : 'Switch to dark theme')
        : (pt ? 'Mudar para o tema claro' : 'Switch to light theme');
      btn.setAttribute('aria-label', label);
      btn.title = label;
    });

    document.querySelectorAll('.nav').forEach(nav => {
      nav.setAttribute('aria-label', pt ? 'Principal' : 'Main');
    });
  }

  window.toggleTheme = function () {
    root.classList.toggle('light-mode');
    localStorage.setItem('lra-theme', isLight() ? 'light' : 'dark');
    syncControls();
  };

  window.toggleLang = function () {
    root.classList.toggle('lang-pt');
    localStorage.setItem('lra-lang', isPT() ? 'pt' : 'en');
    syncControls();
    document.dispatchEvent(new CustomEvent('lra:langchange'));
  };

  document.addEventListener('DOMContentLoaded', syncControls);
})();
