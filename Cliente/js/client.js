document.addEventListener('DOMContentLoaded', function(){

    let ws;
    let conectado = false;
    
    
    function mostrarModal(opcion) {
        const optionMsg=['Conexion Establecida con el Servidor WebSocket', 'Conexión cerrada con el servidor WebSocket'];
        const titleMsg=['Conexion Exitosa', 'Conexion Fallida'];
        var msg = '';
        var title = '';
        msg= opcion ? optionMsg[0] : optionMsg[1];
        title= opcion ? titleMsg[0] : titleMsg[1];
        var h5 = document.getElementById('conexionModalLabel');
        h5.textContent= title;
        $('#conexionModal .modal-body').text(msg);
        $('#conexionModal').modal('show');
    }
    
    function conectarArduino(e) {
        e.preventDefault();
        if (!conectado) {
            ws = new WebSocket('ws://localhost:8080');
            console.log(ws);
            ws.onopen = function() {
                mostrarModal(true);
                document.getElementById('conectarBtn').textContent = 'Desconectar de Arduino';
                conectado = true;
                localStorage.setItem('conectado', conectado);
                // Habilitar los botones una vez que se establezca la conexión
                habilitarBotones(true);
                window.ws=ws;
                console.log(window.ws)
            };
    
            ws.onclose = function() {
                mostrarModal(false);
                document.getElementById('conectarBtn').textContent = 'Conectar con Arduino';
                document.getElementById('functions').textContent = 'Funciones no disponibles hasta conectar con Arduino'
                conectado = false;
                localStorage.setItem('conectado', conectado);
                // Deshabilitar los botones cuando se cierre la conexión
                habilitarBotones(false);
            };
        } else {
            ws.close();
        }
    }
    
    document.getElementById('conectarBtn').addEventListener('click', conectarArduino);
    
    document.getElementById('Registrar-huella').addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href= "pages/registrar_huella.html";
    });
    
    document.getElementById('Buscar-huella').addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href= "pages/buscar_huella.html";
    });
    
    document.getElementById('all-data').addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href= "pages/all.html";
    });
    
    document.getElementById('Eli-hulla-data').addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href= "pages/eliminar.html";
    });
    
    
    // Función para habilitar o deshabilitar los botones
    function habilitarBotones(habilitar) {
        document.getElementById('Registrar-huella').disabled = !habilitar;
        document.getElementById('Buscar-huella').disabled = !habilitar;
        document.getElementById('all-data').disabled = !habilitar;
        document.getElementById('Eli-hulla-data').disabled = !habilitar;
        document.getElementById('logInBtn').disabled = !habilitar;
    }
    

});
