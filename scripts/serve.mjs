// Serveur local de prévisualisation (même comportement que le Worker :
// barre oblique finale, redirections, page 404).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const DIST = path.join(ROOT, 'dist');
const PORT = Number(process.env.PORT || 4173);
const redirects = JSON.parse(fs.readFileSync(path.join(ROOT, 'worker/redirects.json'), 'utf8'));
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif', '.mp4': 'video/mp4', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain', '.webmanifest': 'application/manifest+json' };

http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  let p = decodeURIComponent(url.pathname);
  const key = (p.endsWith('/') || /\.\w{2,5}$/.test(p) ? p : `${p}/`).toLowerCase();
  if (redirects[key]) { res.writeHead(301, { Location: redirects[key] }); return res.end(); }
  if (url.pathname === '/api/contact') { res.writeHead(503, { 'content-type': 'application/json' }); return res.end('{"ok":false}'); }
  let file = path.join(DIST, p);
  if (!file.startsWith(DIST)) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
    if (!p.endsWith('/')) { res.writeHead(307, { Location: `${p}/${url.search}` }); return res.end(); }
    file = path.join(file, 'index.html');
  }
  if (!fs.existsSync(file)) {
    res.writeHead(404, { 'content-type': TYPES['.html'] });
    return fs.createReadStream(path.join(DIST, '404.html')).pipe(res);
  }
  const stat = fs.statSync(file);
  const type = TYPES[path.extname(file)] || 'application/octet-stream';
  const range = req.headers.range;
  if (range && type === 'video/mp4') {
    const [s, e] = range.replace('bytes=', '').split('-');
    const start = Number(s); const end = e ? Number(e) : stat.size - 1;
    res.writeHead(206, { 'Content-Range': `bytes ${start}-${end}/${stat.size}`, 'Accept-Ranges': 'bytes', 'Content-Length': end - start + 1, 'Content-Type': type });
    return fs.createReadStream(file, { start, end }).pipe(res);
  }
  res.writeHead(200, { 'content-type': type, 'content-length': stat.size, 'accept-ranges': 'bytes' });
  fs.createReadStream(file).pipe(res);
}).listen(PORT, () => console.log(`Prévisualisation : http://localhost:${PORT}`));
