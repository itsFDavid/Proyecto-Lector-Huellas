#include <Adafruit_Fingerprint.h>
#include <SoftwareSerial.h>
#include <ArduinoJson.h> 

SoftwareSerial fingerprintSerial(2, 3);  // RX, TX
Adafruit_Fingerprint fingerprint = Adafruit_Fingerprint(&fingerprintSerial);

void setup() {
  Serial.begin(9600);
  while (!Serial);
  Serial.println("Sistema de apertura con huella dactilar");

  fingerprintSerial.begin(57600);
  delay(5);
  
  if (fingerprint.verifyPassword()) {
    Serial.println("¡Sensor de huella digital detectado!");
  } else {
    Serial.println("No se pudo detectar el sensor de huella digital.");
    Serial.println("Por favor, revise las conexiones.");
    while (1) delay(1);
  }

  fingerprint.getTemplateCount();
  Serial.print("El sensor contiene "); Serial.print(fingerprint.templateCount); Serial.println(" plantillas");
  Serial.println("Esperando por una huella válida...");
}

void loop() {
  abrirPuertaSiAutorizado();
  delay(50); // Retardo de 50 milisegundos entre lecturas
}

void abrirPuertaSiAutorizado() {
  uint8_t p = fingerprint.getImage();
  if (p != FINGERPRINT_OK) return;

  p = fingerprint.image2Tz();
  if (p != FINGERPRINT_OK) return;

  p = fingerprint.fingerFastSearch();
  if (p != FINGERPRINT_OK) {
    Mal_Registro();
    return;
  }

  // Si hay coincidencias de huella
  Serial.print("ID #"); Serial.print(fingerprint.fingerID);
  Serial.print(" coincidencia del "); Serial.println(fingerprint.confidence);

  if (fingerprint.fingerID == 1) {
    Serial.println("Bienvenido Profesor");
    abrirPuerta();
    enviarIDHuellaAlServidor(fingerprint.fingerID);
  } else if (fingerprint.fingerID == 6) {
    Serial.println("Bienvenido Eric");
    abrirPuerta();
    enviarIDHuellaAlServidor(fingerprint.fingerID);
  } else {
    // Si la huella no está registrada, registra una nueva huella
    registrarHuella();
  }
}

void Mal_Registro() {
  // Activa el Buzzer 2 veces por huella no autorizada
  digitalWrite(7, HIGH);
  delay(200);
  digitalWrite(7, LOW);
  delay(100);
  digitalWrite(7, HIGH);
  delay(200);
  digitalWrite(7, LOW);
}

void abrirPuerta() {
  Serial.println("Autorizado");
  // Abre la puerta
  delay(1000);
  // Aquí va tu código para abrir la puerta
}


void registrarHuella() {
  Serial.println("Por favor, registra una nueva huella.");
  Serial.println("Coloca tu dedo en el sensor...");

  uint8_t p = fingerprint.getImage();
  if (p != FINGERPRINT_OK) {
    Serial.println("Error al tomar la imagen de la huella. Vuelve a intentarlo.");
    return;
  }

  Serial.println("Imagen tomada. Levanta tu dedo del sensor.");

  p = fingerprint.image2Tz(1);
  if (p != FINGERPRINT_OK) {
    Serial.println("Error al convertir la imagen. Vuelve a intentarlo.");
    return;
  }

  Serial.println("Imagen convertida. Por favor, coloca tu dedo nuevamente.");

  p = fingerprint.getImage();
  if (p != FINGERPRINT_OK) {
    Serial.println("Error al tomar la imagen de la huella. Vuelve a intentarlo.");
    return;
  }

  Serial.println("Imagen tomada. Levanta tu dedo del sensor.");

  p = fingerprint.image2Tz(2);
  if (p != FINGERPRINT_OK) {
    Serial.println("Error al convertir la imagen. Vuelve a intentarlo.");
    return;
  }

  Serial.println("Imagen convertida. Registrando huella...");

  p = fingerprint.createModel();
  if (p != FINGERPRINT_OK) {
    Serial.println("Error al crear el modelo de huella. Vuelve a intentarlo.");
    return;
  }

  p = fingerprint.storeModel(fingerprint.fingerID);
  if (p != FINGERPRINT_OK) {
    Serial.println("Error al almacenar la huella. Vuelve a intentarlo.");
    return;
  }
}

void enviarIDHuellaAlServidor(int idHuella) {
  // Crea un mensaje JSON con el ID de la huella
  String mensaje = "{\"command\":\"signUp\",\"huella_id\":" + String(idHuella) + "}";

  // Envia el mensaje por el puerto serie hacia el servidor
  Serial.println(mensaje);
}
