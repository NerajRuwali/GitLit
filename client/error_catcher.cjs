const http = require('http');
const fs = require('fs');
const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString(); // convert Buffer to string
    });
    req.on('end', () => {
        fs.writeFileSync('/tmp/react_error.log', body);
        res.end('ok');
        process.exit(0);
    });
  }
});
server.listen(4444, () => {
  console.log('Listening on 4444');
});
