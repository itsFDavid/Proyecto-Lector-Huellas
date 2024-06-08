document.addEventListener("DOMContentLoaded", ()=>{
    const conectado = localStorage.getItem("conectado");  
  
  
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
    
  })

  const btnEliminar = document.getElementById('eliminarDatos');
  btnEliminar.addEventListener('click', (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Estas seguro de eliminar la informacion?",
      text: "Una vez eliminada no se podra recuperar la informacion.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, estoy seguro!"
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarDatos();
        Swal.fire({
          title: "Eliminado!",
          text: "La informacion ha sido eliminada correctamente.",
          icon: "success"
        });
      }
    });
  });

  let ws;
  ws = new WebSocket('ws://localhost:4321');
  ws.addEventListener('message', function(event) {
    const data = event.data;
    const dataParse = JSON.parse(data);
    console.log(dataParse);
    if(dataParse.message === 'Huella eliminada') {
      Swal.fire({
        title: "Eliminado!",
        text: "La informacion ha sido eliminada correctamente.",
        icon: "success",
        timer: 2500,
      });
    }else{
      Swal.fire({
        title: "Error!",
        text: "No se pudo eliminar la informacion.",
        icon: "error",
        timer: 2500,
      });
    }
  });

  const regresar= document.getElementById('regresar');
  regresar.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href= "../index.html";
  });


  async function eliminarDatos() {
   
    const idUsuario = document.getElementById('id').value;
    const url= `http://localhost:4321/api/arduino/deleteFinger/${idUsuario}`
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    if(response.status === 200) {
      Swal.fire({
        title: "Eliminado!",
        text: "La informacion ha sido eliminada correctamente.",
        icon: "success",
        timer: 2500,
      });
    }else{
      Swal.fire({
        title: "Error!",
        text: "No se pudo eliminar la informacion.",
        icon: "error",
        timer: 2500,
      });
    }
  }