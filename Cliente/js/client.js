let ws;
let conectado = false;

function conectarArduino() {
    if (!conectado) {
        ws = new WebSocket('ws://localhost:8080');

        ws.onopen = function() {
            console.log('Conexión establecida con el servidor WebSocket');
            document.getElementById('conectarBtn').textContent = 'Desconectar de Arduino';
            conectado = true;
            // Habilitar los botones una vez que se establezca la conexión
            habilitarBotones(true);
        };

        ws.onclose = function() {
            console.log('Conexión cerrada con el servidor WebSocket');
            document.getElementById('conectarBtn').textContent = 'Conectar con Arduino';
            conectado = false;
            // Deshabilitar los botones cuando se cierre la conexión
            habilitarBotones(false);
        };
    } else {
        ws.close();
    }
}

document.getElementById('conectarBtn').addEventListener('click', conectarArduino);

function enviarComando(comando) {
    ws.send(comando);
}

document.getElementById('Registrar-huella').addEventListener('click', function() {
    enviarComando('Registrar Huella');
});

document.getElementById('Buscar-huella').addEventListener('click', function() {
    enviarComando('Buscar Huella');
});

document.getElementById('Modi-huella-data').addEventListener('click', function() {
    enviarComando('Modificar Datos del Usuario con Huella');
});

document.getElementById('Eli-hulla-data').addEventListener('click', function() {
    enviarComando('Eliminar Datos con Huella');
});

// Función para habilitar o deshabilitar los botones
function habilitarBotones(habilitar) {
    document.getElementById('Registrar-huella').disabled = !habilitar;
    document.getElementById('Buscar-huella').disabled = !habilitar;
    document.getElementById('Modi-huella-data').disabled = !habilitar;
    document.getElementById('Eli-hulla-data').disabled = !habilitar;
}
