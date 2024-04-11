const express = require('express');
const http = require('http');
const cors = require('cors');
const WebSocket = require('ws'); // Importa el módulo de WebSockets
const arduinoRouter = require('./routes/arduinoRouter');
const { parser } = require('./utils/arduinoConnection');
const { dataTMP } = require('./utils/dataTMP');


const app = express();

// Configurar middleware de CORS
app.use(cors({
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'DELETE', 'HEAD', 'OPTIONS', 'POST', 'PUT'],
}));

const port = 4321;
const server = http.createServer(app);

// Usar el enrutador para las rutas relacionadas con Arduino
app.use(express.json());
app.use('/api/arduino', arduinoRouter);
// Configurar el servidor de WebSocket
const wss = new WebSocket.Server({ server });
app.set('wss', wss);
// Manejar conexiones de clientes con WebSockets
wss.on('connection', (ws) => {
    console.log('Nuevo cliente conectado a WebSocket');

    // Manejar desconexiones de clientes
    ws.on('close', () => {
        console.log('Cliente desconectado de WebSocket');
    });
});

parser.on('data', async (data) => {
    let jsonData;
    try {
        jsonData = JSON.parse(data);
        // Enviar datos al cliente a través de WebSocket
        console.log('Datos recibidos del Arduino:', jsonData);
        if(jsonData.found){
            const urlGetData= `http://localhost:4321/api/arduino/getDataUser/${jsonData.id_huellaFound}`;

            const response = await fetch(urlGetData);
            const dataUser = await response.json(); 
            console.log('Datos del usuario:', dataUser);

            jsonData = dataUser;

        }
    } catch (error) {
        const cleanedData = data.trim();
        // Si falla el análisis, convertir los datos a JSON
        jsonData = { message: cleanedData }; 
        console.log('Datos recibidos del Arduinos:', jsonData);
        if(jsonData.message== "Huella guardada"){
            //guardar los datos en data
            const userDataTmp = new dataTMP();
            const dataUser = userDataTmp.getData();
            console.log('Datos del usuario:', dataUser);
            userDataTmp.deleteData();

            console.log('Datos recibidos del Arduinolos:', dataUser);     
        }
    }
    // Enviar datos al cliente a través de WebSocket

    let JsonString= JSON.stringify(jsonData);
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JsonString);
        }
    });
});



// Iniciar el servidor
server.listen(port, () => {
    console.log(`Servidor en ejecución en http://localhost:${port}`);
});




// Exportar la aplicación y el servidor
module.exports = { app, server };
