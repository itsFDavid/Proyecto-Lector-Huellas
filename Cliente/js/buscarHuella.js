document.addEventListener("DOMContentLoaded", function () {

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
    
    

});

let ws;
ws = new WebSocket('ws://localhost:8080');

const $form= document.getElementById('form');
    $form.addEventListener("submit", (e)=>{
        e.preventDefault();
        const $nameInput= document.getElementById('nombre');
        const $idInput= document.getElementById('id');
        const $name= $nameInput.value;
        const $id= $idInput.value;
        console.log({
            command: "searchFootPrint",
                nameToSearch: $name,
                idToSearch: $id
        })
        ws.send(JSON.stringify(
            {
                command: "searchFootPrint",
                nameToSearch: $name,
                idToSearch: $id
            }
        ))
    })