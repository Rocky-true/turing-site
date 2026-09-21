// 图灵·工作室 — 返回最初版：打字机 + 滚动reveal + API（无分页/侧栏）
(async function () {
  // 1. API
  async function loadApi() {
    try {
      const [m, c] = await Promise.all([
        fetch('/api/members').then(r => r.json()),
        fetch('/api/cluster').then(r => r.json())
      ]);
      const body = document.getElementById('roster-body');
      if (body && Array.isArray(m)) {
        body.innerHTML = m.map(x =>
          `<tr><td>${x.name}</td><td>${x.role}</td><td>${x.notable}</td></tr>`
        ).join('');
      }
      const cs = document.getElementById('clusterState');
      if (cs && c) cs.textContent = `λ CLUSTER: ${c.nodes}NODE · ${c.status}`;
    } catch (e) { }
  }
  loadApi();

  // 2. Hero 打字机
  const text = 'SYS_TEAM: K8S / CICD / SRE — TURING.STS';
  const el = document.getElementById('typewriter');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !el) {
    if (el) el.textContent = text;
  } else {
    let i = 0;
    const tick = () => {
      el.textContent = text.slice(0, i++);
      if (i > text.length) { el.textContent = text; return; }
      setTimeout(tick, 34);
    };
    tick();
  }

  // 3. Reveal
  const targets = document.querySelectorAll('.section-title, .editorial-body, .field-list li, table, h1, .hero-math, .join-body, .feed-item, .repo-list li, .pub-list li, .event-list li');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    targets.forEach((t) => { t.classList.add('reveal'); io.observe(t); });
  }
})();
