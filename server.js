#!/usr/bin/env node
// Zero-dependency static server: `npm start` or `npx phonetic-workbench`. Set PORT to change the port.
const http = require('http'), fs = require('fs'), path = require('path');
const port = +process.env.PORT || 3000;
const types = {'.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8'};
const allowed = /^\/(index\.html|styles\.css|app\.js|phonetic-translator\.js|vendor\/[\w.-]+)?$/;
const server = http.createServer((req, res) => {
  let p; try { p = decodeURIComponent(req.url.split('?')[0]); } catch (e) { p = ''; }
  if (!allowed.test(p)) { res.writeHead(404); return res.end('Not found'); }
  if (p === '/') p = '/index.html';
  fs.readFile(path.join(__dirname, p), (err, buf) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, {'Content-Type': types[path.extname(p)] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff'});
    res.end(buf);
  });
});
server.on('error', e => { console.error(e.code === 'EADDRINUSE' ? `Port ${port} is busy. Try: PORT=3001 npm start` : e.message); process.exit(1); });
server.listen(port, () => console.log(`Phonetic Workbench running at http://localhost:${port}`));
