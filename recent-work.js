/* Recent work: a short dated log of what I am building and writing now.
 *
 * WEEKLY UPDATE: add one object at the TOP of RECENT_WORK, newest first.
 * The page shows the first 3 entries, and the first one also feeds the
 * "Latest" line in the summary at the top of the page.
 *
 *   date     'YYYY-MM-DD'  a real, checkable date (release, publish, trailer render or last update)
 *   kind     'trailer' | 'beta' | 'released' | 'updated' | 'published'   (label shown before the date)
 *   title    { en, pt }
 *   summary  { en, pt }    one sentence about what was done; nothing you cannot back up
 *   links    [{ href, en, pt }]   article / write-up first, then code. Only links that exist.
 *            Use 'Read the article' / 'Ler artigo' only for an actual article.
 *   video    optional { src, poster, seconds }   web-size mp4 + poster in assets/video/ (720p, ~2-6 MB).
 *            Loads nothing until played. Re-encode a new trailer with:
 *              ffmpeg -i in.mp4 -vf scale=1280:-2 -c:v libx264 -preset slow -crf 29 -pix_fmt yuv420p \
 *                     -movflags +faststart -c:a aac -b:a 80k out.mp4
 *              ffmpeg -ss 17 -i in.mp4 -frames:v 1 -vf scale=960:-2 -q:v 4 out.jpg
 *
 * Entries after the 3rd stay in the list but are not shown.
 */
const RECENT_WORK = [
  {
    date: '2026-10-28',
    kind: 'trailer',
    title: { en: 'Arrakis Atlas', pt: 'Atlas de Arrakis' },
    video: { src: 'assets/video/arrakis-atlas-trailer.mp4', poster: 'assets/video/arrakis-atlas-trailer.jpg', seconds: 58 },
    summary: {
      en: 'An interactive atlas of Arrakis, the planet of Dune: the appendix map georeferenced into 44 districts and tied to what the books say, with every number stating its source.',
      pt: 'Um atlas interativo de Arrakis, o planeta de Duna: o mapa do apêndice georreferenciado em 44 distritos e cruzado com o que os livros dizem, com cada número declarando sua fonte.',
    },
    links: [
      { href: 'https://arrakis-atlas.vercel.app', en: 'Open the atlas', pt: 'Abrir o atlas' },
      { href: 'https://github.com/Andrade020/arrakis-atlas', en: 'View code', pt: 'Ver código' },
    ],
  },
  {
    date: '2026-10-23',
    kind: 'trailer',
    title: { en: 'EyeZen', pt: 'EyeZen' },
    video: { src: 'assets/video/eyezen-trailer.mp4', poster: 'assets/video/eyezen-trailer.jpg', seconds: 57 },
    summary: {
      en: 'Color filters for Windows that adapt to what you are doing: free, portable, 3.5 MB, written in Rust. Version 2.1.0 is out.',
      pt: 'Filtros de cor para Windows que se adaptam ao que você está fazendo: gratuito, portátil, 3,5 MB, feito em Rust. A versão 2.1.0 já está disponível.',
    },
    links: [
      { href: 'project-eyezen2.html', en: 'Project page', pt: 'Página do projeto', internal: true },
      { href: 'https://github.com/Andrade020/EyeZen2', en: 'View code', pt: 'Ver código' },
      { href: 'https://github.com/Andrade020/EyeZen2/releases/tag/v2.1.0', en: 'Download v2.1.0', pt: 'Baixar a v2.1.0' },
    ],
  },
  {
    date: '2026-10-22',
    kind: 'beta',
    title: { en: 'Kibitz', pt: 'Kibitz' },
    video: { src: 'assets/video/kibitz-trailer.mp4', poster: 'assets/video/kibitz-trailer.jpg', seconds: 80 },
    summary: {
      en: 'A chess AI that thinks out loud: it plays you, then walks through the game with arrows and ideas checked against Stockfish. Windows beta.',
      pt: 'Uma IA de xadrez que pensa em voz alta: joga contra você e depois percorre a partida com setas e ideias conferidas com o Stockfish. Beta para Windows.',
    },
    links: [
      { href: 'https://github.com/Andrade020/kibitz/blob/main/docs/ARCHITECTURE.md', en: 'How it works', pt: 'Como funciona' },
      { href: 'https://github.com/Andrade020/kibitz', en: 'View code', pt: 'Ver código' },
      { href: 'https://github.com/Andrade020/kibitz/releases/tag/v0.1.0-beta.2', en: 'Download the beta', pt: 'Baixar a beta' },
    ],
  },
  {
    date: '2026-09-01',
    kind: 'published',
    title: { en: 'Environmental Economics · Lecture 02', pt: 'Economia Ambiental · Aula 02' },
    summary: {
      en: 'Lecture notes on externalities, waste and the optimal level of pollution, with an interactive simulation of the ecological gap against absorption capacity.',
      pt: 'Notas de aula sobre externalidades, resíduos e o nível ótimo de poluição, com uma simulação interativa do gap ecológico frente à capacidade de absorção.',
    },
    links: [
      { href: 'ambiental-aula-02.html', en: 'Read the notes', pt: 'Ler a aula', internal: true },
      { href: 'https://github.com/Andrade020/Andrade020.github.io/blob/main/ambiental-aula-02.html', en: 'View code', pt: 'Ver código' },
    ],
  },
];

