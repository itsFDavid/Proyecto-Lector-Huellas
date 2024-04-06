/*
  Acceso con huella dactilar

A. UNO    SENSOR
  5V        V+
  2         TX
  3         RX
  GND       GND

  by: http://elprofegarcia.com
  
*/


#include <Adafruit_Fingerprint.h>    // Libreria  para el Sensor de huella dactilar
#include <Servo.h>                   // Libreria  SERVO

SoftwareSerial mySerial(2, 3);     // Crear Serial para Sensor  Rx, TX del Arduino
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);  // Crea el objeto Finger comunicacion pin 2 , 3 
int analogo5=0;                                 // Variable de lectura del Analogo5 para sensor de obstaculos
Servo servoPT;                                 // Asocia la libreria servo a  servoPT


void setup()  
{
  //pinMode(7, OUTPUT);
  //pinMode(5, OUTPUT);
  pinMode(3, OUTPUT);
  Serial.begin(9600);
  servoPT.attach(4);      // Sevo asociado al pin 4 y lleva a 170 grados
  servoPT.write(170);
  while (!Serial);       //  Yun/Leo/Micro/Zero/...
  delay(100);
  Serial.println("Sistema de apertura con huella dactilar");

  // set the data rate for the sensor serial port
  finger.begin(57600);  // inicializa comunicacion con sensor a 57600 Baudios
  delay(5);
  if (finger.verifyPassword()) {
    Serial.println("Detectado un sensor de huella!");
  } else {
    Serial.println("No hay comunicacion con el sensor de huella");
    Serial.println("Revise las conexiones");
    while (1) { delay(1); }
  }

  finger.getTemplateCount();
  Serial.print("El sensor contiene "); Serial.print(finger.templateCount); Serial.println(" plantillas");
  Serial.println("Esperando por una huella valida...");
}

void loop()                    
{
  /*
   analogo5=analogRead(A5);
   if ( analogo5<=800) {                   // Si el sensor de obtaculos fue obstruido abre la puerta
                                 
     }*/
  Serial.print("Salida Interna *** ");
  abrirPuerta();  
  getFingerprintIDez();
  delay(50);            //retardo de 50 milisegundos entre lecturas
}




void Mal_Registro() {      // Activa el Buzzer 2 veces por tarjeta no autorizada
  digitalWrite(7, HIGH);
  delay(200);
  digitalWrite(7, LOW);
  delay(100);
  digitalWrite(7, HIGH);
  delay(200);
  digitalWrite(7, LOW);
  Serial.println("Huella incorrecta");
}

void abrirPuerta() {
  Serial.println(" AUTORIZADA *** "); 
  //digitalWrite(5, HIGH);   // Abrir la cerradura
  delay(1000);
  servoPT.write(90);       // Abrir la puerta 
  delay(3000);             // Tiempo de la puerta abierta
  //digitalWrite(7, HIGH);   // Suena el buzzer para indicar que se va a cerrar la puerta
  delay(500);
  servoPT.write(170);       // Cierra puerta 
  delay(500);
  //digitalWrite(7, LOW);     // apaga el buzzer 
  //digitalWrite(5, LOW);     // cierra la cerradura 
}

int getFingerprintIDez() {
  uint8_t p = finger.getImage();
  if (p != FINGERPRINT_OK)  return -1;

  p = finger.image2Tz();
  if (p != FINGERPRINT_OK)  return -1;

  p = finger.fingerFastSearch();
  if (p != FINGERPRINT_OK) { 
    Mal_Registro();
    return -1;
  }
  // Si hay coincidencias de huella
  Serial.print("ID #"); Serial.print(finger.fingerID); 
  Serial.print(" coincidencia del "); Serial.println(finger.confidence);
   if(finger.fingerID==1){
     Serial.print("BIENVENIDO PROFE *** "); 
     abrirPuerta();
   }
   if(finger.fingerID==6){
     Serial.print("BIENVENIDO ERIC *** "); 
     abrirPuerta();
   }
  return finger.fingerID; 
}

