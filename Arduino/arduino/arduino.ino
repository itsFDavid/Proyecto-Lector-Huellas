#include <ArduinoJson.h> // Incluir la librería ArduinoJson para manejo de JSON
#include <EEPROM.h>      // Incluir la librería EEPROM

// Definir la estructura para el registro
struct Registro {
  char nombre[30];
  int edad;
  char carrera[30];
};

// Dirección de memoria para almacenar el primer registro
int direccionRegistro = 0;

// Función para guardar un registro en la EEPROM
void guardarRegistro(const Registro& registro) {
  EEPROM.put(direccionRegistro, registro);
  direccionRegistro += sizeof(Registro);
}

// Función para leer un registro desde la EEPROM
void leerRegistro(Registro& registro, int indice) {
  int direccion = indice * sizeof(Registro);
  EEPROM.get(direccion, registro);
}

void setup() {
  Serial.begin(9600);
}

void buscar_huella(const char* jsonString) {
    // Crear un objeto DynamicJsonDocument para almacenar el objeto JSON
    const size_t capacity = JSON_OBJECT_SIZE(1) + 20;
    DynamicJsonDocument doc(capacity);
    
    // Deserializar el objeto JSON
    DeserializationError error = deserializeJson(doc, jsonString);
    
    // Verificar si hubo algún error en la deserialización
    if (error) {
      Serial.println("Error al deserializar el JSON");
      return;
    }
    
    // Extraer el índice del objeto JSON
    int indice = doc["indice"];
    
    // Verificar si el índice es válido
    if (indice < 0 || indice >= direccionRegistro / sizeof(Registro)) {
      Serial.println("Índice fuera de rango");
      return;
    }
    
    // Buscar el registro en la EEPROM
    Registro registroEncontrado;
    leerRegistro(registroEncontrado, indice);
    
    // Imprimir los detalles del registro encontrado
    Serial.print("Nombre: ");
    Serial.println(registroEncontrado.nombre);
    Serial.print("Edad: ");
    Serial.println(registroEncontrado.edad);
    Serial.print("Carrera: ");
    Serial.println(registroEncontrado.carrera);
}

void loop() {
  if (Serial.available() > 0) {
    String comando = Serial.readStringUntil('\n');
    
    if (comando == "Registrar Huella") {
      registrar_huella();
      Serial.println("Huella registrada exitosamente");
    } else if (comando == "Buscar Huella") {
      String jsonString = Serial.readStringUntil('\n');
      buscar_huella(jsonString.c_str());
    } else if (comando == "Eliminar Huella") {
      Serial.println("Huella eliminada satisfactoriamente");
    } else if (comando == "status") {
      Serial.println("El dispositivo está funcionando correctamente.");
    } else {
      Serial.println("Comando desconocido.");
    }
  }
}

void registrar_huella(){
    String jsonString = Serial.readStringUntil('\n'); // Leer el objeto JSON enviado por el servidor
    
    // Crear un objeto DynamicJsonDocument para almacenar el objeto JSON
    const size_t capacity = JSON_OBJECT_SIZE(4) + 60;
    DynamicJsonDocument doc(capacity);
    
    // Deserializar el objeto JSON
    DeserializationError error = deserializeJson(doc, jsonString);
    
    // Verificar si hubo algún error en la deserialización
    if (error) {
      Serial.println("Error al deserializar el JSON");
      return;
    }
    
    // Extraer los datos del objeto JSON
    const char* nombre = doc["nombre"];
    int edad = doc["edad"];
    const char* carrera = doc["carrera"];
    
    // Validar longitud de campos
    if (strlen(nombre) >= sizeof(Registro::nombre) || strlen(carrera) >= sizeof(Registro::carrera)) {
      Serial.println("Error: Nombre o carrera demasiado largo");
      return;
    }
    
    // Crear un nuevo registro con los datos obtenidos
    Registro nuevoRegistro;
    strncpy(nuevoRegistro.nombre, nombre, sizeof(nuevoRegistro.nombre));
    nuevoRegistro.edad = edad;
    strncpy(nuevoRegistro.carrera, carrera, sizeof(nuevoRegistro.carrera));
    
    // Guardar el registro en la EEPROM
    int indiceGuardado = direccionRegistro / sizeof(Registro); // Obtener el índice del registro guardado
    guardarRegistro(nuevoRegistro);
    
    // Enviar el índice al servidor
    Serial.print("Índice del registro guardado: ");
    Serial.println(indiceGuardado);
    
    // Mostrar los datos registrados en la consola serie
    Serial.println("Los siguientes datos fueron registrados:");
    Serial.print("Nombre: ");
    Serial.println(nombre);
    Serial.print("Edad: ");
    Serial.println(edad);
    Serial.print("Carrera: ");
    Serial.println(carrera);
}
