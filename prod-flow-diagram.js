/* Generic node/edge flow diagram, renders into a given mount id.
   Config: { mount, W, H, nodes: [{id,x,y,w,h,title,sub,col}], edges: [{from,to}] }
   col controls the accent color: 'a' | 'b' | 'c' (mapped to CSS classes below). */
window.renderFlowDiagram = function (config) {
  const mount = document.getElementById(config.mount);
  if (!mount) return;
  const W = config.W || 600, H = config.H || 300;
  const nodes = config.nodes || [];
  const edges = config.edges || [];

  const byId = Object.fromEntries(nodes.map(n => [n.id, n]));
  const rightCx = n => n.x + n.w;
  const leftCx  = n => n.x;
  const cy      = n => n.y + n.h / 2;

  function edgePath(a, b) {
    const x1 = rightCx(a), y1 = cy(a);
    const x2 = leftCx(b),  y2 = cy(b);
    const mid = (x1 + x2) / 2;
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
    class: 'arch', viewBox: `0 0 ${W} ${H}`,
    preserveAspectRatio: 'xMidYMid meet', role: 'img',
    'aria-label': config.label || 'Flow diagram',
  });

  const edgesG = el('g', { class: 'edges' });
  const pathRefs = [];
  edges.forEach((e, i) => {
    const a = byId[e.from], b = byId[e.to];
    if (!a || !b) return;
    const path = el('path', {
      d: edgePath(a, b), class: 'edge', 'stroke-width': 1,
      'stroke-dasharray': '2 4', id: `${config.mount}-edge-${i}`,
    });
    edgesG.appendChild(path);
    pathRefs.push(`${config.mount}-edge-${i}`);
  });
  svg.appendChild(edgesG);

  const particlesG = el('g', { class: 'particles' });
  pathRefs.forEach((pid, i) => {
    const p = el('circle', { r: 2.4, class: 'particle' });
    const mp = el('animateMotion', {
      dur: (2.8 + (i % 3) * 0.6) + 's', repeatCount: 'indefinite',
      begin: (i * 0.35) + 's', rotate: 'auto',
    });
    const mpPath = el('mpath', {});
    mpPath.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#' + pid);
    mp.appendChild(mpPath);
    p.appendChild(mp);
    particlesG.appendChild(p);
  });
  svg.appendChild(particlesG);

  const nodesG = el('g', { class: 'nodes' });
  nodes.forEach(n => {
    const colClass = n.col === 'b' ? 'orch' : n.col === 'c' ? 'out' : 'src';
    const g = el('g', { class: 'node node-' + colClass });
    const rect = el('rect', {
      x: n.x, y: n.y, width: n.w, height: n.h, rx: 4,
      class: 'node-bg', 'stroke-width': 1,
    });
    const tab = el('rect', { x: n.x, y: n.y, width: 3, height: n.h, class: 'node-tab' });
    const ttl = txt(n.title, { x: n.x + 14, y: n.y + 26, class: 'node-title' });
    const sub = txt(n.sub || '', { x: n.x + 14, y: n.y + 44, class: 'node-sub' });
    g.appendChild(rect); g.appendChild(tab); g.appendChild(ttl); g.appendChild(sub);
    nodesG.appendChild(g);
  });
  svg.appendChild(nodesG);

  mount.appendChild(svg);
};
