

document.addEventListener('DOMContentLoaded', async function() {
  const url= 'http://localhost:4321/api/arduino/verifyFinger'
  const data = await fetch(url);
  const response = await data.json();
  console.log(response);


// Conexión al servidor de WebSocket
const ws = new WebSocket('ws://localhost:4321');

async function actualizarInterfazUsuario(userData) {
  // Mostrar los datos del usuario en algún lugar de la página web
  console.log(userData)
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
    console.log(imgBlob)
    const image= URL.createObjectURL(imgBlob)
    console.log(image)
    img.src= image
    img.style.display= 'block'
  }
    


  var miModal = new bootstrap.Modal(document.getElementById("exampleModal"));
  var modalLabel = document.getElementById("exampleModalLabel");
  const btnOkey = document.getElementById("btn-okey");
  // Mostrar un mensaje de éxito
  modalLabel.textContent= 'Datos encontrados';
  miModal.show()
  btnOkey.addEventListener('click', (e)=>{
    e.preventDefault()
    miModal.hide()
  })
}



ws.addEventListener('message', function(event) {
  const data = JSON.parse(event.data);
  console.log('Datos recibidos del servidor:', data);
  const msg= document.getElementById('ul')
  const li= document.createElement('li')
  li.textContent= data.message
  msg.appendChild(li);
  if (data.event === 'found') {
      // Si el evento es 'found', se procesan los datos del usuario
      const userData = data.data;

      // Actualizar el panel de sesión con los datos del usuario
      actualizarInterfazUsuario(userData);
  }
});

  const reset= document.getElementById('reset')

  reset.addEventListener('click', (e)=>{
    e.preventDefault();
    window.location.reload();
  })



});
