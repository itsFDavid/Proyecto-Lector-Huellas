const WebSocket = require('ws');
//const { SerialPort } = require('serialport');
const fs = require('fs');

/*const puertoSerie = new SerialPort({
  path: 'COM3',
  baudRate: 9600,
});
*/

const ws = new WebSocket.Server({ port: 8080 });


let nextID=1;

ws.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('Mensaje recibido del cliente:', message);
    
    const data = JSON.parse(message);
    data.id= nextID++;
    // Verificar el comando recibido y actuar en consecuencia
    switch (data.command) {
      case 'signUp':
        console.log(data.command)
        //puertoSerie.write("sigUp"); <-- Qui mando el comando para activar el lector
        break;
      case 'delete':
        console.log(data.command);
        console.log(data.id_delete);

        //guardarDatos(data);
        break;
      case 'searchFootPrint':
        console.log({
          command: data.command,
          name: data.nameToSearch,
          id: data.idToSearch
        })
       break;
      default:
        console.log('Comando desconocido:', data.command);
        break;
    }
    
  });
  /*
  puertoSerie.on('data', function(data) {
    const datosString= data.toString();
    const data={
      dataArduino: datosString
    };
    
    const response= JSON.stringify(data);
    
    
    console.log('Datos recibidos desde Arduino:\n', response);
    ws.send(response);
  });
  */
});

// Función para guardar los datos recibidos en un archivo
// Función para agregar los datos recibidos al archivo existente
function guardarDatos(datos) {
  // Ruta y nombre de archivo donde se guardarán los datos
  const filePath = '/Users/david/Desktop/Universidad/Semestre 4 Ubuntu/Metodos_Numericos/Proyecto/NodeJS/data/datos_cliente.json';

  // Leer los datos existentes del archivo, si los hay
  let datosAnteriores = [];
  try {
    const dataFromFile = fs.readFileSync(filePath);
    datosAnteriores = JSON.parse(dataFromFile);
  } catch (error) {
    // No hacer nada si el archivo no existe o está vacío
  }

  // Agregar los nuevos datos al array de datos existentes
  datosAnteriores.push(datos);

  // Escribir los datos actualizados en el archivo
  try {
    fs.writeFileSync(filePath, JSON.stringify(datosAnteriores));
    console.log('Datos guardados correctamente en el archivo:', filePath);
  } catch (error) {
    console.error('Error al guardar los datos en el archivo:', error.message);
  }
}


