const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const PORT = process.env.PORT || 3000;

function serveStatic(req, res) {
  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = 404;
      return res.end('Not found');
    }
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/submit_contact') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      const params = new URLSearchParams(body);
      const name = params.get('name') || '';
      const email = params.get('email') || '';
      const phone = params.get('phone') || '';
      const line = `${new Date().toISOString()} - ${name}, ${email}, ${phone}\n`;
      fs.appendFile(path.join(__dirname, 'contact_submissions.txt'), line, () => {});
      res.statusCode = 200;
      res.end('OK');
    });
  } else if (req.method === 'GET') {
    serveStatic(req, res);
  } else {
    res.statusCode = 404;
    res.end('Not found');
  }
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
