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
        Swal.fire({
            position: "bottom-end",
            icon: opcion ? "success" : "error",
            title: title,
            text: msg,
            showConfirmButton: false,
            timer: 1500
          });
    }

    function conectarArduino(e) {
        e.preventDefault();
        if (!conectado) {
            ws = new WebSocket('ws://localhost:4321');
            ws.onopen = function() {
                mostrarModal(true);
                document.getElementById('conectarBtn').textContent = 'Desconectar de Arduino';
                document.getElementById('functions').textContent = 'Funciones disponibles';
                conectado = true;
                localStorage.setItem('conectado', conectado);
               
                habilitarBotones(true);
                window.ws=ws;
            };

            ws.onclose = function() {
                mostrarModal(false);
                document.getElementById('conectarBtn').textContent = 'Conectar con Arduino';
                document.getElementById('functions').textContent = 'Funciones no disponibles hasta conectar con Arduino'
                conectado = false;
                localStorage.setItem('conectado', conectado);
                
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

    document.getElementById('Iniciar-sesion').addEventListener('click', async function(e) {
        e.preventDefault();
        window.location.href= "pages/LogIn.html";
    });

    document.getElementById('all-data').addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href= "pages/all.html";
    });

    document.getElementById('Eli-hulla-data').addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href= "pages/eliminar.html";
    });


    function habilitarBotones(habilitar) {
        document.getElementById('Registrar-huella').disabled = !habilitar;
        document.getElementById('Iniciar-sesion').disabled = !habilitar;
        document.getElementById('all-data').disabled = !habilitar;
        document.getElementById('Eli-hulla-data').disabled = !habilitar;
    }


});