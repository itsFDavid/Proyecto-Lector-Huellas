document.addEventListener("DOMContentLoaded", function () {

    const conectado = localStorage.getItem("conectado");  
    let ws;
    ws = new WebSocket('ws://localhost:4321');
    if (conectado === "false" || conectado === undefined) {
      Swal.fire({
        title: "Sin conexion!",
        html: "Se ha perdido la conexión con el servidor. Por favor, intenta de nuevo más tarde.",
        icon: "error",
        timer: 3500,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
        }
      }).then(() => {
        window.location.href = "../index.html";
      });
      return;
    }
    ws.addEventListener('message', function(event) {
        const data = event.data;
        
        const dataParse = JSON.parse(data);
        Swal.fire({
          position: "center",
          icon: "info",
          title: dataParse.message ,
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
        if(dataParse.message === 'Huella guardada') {
          Swal.fire({
            title: "Huella guardada!",
            html: "La huella se ha guardado correctamente.",
            icon: "success",
            timer: 2000,
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading();
            }
          });
        }
    });
    
const registrarData = document.getElementById('registrarData');

registrarData.addEventListener('click', async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    

    const nombre = document.getElementById('nombre').value;
    const id_huella = document.getElementById('id_huella').value;
    const apellidoPaterno = document.getElementById('apellidoPaterno').value;
    const apellidoMaterno = document.getElementById('apellidoMaterno').value;
    const correoInstitucional = document.getElementById('correoInstitucional').value;
    const carrera = document.getElementById('carrera').value;
    const fechaNacimiento = document.getElementById('fechaNacimiento').value;

    const fotoUser = document.getElementById('fotoUser')

    formData.append('command', 'signUp');
    formData.append('nombre', nombre);
    formData.append('id_huella', id_huella);
    formData.append('apellidoPaterno', apellidoPaterno);
    formData.append('apellidoMaterno', apellidoMaterno);
    formData.append('correoInstitucional', correoInstitucional);
    formData.append('carrera', carrera);
    formData.append('fechaNacimiento', fechaNacimiento);
    formData.append('fotoUser', fotoUser.files[0]);

    console.log('dataUser:', formData.get('fotoUser'));
    const res= await fetch('http://localhost:4321/api/arduino/register', {
        method: 'POST',
        body: formData,
    })
    const resp= await res.json();
    console.log(resp)

});

    const cancel = document.getElementById("cancel");
        cancel.addEventListener("click", function () {
        window.location.href = "../index.html";
    })

});
  