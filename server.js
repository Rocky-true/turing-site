// 图灵·学社 — 零依赖 Node 后端（静态托管 + JSON API）
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const members = [
  { name: '阿 达', role: '平台组', notable: 'K8s / Ingress / NFS' },
  { name: '萨 宾', role: '流水线组', notable: 'CI-CD / ArgoCD' },
  { name: 'M. 李', role: 'SRE组', notable: 'Prometheus / Alert' },
  { name: 'E. 王', role: '核心贡献者', notable: 'Trivy · cert-manager' },
  { name: '你', role: '待定', notable: 'JOIN US →' }
];

const cluster = {
  nodes: 3,
  nodesDetail: [{ name: 'k8s-master', cpu: '8C', mem: '32G' }, { name: 'k8s-worker1', cpu: '2C', mem: '4G' }, { name: 'k8s-worker2', cpu: '2C', mem: '2G' }],
  uptime: '99.9%',
  status: 'LIVE'
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/api/members') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify(members));
  }
  if (url.pathname === '/api/cluster') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify(cluster));
  }

  let file = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
  const fp = path.join(ROOT, file);
  if (!fp.startsWith(ROOT) || !fs.existsSync(fp)) {
    res.writeHead(404); return res.end('404');
  }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(fp)] || 'application/octet-stream' });
  fs.createReadStream(fp).pipe(res);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`TURING site listening on http://localhost:${PORT}`));