(function () {
  const MONTHS = {
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    pt: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
  };
  const KINDS = {
    trailer: ['New trailer', 'Novo trailer'],
    released: ['Released', 'Lançado'],
    updated: ['Updated', 'Atualizado'],
    beta: ['Beta released', 'Beta lançada'],
    published: ['Published', 'Publicado'],
  };
  const MAX_ENTRIES = 3;

  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };
  // one span per language; the stylesheet shows the active one
  const bi = (en, pt, cls) => {
    const f = document.createDocumentFragment();
    const a = el('span', cls, en); a.setAttribute('data-lang-en', '');
    const b = el('span', cls, pt); b.setAttribute('data-lang-pt', '');
    f.append(a, b);
    return f;
  };
  const parts = (iso) => iso.split('-').map(Number); // [y, m, d]
  const dateEN = (iso) => { const [y, m, d] = parts(iso); return MONTHS.en[m - 1] + ' ' + d + ', ' + y; };
  const datePT = (iso) => { const [y, m, d] = parts(iso); return d + ' ' + MONTHS.pt[m - 1] + ' ' + y; };

  function link(entry, l) {
    const a = el('a', 'rw__link');
    a.href = l.href;
    if (!l.internal) { a.target = '_blank'; a.rel = 'noopener'; }
    a.append(bi(l.en, l.pt));
    // distinguish repeated labels ("View code") for screen readers
    a.append(bi(' (' + entry.title.en + ')', ' (' + entry.title.pt + ')', 'sr-only'));
    if (!l.internal) { const arrow = el('span', 'rw__arrow', ' ↗'); arrow.setAttribute('aria-hidden', 'true'); a.append(arrow); }
    return a;
  }

  function dateLabel(entry) {
    const k = KINDS[entry.kind];
    const t = el('time', 'rw__date');
    t.dateTime = entry.date;
    if (k) {
      const line = el('span', 'rw__kindline');
      line.append(bi(k[0], k[1]));
      t.append(line);
    }
    t.append(bi(dateEN(entry.date), datePT(entry.date)));
    return t;
  }

  function renderList(list) {
    const box = document.getElementById('recent-work');
    if (!box) return;
    box.replaceChildren();
    list.slice(0, MAX_ENTRIES).forEach((e, i) => {
      const li = el('li', 'rw' + (e.video ? ' rw--media' : ''));
      const body = el('div', 'rw__body');
      const h = el('h3', 'rw__title'); h.id = 'rw-title-' + i; h.append(bi(e.title.en, e.title.pt));
      const p = el('p', 'rw__sum'); p.append(bi(e.summary.en, e.summary.pt));
      const links = el('div', 'rw__links');
      e.links.forEach((l) => links.append(link(e, l)));
      body.append(h, p, links);
      li.append(dateLabel(e), body);
      if (e.video) li.append(media(e.video, h.id));
      box.append(li);
    });
  }

  // trailer: nothing downloads until the visitor presses play (preload="none")
  function media(v, titleId) {
    const fig = el('figure', 'rw__media');
    const video = el('video');
    video.controls = true;
    video.preload = 'none';
    video.setAttribute('playsinline', '');
    video.poster = v.poster;
    video.src = v.src;
    video.setAttribute('aria-labelledby', titleId); // read as the (visible-language) entry title
    const cap = el('figcaption', 'rw__cap');
    cap.append(bi('Trailer · ' + v.seconds + ' s · in Portuguese', 'Trailer · ' + v.seconds + ' s · em português'));
    fig.append(video, cap);
    return fig;
  }

  // the newest entry also feeds the "Latest" line in the summary
  function renderLatest(list) {
    const box = document.getElementById('latest-work');
    const e = list[0];
    if (!box || !e) return;
    box.replaceChildren();
    const t = el('strong'); t.append(bi(e.title.en, e.title.pt));
    const when = el('time', 'latest__date'); when.dateTime = e.date;
    when.append(bi(dateEN(e.date), datePT(e.date)));
    box.append(t, document.createTextNode(' · '));
    const k = KINDS[e.kind];
    if (k) {
      const kind = el('span', 'latest__date'); kind.append(bi(k[0], k[1]));
      box.append(kind, document.createTextNode(' · '));
    }
    box.append(when);
    e.links.slice(0, 2).forEach((l) => {
      box.append(document.createTextNode(' · '));
      box.append(link(e, l));
    });
  }

  function init() {
    renderList(RECENT_WORK);
    renderLatest(RECENT_WORK);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
