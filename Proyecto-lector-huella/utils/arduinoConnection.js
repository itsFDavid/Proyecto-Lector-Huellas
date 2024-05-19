
const { SerialPort } = require('serialport');
const Readline = require('@serialport/parser-readline');


const arduinoPort = new SerialPort({
    path: '/dev/cu.usbserial-11230',
    baudRate: 9600,
});

// Configurar el parser para leer los datos del puerto serie
const parser = arduinoPort.pipe(new Readline.ReadlineParser({ delimiter: '\n' }));



module.exports = { arduinoPort, parser};
