// Converte "LUX:342.5,TEMP:24.1,UMID:58.3,PRES:951.2" em objeto
export function parseLinha(linha) {
const texto = linha.trim();
if (!texto) return null;

const dado = { timestamp: Date.now() };
const partes = texto.split(',');

for (const parte of partes) {
const [chave, valor] = parte.split(':');
if (!chave || valor === undefined) continue;

const num = parseFloat(valor);
if (!Number.isNaN(num)) dado[chave.trim()] = num;
}

// Só aceita se veio pelo menos a luminosidade
if (dado.LUX === undefined) return null;
return dado;
}