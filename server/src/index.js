// index.js

const http = require("http");
const fs = require('fs');
const path = require('path');
const SocketService = require("./SocketService");

// see also https://stackabuse.com/node-http-servers-for-static-file-serving/
const staticBasePath = './static';

const staticServe = function(req, res) {
    const resolvedBase = path.resolve(staticBasePath);
    const safeSuffix = path.normalize(req.url).replace(/^(\.\.[\/\\])+/, '');
    let fileLoc = path.join(resolvedBase, safeSuffix);
    if (fileLoc.endsWith('/')) {
      fileLoc += 'index.html';
    }

    fs.readFile(fileLoc, function(err, data) {
        const mimeTypes = {
          'html': 'text/html',
          'js': 'application/javascript',
          'css': 'text/css',
        }
        if (err) {
            res.writeHead(404, 'Not Found');
            res.write('404: File Not Found!');
            return res.end();
        }
        res.writeHead(200, {'Content-Type': mimeTypes[fileLoc.substring(fileLoc.lastIndexOf('.') + 1)] || 'text/plain'});
        res.write(data);
        return res.end();
    });
};

/* 
  Create Server from http module.
  If you use other packages like express, use something like,
  const app = require("express")();
  const server = require("http").Server(app);

*/
const server = http.createServer(staticServe);

const port = 8080;

server.listen(port, function() {
  console.log("Server listening on : ", port);
  const socketService = new SocketService();
  socketService.attachServer(server);
});
