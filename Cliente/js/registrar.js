document.addEventListener("DOMContentLoaded", function () {
  let ws;
  const conectado = localStorage.getItem("conectado");
  const form = document.getElementById("form");
  const miModal = new bootstrap.Modal(document.getElementById("exampleModal"));
  const modalLabel = document.getElementById("exampleModalLabel");
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
          command: "signUp",
          name: name,
          age: edad,
          carrer: carrera,
          photo: img,
          footPrint: "",
        };
        ws.send(JSON.stringify(data));
        console.log(JSON.stringify(data));
        console.log(data)
      };
      reader.readAsDataURL(filePhoto.files[0]);
    }
  });

  ws.onmessage = function (event) {
    console.log("Mensaje recibido del servidor:", event.data);
    if (event.data === "readingFootPrint") {
      modalLabel.textContent = "Coloque su dedo en el lector";
      miModal.show();
      btnOkey.addEventListener("click", function () {
        console.log("Registrar");
      });
    } else {
      modalLabel.textContent = "Datos registrados exitosamente";
      miModal.show();
    }
  };

  const cancel = document.getElementById("cancel");
  cancel.addEventListener("click", function () {
    window.location.href = "../index.html";
  });
});
