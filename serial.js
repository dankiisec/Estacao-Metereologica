import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import { parseLinha } from './parser.js';

let porta = null;

export async function conectarSerial(caminho, baudRate, aoReceber) {
porta = new SerialPort({ path: caminho, baudRate, autoOpen: false });

const parser = porta.pipe(new ReadlineParser({ delimiter: '\n' }));

parser.on('data', (linha) => {
const dado = parseLinha(linha);
if (dado) aoReceber(dado);
});

porta.on('error', (err) => {
console.error('Erro na serial:', err.message);
});

return new Promise((resolve, reject) => {
porta.open((err) => {
if (err) return reject(err);
console.log(`Serial conectada em ${caminho} (${baudRate} baud)`);
resolve();
});
});
}

// Lista as portas disponíveis (útil quando troca de computador)
export async function listarPortas() {
const portas = await SerialPort.list();
return portas.map((p) => ({
caminho: p.path,
fabricante: p.manufacturer || 'desconhecido',
}));
}