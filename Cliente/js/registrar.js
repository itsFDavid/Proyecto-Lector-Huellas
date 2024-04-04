document.addEventListener("DOMContentLoaded", function () {

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

  const capturarHuella= document.getElementById('btn-cap');
  capturarHuella.addEventListener('click', ()=>{
    modalLabel.textContent="Ingresa huella en el lector, mantenla ahi";
    miModal.show()
    ws.send(JSON.stringify({command: "signUp"}))
    /*btnOkey.addEventListener('click', ()=>{
      window.location.href="../pages/registrar_huella.html"
    });
    if(res=='ok'){
      modalLabel.textContent="Huella registrada";
      miModal.show();
      btnOkey.addEventListener('click', ()=>{
        window.location.href="../index.html";
      });
    }
    */
  });

    const cancel = document.getElementById("cancel");
    cancel.addEventListener("click", function () {
      window.location.href = "../index.html";
    });
});
