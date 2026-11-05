/*
* ESTACAO DE SENSORES - VEML7700 + AHT20 + BMP280
* Envia os dados no formato: LUX:..,TEMP:..,UMID:..,PRES:..
*/

#include <Wire.h>
#include <Adafruit_VEML7700.h>
#include <Adafruit_AHTX0.h>
#include <Adafruit_BMP280.h>

Adafruit_VEML7700 veml;
Adafruit_AHTX0 aht;
Adafruit_BMP280 bmp;

void setup() {
Serial.begin(9600);
Wire.begin();

if (!veml.begin()) Serial.println("ERRO: VEML7700");
else {
veml.setLuxGain(VEML7700_LUX_GAIN_1_8);
veml.setLuxIntegrationTime(VEML7700_LUX_IT_100MS);
}

if (!aht.begin()) Serial.println("ERRO: AHT20");
if (!bmp.begin(0x76) && !bmp.begin(0x77)) Serial.println("ERRO: BMP280");

delay(1000);
}

void loop() {
float lux = veml.readLux();

sensors_event_t umid, tempAht;
aht.getEvent(&umid, &tempAht);

float pressao = bmp.readPressure() / 100.0;

Serial.print("LUX:");
Serial.print(lux, 1);
Serial.print(",TEMP:");
Serial.print(tempAht.temperature, 1);
Serial.print(",UMID:");
Serial.print(umid.relative_humidity, 1);
Serial.print(",PRES:");
Serial.println(pressao, 1);

delay(2000);
}