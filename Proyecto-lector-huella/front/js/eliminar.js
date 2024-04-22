document.addEventListener("DOMContentLoaded", ()=>{
    const conectado = localStorage.getItem("conectado");  
    var miModal = new bootstrap.Modal(document.getElementById("exampleModal"));
    var modalLabel = document.getElementById("exampleModalLabel");
    const btnOkey = document.getElementById("btn-okey");
  
  
    if (conectado === "false" || conectado === undefined) {
      modalLabel.textContent =
        "No hay conexión con el servidor. Por favor, intenta de nuevo más tarde.";
      miModal.show();
      btnOkey.addEventListener("click", function () {
        window.location.href = "../index.html";
      });
      return;
    }
    
  })


  var miModal = new bootstrap.Modal(document.getElementById("exampleModal"));
  var modalLabel = document.getElementById("exampleModalLabel");
  const btnOkey = document.getElementById("btn-okey");


  let ws;
  ws = new WebSocket('ws://localhost:4321');
  ws.addEventListener('message', function(event) {
    const data = event.data;
    console.log(data);
    const dataParse = JSON.parse(data);
    console.log(dataParse);
    if(dataParse.message === 'Huella eliminada') {
      modalLabel.textContent = dataParse.message;
      miModal.show();
      btnOkey.addEventListener('click', () => {
        miModal.hide()
      });
    }else{
        console.log(dataParse.message);
    }
  });

  const regresar= document.getElementById('regresar');
  regresar.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href= "../index.html";
  });


  async function eliminarDatos() {
    // Aquí puedes agregar la lógica para enviar una solicitud al servidor y eliminar los datos del usuario con el ID especificado
    // Por ahora, solo mostraremos un mensaje en la consola
    const idUsuario = document.getElementById('id').value;
    const url= `http://localhost:4321/api/arduino/deleteFinger/${idUsuario}`
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    console.log(data);
    
  }
  
  // Función para mostrar los datos del usuario a eliminar en el modal
  function mostrarDatosUsuarioEliminar() {
    const idUsuario = document.getElementById('id').value;
    const confirmarEliminacion = document.getElementById('datosUsuarioEliminar');
    // Aquí puedes agregar la lógica para obtener los datos del usuario con el ID especificado y mostrarlos en el modal
    // Por ahora, solo mostraremos un mensaje en el modal
    confirmarEliminacion.innerHTML = `¿Estás seguro de que deseas eliminar todos los datos del usuario con el ID ${idUsuario}?`;


  }
  
  // Evento que se dispara al abrir el modal de confirmación
  $('#confirmarEliminarModal').on('show.bs.modal', function (e) {
    mostrarDatosUsuarioEliminar();
  });