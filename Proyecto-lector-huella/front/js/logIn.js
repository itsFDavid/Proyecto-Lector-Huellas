document.addEventListener('DOMContentLoaded', async function() {
  const url= 'http://localhost:4321/api/arduino/verifyFinger'
  const data = await fetch(url);
  const response = await data.json();


  const ws = new WebSocket('ws://localhost:4321');

  async function actualizarInterfazUsuario(userData) {


    const panel= document.getElementById('panelSesion')
    panel.style.display= 'block'
    document.getElementById("nombreUsuario").innerText = userData.nombre+ " " + userData.apellidoPaterno + " " + userData.apellidoMaterno;
    document.getElementById("fechaNacimientoUsuario").innerText = userData.EDAD + " Años";
    document.getElementById("carreraUsuario").innerText = userData.carrera;
    document.getElementById("correoInstitucional").innerText = userData.correoInstitucional;
    const img= document.getElementById('img')
    if(userData.fotoUser){ 
      const urlGetImage = `http://localhost:4321/api/arduino/getImages/${userData.fotoUser}`
      const respuesta= await fetch(urlGetImage)
      const imgBlob= await respuesta.blob();

      const image= URL.createObjectURL(imgBlob)

      img.src= image
      img.style.display= 'block'
    }
  }



  ws.addEventListener('message', function(event) {
    const data = JSON.parse(event.data);
    Swal.fire({
      position: "center",
      icon: "info",
      title: data.message ,
      customClass: {
        popup: 'colored-popup',
        position: 'relative'
      },
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
    if (data.event === 'found') {
      Swal.fire({
        position: "center",
        icon: "info",
        title: "Huella encontrada",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
        const userData = data.data;
        actualizarInterfazUsuario(userData);
    }
  });

  const reset= document.getElementById('reset')

  reset.addEventListener('click', (e)=>{
    e.preventDefault();
    window.location.reload();
  })



});
