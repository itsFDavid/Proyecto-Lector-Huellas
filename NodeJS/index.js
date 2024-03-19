const WebSocket = require('ws');
const { SerialPort } = require('serialport');

const puertoSerie = new SerialPort({
  path: 'COM3',
  baudRate: 9600,
});

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('Mensaje recibido del cliente:', message);

    // Convertir el mensaje a una cadena de caracteres
    const comando = message.toString();

    // Enviar el comando al dispositivo Arduino
    puertoSerie.write(comando + '\n');
    if(comando === 'Registrar Huella'){
          // Enviar un objeto JSON al dispositivo Arduino
        const datos = {
            nombre: 'Juan',
            edad: 25,
            carrera: 'Ingeniería',
        };
        const jsonDatos = JSON.stringify(datos);
        puertoSerie.write(jsonDatos + '\n');
    }
    if(comando === 'Buscar Huella'){
        const indiceHuella = 1; // Aquí debes proporcionar el índice de la huella que deseas buscar
        const datos = {
            indice: indiceHuella,
        };
        const jsonDatos = JSON.stringify(datos);
        puertoSerie.write(jsonDatos + '\n');
    }
  });

  puertoSerie.on('data', function(data) {
    console.log('Datos recibidos desde Arduino:\n', data.toString());

    // Enviar los datos recibidos desde Arduino de vuelta al cliente
    ws.send(data.toString());
  });
});


