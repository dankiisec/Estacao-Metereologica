import 'dotenv/config';
import express from 'express';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { conectarSerial, listarPortas } from './serial.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.static(path.join(__dirname, '..', 'public')));

const servidor = createServer(app);
const wss = new WebSocketServer({ server: servidor });

let ultimoDado = null;

// Envia para todos os navegadores conectados
function transmitir(dado) {
ultimoDado = dado;
const msg = JSON.stringify(dado);
wss.clients.forEach((c) => {
if (c.readyState === 1) c.send(msg);
});
}

wss.on('connection', (ws) => {
console.log('Navegador conectado');
if (ultimoDado) ws.send(JSON.stringify(ultimoDado));
});

const PORTA_SERIAL = process.env.SERIAL_PORT || 'COM3';
const BAUD = parseInt(process.env.BAUD_RATE || '9600', 10);
const PORTA_WEB = parseInt(process.env.PORT || '3000', 10);

async function iniciar() {
try {
await conectarSerial(PORTA_SERIAL, BAUD, transmitir);
} catch (err) {
console.error('\nNao foi possivel abrir a porta serial:', err.message);
console.error('Portas disponiveis agora:');
const portas = await listarPortas();
portas.forEach((p) => console.error(` ${p.caminho} (${p.fabricante})`));
console.error('\nAjuste SERIAL_PORT no arquivo .env e rode de novo.\n');
}

servidor.listen(PORTA_WEB, () => {
console.log(`Site em http://localhost:${PORTA_WEB}`);
});
}

iniciar();