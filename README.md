# Estação de Sensores — VEML7700 + AHT20 + BMP280

## Retomar em outra máquina (3 passos)
1. `npm run setup` — instala tudo e mostra as portas seriais
2. Copie a porta do Arduino para o `.env` (campo SERIAL_PORT)
3. `npm start` — abra http://localhost:3000

## Pastas
- `arduino/` — código que roda na placa
- `server/` — lê a serial e serve o site
- `public/` — a interface web
- `scripts/` — utilitários de setup e diagnóstico

## Se algo der errado
- "Porta ocupada" → feche o Serial Monitor do Arduino IDE
- "Sensor nao encontrado" → confira SDA em A4 e SCL em A5
- "Nao conecta no site" → confira se o servidor esta rodando na porta 3000

## Estado atual do projeto
- [x] VEML7700 testado e validado
- [x] AHT20 + BMP280 testado e validado
- [x] Montagem conjunta funcionando
- [ ] Site com gráficos em tempo real
- [ ] Histórico em CSV