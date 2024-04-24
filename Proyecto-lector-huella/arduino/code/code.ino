#include <Adafruit_Fingerprint.h>
#include <SoftwareSerial.h>
#include <Servo.h>
#include <ArduinoJson.h>

SoftwareSerial fingerprintSerial(2, 3);  // RX, TX
Adafruit_Fingerprint fingerprint = Adafruit_Fingerprint(&fingerprintSerial);
Servo servoMotor;

void enviarExitoF(const char* message){
  JsonDocument docExito;
  docExito["response"]= "success";
  docExito["message"]= message;


  serializeJson(docExito, Serial);
  Serial.println();
}

void enviarErrorF(const char* message){
  JsonDocument docError;
  docError["response"]= "error";
  docError["message"]= message;


  serializeJson(docError, Serial);
  Serial.println();
}
void enviarExito(const char* message){
  Serial.println(message);
}
void enviarError(const char* message){
  Serial.println(message);
}
void setup() {
  servoMotor.attach(8);
  servoMotor.write(0);
  Serial.begin(9600);
  while (!Serial);


  fingerprintSerial.begin(57600);
  delay(5);
  
  if (fingerprint.verifyPassword()) {
   enviarExitoF("Lector de huellas detectado");
  } else {
    enviarErrorF("Dispositivo no detectado, revise las conexiones o reinicie");
    while (1) delay(1);
  }
}

void loop() {
  if (Serial.available() > 0){ 
    // Lee el comando enviado por el servidor
    String command = Serial.readStringUntil('\n');
    // Procesa el comando
    procesarComando(command);
    
  }

  delay(50); // Retardo de 50 milisegundos entre lecturas
}


void procesarComando(String command) {
  JsonDocument doc;
  DeserializationError error = deserializeJson(doc, command);

  // Verifica si el comando es válido
  const char* comando = doc["command"];

  if (error) {
    enviarErrorF("Error al deserializar el objeto json");
    return;
  }
  
  if (strcmp(comando, "verifyFinger") == 0) {
    verifyFinger();
  } else if (strcmp(comando, "signUp") == 0) {
    registrarHuella(doc["huella_id"]);
  } else if (strcmp(comando, "getHuellasId") == 0) {
    numeroHuellas();
  } else if(strcmp(comando, "deleteFinger")==0){
    deleteHuellaId(doc["huella_id"]);
  }else {
    enviarErrorF("Comando desconocido");
  }
}

void numeroHuellas(){
  JsonDocument doc;
  fingerprint.getTemplateCount();
  doc["response"]= "success";
  doc["numFootprints"] = fingerprint.templateCount;
  serializeJson(doc, Serial);
  Serial.println();
}

void verifyFinger() {
  JsonDocument doc;
  enviarExito("Coloque su dedo para verificar");
  delay(3000);

  uint8_t p = fingerprint.getImage();
  if (p != FINGERPRINT_OK) return;

  p = fingerprint.image2Tz();
  if (p != FINGERPRINT_OK) return;

  p = fingerprint.fingerFastSearch();
  if (p != FINGERPRINT_OK) {
    enviarError("Huella no registrada, registra una nueva huella");
    return;
  }
  doc["response"]="success";
  doc["found"] = true;
  doc["id_huellaFound"]= fingerprint.fingerID;
  doc["coincidences"]= fingerprint.confidence;
  serializeJson(doc, Serial);
  Serial.println();
  abrirPuerta();
}

void abrirPuerta() {
  int pos;

  for(pos=0; pos<180; pos++){
    servoMotor.write(pos);
    delay(2);
  }
  // Abre la puerta
  delay(1000);
  for(pos=180; pos>0; pos--){
    pos-=2;
    servoMotor.write(pos);
    delay(2);
  }
  delay(1000);
}

