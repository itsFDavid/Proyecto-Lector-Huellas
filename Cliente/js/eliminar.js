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
let ws;
ws = new WebSocket('ws://localhost:8080');
function eliminarDatos() {
  // Aquí puedes agregar la lógica para enviar una solicitud al servidor y eliminar los datos del usuario con el ID especificado
  // Por ahora, solo mostraremos un mensaje en la consola
  const idUsuario = document.getElementById('id').value;
  const data={
    command: "delete",
    id_delete: idUsuario
  };
  ws.send(JSON.stringify(data));
}

// Función para mostrar los datos del usuario a eliminar en el modal
function mostrarDatosUsuarioEliminar() {
  const idUsuario = document.getElementById('id').value;
  const datosUsuarioEliminar = document.getElementById('datosUsuarioEliminar');
  // Aquí puedes agregar la lógica para obtener los datos del usuario con el ID especificado y mostrarlos en el modal
  // Por ahora, solo mostraremos un mensaje en el modal
  datosUsuarioEliminar.innerHTML = `<p>Id: ${idUsuario}</p>
                                    <p>Nombre: [Nombre del usuario]</p>
                                    <p>Edad: [Edad del usuario]</p>
                                    <p>Carrera: [Carrera del usuario]</p>
                                    <p>Foto: [Foto del usuario]</p>
                                    <p>Huella: [Huella del usuario]</p>`;
}

// Evento que se dispara al abrir el modal de confirmación
$('#confirmarEliminarModal').on('show.bs.modal', function (e) {
  mostrarDatosUsuarioEliminar();
});

