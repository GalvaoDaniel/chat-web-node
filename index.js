const http = require('http');
const fs = require('fs');
const path = require('path');

// Crie um servidor HTTP simples que serve a página do cliente WebSocket
const server = http.createServer((req, res) => {
    if (req.url === '/') {
        fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
            if (err) {
                res.writeHead(500);
                return res.end('Erro ao carregar a página');
            }

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    } else {
        res.writeHead(404);
        res.end('Página não encontrada');
    }
});

const WebSocket = require('ws');
const wss = new WebSocket.Server({ server });

let clients = [];

wss.on('connection', function connection(ws) {
    clients.push(ws);

    ws.on('message', function incoming(message) {
        // Broadcasting messages to all clients
        clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', function close() {
        // Remove disconnected client from the list
        clients = clients.filter(function (client) {
            return client.readyState === WebSocket.OPEN;
        });
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Servidor web está rodando em http://localhost:${PORT}`);
});