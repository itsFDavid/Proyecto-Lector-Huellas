
const { SerialPort } = require('serialport');
const Readline = require('@serialport/parser-readline');


const arduinoPort = new SerialPort({
    path: '/dev/cu.usbserial-1130',
    baudRate: 9600,
});


const parser = arduinoPort.pipe(new Readline.ReadlineParser({ delimiter: '\n' }));



module.exports = { arduinoPort, parser};
