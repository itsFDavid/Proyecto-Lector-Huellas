const express = require('express');
const http = require('http');
const cors = require('cors');
const WebSocket = require('ws'); // Importa el módulo de WebSockets
const arduinoRouter = require('./routes/arduinoRouter');
const { parser } = require('./utils/arduinoConnection');
const { dataTMP } = require('./utils/dataTMP');
const {insertar, obtenerNumeroIds} = require('./models/modelBD');
const fs = require('fs');
const path = require('path');

const bodyParser = require('body-parser');
const app = express();

// Configurar middleware de CORS
app.use(cors({
    origin: 'http://127.0.0.1:5501',
    methods: ['GET', 'DELETE', 'HEAD', 'OPTIONS', 'POST', 'PUT'],
}));
app.use(bodyParser.json({ limit: '50mb' }));

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
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
            const id_huellaFound = jsonData.id_huellaFound;
            console.log('Datos recibidos del id:', id_huellaFound);
            const urlGetData= `http://localhost:4321/api/arduino/getDataUser/${id_huellaFound}`;

            const response = await fetch(urlGetData);
            const dataUser = await response.json(); 
            console.log('Datos del usuario para login:', dataUser);

            jsonData = dataUser;
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ event: 'found', data: dataUser }));
                }
            });
            //console.log('Datos enviados al cliente en login:', jsonData);

        }else if(jsonData.numFootprints){
            console.log('Datos recibidos del num:', jsonData);
            const response = await obtenerNumeroIds();
            const numFootprintsBD = response[0].numFootprints;
            console.log('Datos de la base de datos:', numFootprintsBD);
            const numFootprintsArduino = jsonData.numFootprints;
            if(numFootprintsBD == numFootprintsArduino){
                jsonData = {message: `Los datos en la base de datos y arduino son: ${numFootprintsBD}`};
            }else{
                jsonData = {message: `Los datos en la base de datos y arduino no coinciden: ${numFootprintsBD} y ${numFootprintsArduino} respectivamente`};
            }
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ event: 'numFootprints', data: jsonData }));
                    console.log('Datos enviados al cliente:', jsonData);
                }
            });
            
        }
    } catch (error) {
        const cleanedData = data.trim();
        // Si falla el análisis, convertir los datos a JSON
       
        jsonData = { message: cleanedData }; 
        //console.log('Datos recibidos del Arduinoss:', jsonData);
        console.log('Datos recibidos del Arduinos:', jsonData);
        if(jsonData.message== "Huella guardada"){ 
            //guardar los datos en data
            const userDataTmp = new dataTMP();
            const dataUser = userDataTmp.getData()[0];
            console.log('Datos del usuario:', dataUser);
            const {id_huella, nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento, carrera, correoInstitucional, fotoUser} = dataUser;
            console.log('Datos del usuario:', nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento, carrera, correoInstitucional, fotoUser);
            
            
            const imageName = fotoUser;
            
            //insertar en la base de datos tipo estos datos:
            const response = await insertar(id_huella, nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento, carrera, correoInstitucional, imageName);
            console.log('Datos insertados:', response);
            userDataTmp.deleteData();
        }else if(jsonData.message== "No se pudieron encontrar caracteristicas en la huella" || jsonData.message== "Error desconocido" || jsonData.message== "Error en la imagen" || jsonData.message== "Error de comunicacion" || jsonData.message== "No existen coincidencias en las capturas de huella" || jsonData.message== "No se pudo almacenar en la locacion indicada" || jsonData.message == "Error al escribir en flash"){
            const userDataTmp = new dataTMP();
            const data = userDataTmp.getData()[0];
            const {fotoUser} = data;
            const imageName = fotoUser;
            const pathImage = path.join(__dirname, 'public/uploads', imageName);
            fs.unlinkSync(pathImage);

        }
    }
    let JsonString= JSON.stringify(jsonData);
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JsonString);
        }
    });
    console.log('Datos enviados al cliente:', JsonString);
});



// Iniciar el servidor
server.listen(port, () => {
    console.log(`Servidor en ejecución en http://localhost:${port}`);
});




// Exportar la aplicación y el servidor
module.exports = { app, server };
