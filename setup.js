import { existsSync, copyFileSync } from 'fs';
import { execSync } from 'child_process';
import { listarPortas } from '../server/serial.js';

console.log('=== Setup do projeto Estacao ===\n');

const [major] = process.versions.node.split('.').map(Number);
if (major < 18) {
console.error(`Node ${process.versions.node} encontrado. Precisa de 18+.`);
process.exit(1);
}
console.log(`Node ${process.versions.node} OK`);

if (!existsSync('.env')) {
copyFileSync('.env.example', '.env');
console.log('.env criado — ajuste a porta serial');
} else {
console.log('.env ja existe');
}

console.log('\nInstalando dependencias...');
execSync('npm install', { stdio: 'inherit' });

console.log('\nPortas seriais detectadas:');
const portas = await listarPortas();
if (portas.length === 0) {
console.log(' Nenhuma — conecte o Arduino via USB');
} else {
portas.forEach((p) => console.log(` ${p.caminho} (${p.fabricante})`));
}

console.log('\n=== Pronto. Rode: npm start ===');