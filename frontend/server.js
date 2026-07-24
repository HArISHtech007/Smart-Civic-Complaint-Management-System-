const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3001;
const CLIENT_DIR = path.join(__dirname, 'client');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';

  const relPath = reqPath.startsWith('/') ? reqPath.slice(1) : reqPath;
  let filePath = path.join(CLIENT_DIR, relPath);

  fs.readFile(filePath, (err, content) => {
    if (err) {
      // Fallback to client/index.html
      fs.readFile(path.join(CLIENT_DIR, 'index.html'), (err2, indexContent) => {
        if (err2) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error: ' + err2.message);
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(indexContent, 'utf-8');
        }
      });
    } else {
      const ext = path.extname(filePath);
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'text/html' });
      res.end(content, 'utf-8');
    }
  });
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`[Frontend Server] Server is already active on http://localhost:${PORT}`);
  } else {
    console.error('[Frontend Server Error]:', err);
  }
});

server.listen(PORT, () => {
  console.log(`Civic Care frontend server listening on http://localhost:${PORT}`);
});
