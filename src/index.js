const express = require('express');
const webSocket = require('ws');
require('dotenv').config();

const app = express();
app.use(express.json());

const setupWebSocket = (server) => {
    const wss = new webSocket.Server({ server });
    
    const clients = new Set();
    
    wss.on('connection', ws => {
        console.log('Cliente WebSocket conectado');
        
        clients.add(ws);
        
        //ws.send('¡Bienvenido al servidor WebSocket!');

        ws.on('message', (message) => {
            console.log('Mensaje recibido: %s', message);
            
            clients.forEach(client => {
                if (client.readyState === webSocket.OPEN) {
                    client.send(`${message}`);
                }
            });
        });

        ws.on('close', () => {
            console.log('Cliente WebSocket desconectado');
            clients.delete(ws);
        });
    });
};

const server = app.listen(process.env.PORT || 5000, () => {
    console.log(`Servidor Express corriendo en http://localhost:${process.env.PORT || 5000}`);
});

setupWebSocket(server);

app.get('/', (req, res) => {
    res.send('¡Hola Mundo!');
});