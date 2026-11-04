const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '../build');
const port = Number(process.env.PORT || process.argv[2] || 4173);
const mimeTypes = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.ico': 'image/x-icon',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain',
};

http
  .createServer((request, response) => {
    let pathname;
    try {
      pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    } catch {
      response.writeHead(400).end();
      return;
    }

    let file = path.resolve(root, `.${pathname}`);
    if (file !== root && !file.startsWith(`${root}${path.sep}`)) {
      response.writeHead(403).end();
      return;
    }

    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
      if (path.extname(pathname)) {
        response.writeHead(404).end();
        return;
      }
      file = path.join(root, 'index.html');
    }

    if (!fs.existsSync(file)) {
      response.writeHead(503).end('Execute npm run build primeiro.');
      return;
    }

    response.writeHead(200, {
      'Content-Type': mimeTypes[path.extname(file)] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    fs.createReadStream(file).pipe(response);
  })
  .listen(port, '127.0.0.1', () => {
    console.log(`Preview: http://127.0.0.1:${port}`);
  });
