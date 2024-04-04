document.addEventListener("DOMContentLoaded", ()=>{
    const conectado = localStorage.getItem("conectado");  
  var miModal = new bootstrap.Modal(document.getElementById("exampleModal"));
  var modalLabel = document.getElementById("exampleModalLabel");
  const btnOkey = document.getElementById("btn-okey");
  let ws;
  ws = new WebSocket('ws://localhost:8080');

  if (conectado === "false" || conectado === undefined) {
    modalLabel.textContent =
      "No hay conexión con el servidor. Por favor, intenta de nuevo más tarde.";
    miModal.show();
    btnOkey.addEventListener("click", function () {
      window.location.href = "../index.html";
    });
    return;
  }
 // TODO: hacer que muestre los datos registrados en arduino independientemente si hay o no
  ws.onmessage= function(message){
    const data= message
  }
})