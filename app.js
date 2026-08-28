/* shared site logic */
(function () {
  // theme
  const root = document.body;
  const savedTheme = localStorage.getItem('lra-theme');
  if (savedTheme === 'light') root.classList.add('light-mode');
  window.toggleTheme = function () {
    root.classList.toggle('light-mode');
    const isLight = root.classList.contains('light-mode');
    localStorage.setItem('lra-theme', isLight ? 'light' : 'dark');
    const btn = document.querySelector('[data-action="theme"]');
    if (btn) btn.textContent = isLight ? '☾' : '☀';
  };

  // language
  const savedLang = localStorage.getItem('lra-lang');
  if (savedLang === 'pt') root.classList.add('lang-pt');
  function syncLangBtn() {
    const isPT = root.classList.contains('lang-pt');
    document.querySelectorAll('[data-lang-btn]').forEach(btn => {
      btn.innerHTML = isPT
        ? '<span>en</span> · <span class="is-current">pt</span>'
        : '<span class="is-current">en</span> · <span>pt</span>';
    });
  }
  window.toggleLang = function () {
    root.classList.toggle('lang-pt');
    localStorage.setItem('lra-lang', root.classList.contains('lang-pt') ? 'pt' : 'en');
    syncLangBtn();
  };

  // wildcard slot — randomize on each load
  function rollWildcard() {
    const slot = document.getElementById('wildcard-slot');
    if (!slot) return;
    const pool = [
      {
        tag: 'research',
        tagLabel: 'Research',
        title: 'Spatiotemporal Poisson Processes',
        titlePt: 'Processos de Poisson Espaço-Temporais',
        desc: 'MSc research on parameter estimation when location data is incomplete: a likelihood that respects what you actually observe. Published in <em>Nature Scientific Reports.</em>',
        descPt: 'Pesquisa de mestrado sobre estimação quando dados de localização estão incompletos: uma verossimilhança que respeita o que de fato se observa. Publicada na <em>Nature Scientific Reports.</em>',
        stack: 'R · Maximum Likelihood · Stochastic Processes',
        href: 'publications.html',
      },
      {
        tag: 'open',
        tagLabel: 'Open source',
        title: 'Krvo',
        desc: 'Email automation via Microsoft Graph. GUI + CLI, used in production to dispatch daily risk reports from my Airflow pipelines.',
        descPt: 'Automação de e-mail via Microsoft Graph. GUI + CLI, usado em produção para disparar relatórios diários dos meus pipelines do Airflow.',
        stack: 'Python · Microsoft Graph · Azure AD',
        href: 'https://github.com/Andrade020/krvo',
      },
      {
        tag: 'open',
        tagLabel: 'Open source',
        title: 'ludami',
        desc: 'A link curation platform for shared spaces — save YouTube videos and URLs into thematic collections, annotate them, share with collaborators. Installable as a PWA.',
        descPt: 'Plataforma de curadoria de links para espaços compartilhados — salve vídeos do YouTube e URLs em coleções temáticas, anote-os, compartilhe com colaboradores. Instalável como PWA.',
        stack: 'React · TypeScript · Vite · Tailwind · Supabase',
        href: 'project-ludami.html',
      },
      {
        tag: 'open',
        tagLabel: 'Open source',
        title: 'Prisma',
        desc: 'Lottery portfolio optimizer: greedy max-coverage, simulated annealing, and Monte Carlo, all client-side. Based on a paper co-authored with Victor Hugo Nascimento (FGV).',
        descPt: 'Otimizador de carteiras de loteria: greedy max-coverage, simulated annealing e Monte Carlo, tudo client-side. Baseado num artigo escrito com Victor Hugo Nascimento (FGV).',
        stack: 'React · TypeScript · Vite · Web Worker',
        href: 'project-prisma.html',
      },
      {
        tag: 'open',
        tagLabel: 'Open source',
        title: 'Local_LLM',
        desc: 'A desktop interface for installing and running LLMs locally — no internet required after setup. Useful when prompts must stay off the cloud.',
        descPt: 'Interface desktop para instalar e rodar LLMs localmente — sem internet depois do setup. Útil quando os prompts precisam ficar fora da nuvem.',
        stack: 'Python · tkinter · llama.cpp',
        href: 'https://github.com/Andrade020/Local_LLM',
      },
      {
        tag: 'open',
        tagLabel: 'Open source',
        title: 'EyeZen',
        desc: 'A Windows screen filter that reduces visual fatigue during long reading sessions. System tray, global shortcuts, distributed as a standalone .exe.',
        descPt: 'Filtro de tela para Windows que reduz fadiga visual em sessões longas de leitura. Tray, atalhos globais, distribuído como .exe.',
        stack: 'Python · Windows API · PyInstaller',
        href: 'https://github.com/Andrade020/EyeZen',
      },
    ];
    const pick = pool[Math.floor(Math.random() * pool.length)];
    const titlePt = pick.titlePt || pick.title;
    slot.innerHTML = `
      <div class="selected__head">
        <span class="selected__num">04.</span>
        <span class="tag ${pick.tag}">${pick.tagLabel}</span>
      </div>
      <h3 class="selected__title" data-lang-en>${pick.title}</h3>
      <h3 class="selected__title" data-lang-pt>${titlePt}</h3>
      <p class="selected__desc" data-lang-en>${pick.desc}</p>
      <p class="selected__desc" data-lang-pt>${pick.descPt}</p>
      <div class="selected__stack">${pick.stack}</div>
      <a href="${pick.href}" class="cover" ${pick.href.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}></a>
    `;
  }

  document.addEventListener('DOMContentLoaded', () => {
    syncLangBtn();
    const themeBtn = document.querySelector('[data-action="theme"]');
    if (themeBtn) themeBtn.textContent = root.classList.contains('light-mode') ? '☾' : '☀';
    rollWildcard();
  });
})();
