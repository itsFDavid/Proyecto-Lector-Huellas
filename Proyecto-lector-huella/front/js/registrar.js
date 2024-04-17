document.addEventListener("DOMContentLoaded", function () {

    const conectado = localStorage.getItem("conectado");  
    var miModal = new bootstrap.Modal(document.getElementById("exampleModal"));
    var modalLabel = document.getElementById("exampleModalLabel");
    const btnOkey = document.getElementById("btn-okey");
    let ws;
    ws = new WebSocket('ws://localhost:4321');
    if (conectado === "false" || conectado === undefined) {
      modalLabel.textContent =
        "No hay conexión con el servidor. Por favor, intenta de nuevo más tarde.";
      miModal.show();
      btnOkey.addEventListener("click", function () {
        window.location.href = "../index.html";
      });
      return;
    }
    ws.addEventListener('message', function(event) {
        const data = event.data;
        console.log(data);
        console.log(data.message);
        const dataParse = JSON.parse(data);
        console.log(dataParse);
        if(dataParse.message === 'Huella guardada') {
          modalLabel.textContent = dataParse.message;
          miModal.show();
          btnOkey.addEventListener('click', () => {
            window.location.href = "registrar_huella.html";
          });
        } else {
            console.log(dataParse.message);
            /*
            modalLabel.textContent = dataParse.message;
            miModal.show();
            btnOkey.addEventListener('click', () => {
                window.location.href = "registrar_huella.html";
            });
            */
        }
    });
    
        // Definir una función para mostrar un indicador de carga
function mostrarCarga() {
    // Código para mostrar un indicador de carga (puede ser un spinner, mensaje, etc.)
    console.log("Cargando...");
}

// Definir una función para ocultar el indicador de carga
function ocultarCarga() {
    // Código para ocultar el indicador de carga
    console.log("Carga completada.");
}
const registrarData = document.getElementById('registrarData');
// Escuchar el clic en el botón capturarHuella
registrarData.addEventListener('click', (e) => {
    // Obtener los datos del formulario
    e.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const id_huella = document.getElementById('id_huella').value;
    const apellidoPaterno = document.getElementById('apellidoPaterno').value;
    const apellidoMaterno = document.getElementById('apellidoMaterno').value;
    const correoInstitucional = document.getElementById('correoInstitucional').value;
    const carrera = document.getElementById('carrera').value;
    const fechaNacimiento = document.getElementById('fechaNacimiento').value;
    const fotoInput = document.getElementById('fotoUser');
    console.log('fotoInput: '+fotoInput);

    let dataUser={};
    console.log(dataUser);
    if (fotoInput.files.length > 0) {
        const fotoFile = fotoInput.files[0];
        const reader = new FileReader();

        // Mostrar el indicador de carga
        mostrarCarga();

        reader.onload = (event) => {
            const fotoBase64 = event.target.result;

            dataUser = {
                command: "signUp",
                nombre: nombre,
                id_huella: id_huella,
                apellidoPaterno: apellidoPaterno,
                apellidoMaterno: apellidoMaterno,
                correoInstitucional: correoInstitucional,
                carrera: carrera,
                fechaNacimiento: fechaNacimiento,
                fotoUser: fotoBase64
            };
            console.log(dataUser);
            try{
                const url= 'http://localhost:4321/api/arduino/register';
                fetch(url, {
                    method: 'POST',
                    body: JSON.stringify(dataUser),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(response => response.json())
                .then(data =>{
                    console.log(data);
                })
            }catch (error) {
                modalLabel.textContent = "Error al registrar huella";
                miModal.show();
                btnOkey.addEventListener('click', () => {
                    window.location.href = "registrar_huella.html"; 
                });
            }
            ocultarCarga();
        };

        reader.readAsDataURL(fotoFile);
    } else {
        // Manejar el caso en el que no se selecciona ninguna imagen
        modalLabel.textContent = "No se ha seleccionado ninguna imagen";
        miModal.show();
        btnOkey.addEventListener('click', () => {
            window.location.href = "registrar_huella.html";
        });
    }
    
    console.log('data: '+ dataUser);

});

    const cancel = document.getElementById("cancel");
        cancel.addEventListener("click", function () {
        window.location.href = "../index.html";
    })

});
  