const express = require('express');
const webSocket = require('ws');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const setupWebSocket = (server) => {
    const wss = new webSocket.Server({ server });
    
    const clients = new Set();
    
    wss.on('connection', ws => {
        console.log('Cliente WebSocket conectado');
        
        clients.add(ws);
        
        ws.send('¡Bienvenido al servidor WebSocket!');

        ws.on('message', (message) => {
            console.log('Mensaje recibido: %s', message);
            
            clients.forEach(client => {
                // Verificar que el cliente esté activo
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

app.get('/', (req, res) => {
    res.send('Servidor de WebSocket funcionando. Conecta con tu cliente WebSocket.');
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Servidor Express corriendo en el puerto ${PORT}`);
});

setupWebSocket(server);