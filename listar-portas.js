import { listarPortas } from '../server/serial.js';

const portas = await listarPortas();

if (portas.length === 0) {
console.log('Nenhuma porta serial encontrada. O Arduino esta conectado?');
} else {
console.log('Portas disponiveis:\n');
portas.forEach((p) => console.log(` ${p.caminho} — ${p.fabricante}`));
console.log('\nCopie o caminho acima para o .env (SERIAL_PORT)');
}