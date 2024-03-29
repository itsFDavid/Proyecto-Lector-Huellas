document.addEventListener("DOMContentLoaded", function () {
  let ws;
  const conectado = localStorage.getItem("conectado");
  const form = document.getElementById("form");
  var miModal = new bootstrap.Modal(document.getElementById("exampleModal"));
  var modalLabel = document.getElementById("exampleModalLabel");
  const btnOkey = document.getElementById("btn-okey");
  console.log(conectado);

  if (conectado === "false" || conectado === undefined) {
    modalLabel.textContent =
      "No hay conexión con el servidor. Por favor, intenta de nuevo más tarde.";
    miModal.show();
    btnOkey.addEventListener("click", function () {
      window.location.href = "../index.html";
    });
    return;
  }

  ws = new WebSocket("ws://localhost:8080");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("nombre").value;
    const edad = document.getElementById("edad").value;
    const carrera = document.getElementById("carrera").value;
    const filePhoto = document.getElementById("filePhoto");

    if (filePhoto.files.length > 0) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = e.target.result;
        const data = {
          command: "sigUp",
          name: name,
          age: edad,
          carrer: carrera,
          photo: img,
          footPrint: "",
        };
        const f={
          command: 'pedirHuella'
        }
        ws.send(JSON.stringify(data))
      };
      reader.readAsDataURL(filePhoto.files[0]);
    }
  });

  ws.onmessage = function (event) {
    const res = event.data;
    modalLabel.textContent = "Onmessage"; // Actualiza contenido del modal
    miModal.handleUpdate(); // Actualiza el modal
    miModal.show();
    console.log("Mensaje recibido del servidor:", event.data);
    console.log(res);

    // Agrega un retraso si es necesario
    // setTimeout(miModal.show, 100);
  };

  const cancel = document.getElementById("cancel");
  cancel.addEventListener("click", function () {
    window.location.href = "../index.html";
  });
});
