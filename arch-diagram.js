/* Architecture diagram, renders into #arch-mount */
(function () {
  const mount = document.getElementById('arch-mount');
  if (!mount) return;

  // layout: viewBox 600 x 440
  const W = 600, H = 440;

  // nodes by column. Each: { x, y, w, h, title, sub, klass, id }
  const nodes = [
    // sources (left)
    { id: 's1', col:'src', x: 16,  y: 40,  w: 158, h: 64,
      title: 'Web scraping', sub: 'Selenium · BeautifulSoup' },
    { id: 's2', col:'src', x: 16,  y: 124, w: 158, h: 64,
      title: 'Public APIs',  sub: 'REST · OAuth' },
    { id: 's3', col:'src', x: 16,  y: 208, w: 158, h: 64,
      title: 'Documents',    sub: 'PDF · OCR' },
    // orchestration (mid)
    { id: 'o1', col:'orch', x: 226, y: 82,  w: 148, h: 64,
      title: 'Apache Airflow', sub: 'scheduled DAGs' },
    { id: 'o2', col:'orch', x: 226, y: 166, w: 148, h: 64,
      title: 'PostgreSQL',     sub: 'data warehouse' },
    { id: 'o3', col:'orch', x: 226, y: 250, w: 148, h: 64,
      title: 'Python libs',    sub: 'pricing · risk' },
    // outputs (right)
    { id: 'r1', col:'out', x: 426, y: 40,  w: 158, h: 64,
      title: 'Internal dashboard', sub: 'Flask · Jinja2' },
    { id: 'r2', col:'out', x: 426, y: 124, w: 158, h: 64,
      title: 'Automated reports',  sub: 'daily delivery' },
    { id: 'r3', col:'out', x: 426, y: 208, w: 158, h: 64,
      title: 'ML risk engine',     sub: 'scikit-learn · SHAP' },
  ];

  // edges: from -> to (we draw an orthogonal-ish path)
  const edges = [
    { from:'s1', to:'o1' }, { from:'s2', to:'o1' }, { from:'s3', to:'o1' },
    { from:'o1', to:'o2' },
    { from:'o2', to:'o3' },
    { from:'o2', to:'r1' }, { from:'o2', to:'r2' }, { from:'o3', to:'r3' },
  ];

  // helpers
  const byId = Object.fromEntries(nodes.map(n => [n.id, n]));
  const rightCx = n => n.x + n.w;
  const leftCx  = n => n.x;
  const cy      = n => n.y + n.h / 2;

  function edgePath(a, b) {
    const x1 = rightCx(a), y1 = cy(a);
    const x2 = leftCx(b),  y2 = cy(b);
    const mid = (x1 + x2) / 2;
    // bezier-ish via cubic
    return `M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`;
  }

  function el(tag, attrs = {}, children = []) {
    const e = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    for (const c of children) e.appendChild(c);
    return e;
  }
  function txt(content, attrs = {}) {
    const t = el('text', attrs);
    t.textContent = content;
    return t;
  }

  const svg = el('svg', {
    class: 'arch',
    viewBox: `0 0 ${W} ${H}`,
    preserveAspectRatio: 'xMidYMid meet',
    role: 'img',
    'aria-label': 'Architecture diagram: sources flowing through Airflow into outputs',
  });

  // column labels at top
  svg.appendChild(txt('SOURCES',       { x: 16,  y: 18, class: 'col-label' }));
  svg.appendChild(txt('ORCHESTRATION', { x: 226, y: 18, class: 'col-label' }));
  svg.appendChild(txt('OUTPUTS',       { x: 426, y: 18, class: 'col-label' }));

  // edges
  const edgesG = el('g', { class: 'edges' });
  const pathRefs = [];
  edges.forEach((e, i) => {
    const a = byId[e.from], b = byId[e.to];
    const d = edgePath(a, b);
    const path = el('path', {
      d, class: 'edge', 'stroke-width': 1, 'stroke-dasharray': '2 4',
      id: `edge-${i}`,
    });
    edgesG.appendChild(path);
    pathRefs.push(`edge-${i}`);
  });
  svg.appendChild(edgesG);

  // particles
  const particlesG = el('g', { class: 'particles' });
  pathRefs.forEach((pid, i) => {
    const p = el('circle', { r: 2.4, class: 'particle' });
    const mp = el('animateMotion', {
      dur: (2.8 + (i % 3) * 0.6) + 's',
      repeatCount: 'indefinite',
      begin: (i * 0.35) + 's',
      rotate: 'auto',
    });
    const mpPath = el('mpath', {});
    mpPath.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#' + pid);
    mp.appendChild(mpPath);
    p.appendChild(mp);
    particlesG.appendChild(p);
  });
  svg.appendChild(particlesG);

  // nodes
  const nodesG = el('g', { class: 'nodes' });
  nodes.forEach(n => {
    const g = el('g', {
      class: 'node node-' + (n.col === 'src' ? 'src' : n.col === 'orch' ? 'orch' : 'out')
    });
    const rect = el('rect', {
      x: n.x, y: n.y, width: n.w, height: n.h, rx: 4,
      class: 'node-bg', 'stroke-width': 1,
    });
    // accent tab on the left side of each node
    const tab = el('rect', {
      x: n.x, y: n.y, width: 3, height: n.h, rx: 0,
      class: 'node-tab',
    });
    const ttl = txt(n.title, {
      x: n.x + 14, y: n.y + 26, class: 'node-title',
    });
    const sub = txt(n.sub, {
      x: n.x + 14, y: n.y + 44, class: 'node-sub',
    });
    g.appendChild(rect); g.appendChild(tab); g.appendChild(ttl); g.appendChild(sub);
    nodesG.appendChild(g);
  });
  svg.appendChild(nodesG);

  mount.appendChild(svg);
})();