void registrarHuella(uint8_t id) {
  uint8_t p=-1;
  /*
  enviarExito("Coloque su dedo para verificar primero su huella");
  p = fingerprint.fingerFastSearch();
  if (p == FINGERPRINT_OK) {
    // La huella ya está registrada en otro ID
    enviarError("La huella ya ha sido registrada antes");
    return;
  }
  */

  p= -1;
  while (p != FINGERPRINT_OK){
    p = fingerprint.getImage();
    switch (p) {
    case FINGERPRINT_OK:
      enviarExito("Imagen tomada");
      delay(2000);
      break;
    case FINGERPRINT_NOFINGER:
      enviarExito("Coloque su dedo el el lector");
      delay(3000);
      break;
    case FINGERPRINT_PACKETRECIEVEERR:
      enviarError("Error de comunicacion");
      break;
    case FINGERPRINT_IMAGEFAIL:
      enviarError("Error en la imagen");
      break;
    default:
      enviarError("Error desconocido");
      break;
    }
  }

  //ok success

  p = fingerprint.image2Tz(1);
  switch (p) {
    case FINGERPRINT_OK:
      enviarExito("Imagen convertida");
      delay(3000);
      break;
    case FINGERPRINT_IMAGEMESS:
      enviarError("Imagen muy desordenada");
      return p;
    case FINGERPRINT_PACKETRECIEVEERR:
      enviarError("Error de comunicacion");
      return p;
    case FINGERPRINT_FEATUREFAIL:
      enviarError("No se pudieron encontrar caracteristicas en la huella");
      return p;
    case FINGERPRINT_INVALIDIMAGE:
      enviarError("No se pudieron encontrar caracteristicas en la huella");
      return p;
    default:
      enviarError("Error desconocido");
      return p;
  }

  enviarExito("Quite el dedo del lector");
  delay(2000);
  p = 0;
  while(p != FINGERPRINT_NOFINGER){
    p= fingerprint.getImage();
  }

  p = -1;
  //enviarExito("Coloque su dedo nuevamente en el lector");
  
  while (p != FINGERPRINT_OK) {
    p = fingerprint.getImage();
    switch (p) {
    case FINGERPRINT_OK:
      enviarExito("Imagen tomada");
      delay(3000);
      break;
    case FINGERPRINT_NOFINGER:
      enviarExito("Coloque su dedo nuevamente en el lector");
      delay(3000);
      break;
    case FINGERPRINT_PACKETRECIEVEERR:
      enviarError("Error de comunicacion");
      break;
    case FINGERPRINT_IMAGEFAIL:
      enviarError("Error en la imagen");
      break;
    default:
      enviarError("Error desconocido");
      break;
    }
  }

    p = fingerprint.image2Tz(2);
  switch (p) {
    case FINGERPRINT_OK:
      enviarExito("Imagen convertida");
      delay(3000);
      break;
    case FINGERPRINT_IMAGEMESS:
      enviarError("Imagen muy desordenada");
      return p;
    case FINGERPRINT_PACKETRECIEVEERR:
        enviarError("Error de comunicacion");
      return p;
    case FINGERPRINT_FEATUREFAIL:
      enviarError("No se pudieron encontrar caracteristicas en la huella");
      return p;
    case FINGERPRINT_INVALIDIMAGE:
      enviarError("No se pudieron encontrar caracteristicas en la huella");
      return p;
    default:
        enviarError("Error desconocido");
      return p;
  }

  //ok success
  enviarExito("Creando modelo");
  delay(3000);

  p = fingerprint.createModel();

  if (p == FINGERPRINT_OK) {
    enviarExito("Existen coincidencias en las capturas de huella");
    delay(3000);
  } else if (p == FINGERPRINT_PACKETRECIEVEERR) {
    enviarError("Error de comunicacion");
    return p;
  } else if (p == FINGERPRINT_ENROLLMISMATCH) {
    enviarError("No existen coincidencias en las capturas de huella");
    return p;
  } else {
    enviarError("Error desconocido");
    return p;
  }

  //despues de crear el modelo
  p = fingerprint.storeModel(id);
  if (p == FINGERPRINT_OK) {
    enviarExito("Huella guardada");
  } else if (p == FINGERPRINT_PACKETRECIEVEERR) {
    enviarError("Error de comunicacion");
    return p;
  } else if (p == FINGERPRINT_BADLOCATION) {
    enviarError("No se pudo almacenar en la locacion indicada");
    return p;
  } else if (p == FINGERPRINT_FLASHERR) {
    enviarError("Error al escribir en flash");
    return p;
  } else {
    enviarError("Error desconocido");
    return p;
  }
}

void deleteHuellaId(uint8_t id){
  uint8_t p = -1;

  p = fingerprint.deleteModel(id);

  if (p == FINGERPRINT_OK) {
    enviarExito("Huella eliminada");
  } else if (p == FINGERPRINT_PACKETRECIEVEERR) {
    enviarError("Error de comunicacion");
  } else if (p == FINGERPRINT_BADLOCATION) {
    enviarError("No se pudo borrar en esa locacion");
  } else if (p == FINGERPRINT_FLASHERR) {
    enviarError("Error al escribir en flash");
  } else {
   enviarError("Error desconocido");
  }
}



void enviarIDHuellaAlServidor(int idHuella) {
  
}
