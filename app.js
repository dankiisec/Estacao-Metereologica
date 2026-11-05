const MAX_PONTOS = 150; // 5 min a 2s por leitura
const historico = { tempo: [], LUX: [], TEMP: [], UMID: [], PRES: [] };

const el = {
lux: document.getElementById('lux'),
temp: document.getElementById('temp'),
umid: document.getElementById('umid'),
pres: document.getElementById('pres'),
dot: document.getElementById('dot'),
statusText: document.getElementById('statusText'),
lastUpdate: document.getElementById('lastUpdate'),
};

const ctx = document.getElementById('grafico').getContext('2d');
const grafico = new Chart(ctx, {
type: 'line',
data: {
labels: [],
datasets: [
{ label: 'Luz (lux)', data: [], borderColor: '#fbbf24', tension: 0.3, pointRadius: 0, yAxisID: 'y1' },
{ label: 'Temp (°C)', data: [], borderColor: '#60a5fa', tension: 0.3, pointRadius: 0, yAxisID: 'y' },
{ label: 'Umidade (%)', data: [], borderColor: '#22d3ee', tension: 0.3, pointRadius: 0, yAxisID: 'y' },
{ label: 'Pressão (hPa)', data: [], borderColor: '#a78bfa', tension: 0.3, pointRadius: 0, yAxisID: 'y2' },
],
},
options: {
responsive: true,
maintainAspectRatio: false,
interaction: { mode: 'index', intersect: false },
plugins: {
legend: { labels: { color: '#8b98a5', boxWidth: 12 } },
},
scales: {
x: { ticks: { color: '#8b98a5', maxTicksLimit: 6 }, grid: { color: '#2a3441' } },
y: { position: 'left', ticks: { color: '#8b98a5' }, grid: { color: '#2a3441' } },
y1: { position: 'right', ticks: { color: '#fbbf24' }, grid: { display: false } },
y2: { position: 'right', ticks: { color: '#a78bfa' }, grid: { display: false }, offset: true },
},
},
});

function conectar() {
const ws = new WebSocket(`ws://${location.host}`);

ws.onopen = () => {
el.dot.classList.add('on');
el.statusText.textContent = 'Conectado';
};

ws.onclose = () => {
el.dot.classList.remove('on');
el.statusText.textContent = 'Desconectado';
setTimeout(conectar, 2000);
};

ws.onmessage = (ev) => {
const d = JSON.parse(ev.data);

el.lux.textContent = d.LUX?.toFixed(1) ?? '--';
el.temp.textContent = d.TEMP?.toFixed(1) ?? '--';
el.umid.textContent = d.UMID?.toFixed(1) ?? '--';
el.pres.textContent = d.PRES?.toFixed(1) ?? '--';

el.lastUpdate.textContent = `Última leitura: ${new Date(d.timestamp).toLocaleTimeString('pt-BR')}`;

const hora = new Date(d.timestamp).toLocaleTimeString('pt-BR', {
hour: '2-digit', minute: '2-digit', second: '2-digit',
});

historico.tempo.push(hora);
historico.LUX.push(d.LUX);
historico.TEMP.push(d.TEMP);
historico.UMID.push(d.UMID);
historico.PRES.push(d.PRES);

if (historico.tempo.length > MAX_PONTOS) {
Object.keys(historico).forEach((k) => historico[k].shift());
}

grafico.data.labels = historico.tempo;
grafico.data.datasets[0].data = historico.LUX;
grafico.data.datasets[1].data = historico.TEMP;
grafico.data.datasets[2].data = historico.UMID;
grafico.data.datasets[3].data = historico.PRES;
grafico.update('none');
};
}

conectar();