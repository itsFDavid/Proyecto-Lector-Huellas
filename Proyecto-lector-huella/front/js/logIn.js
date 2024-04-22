// Conexión al servidor de WebSocket
const ws = new WebSocket('ws://localhost:4321');

function actualizarInterfazUsuario(userData) {
  // Mostrar los datos del usuario en algún lugar de la página web
  document.getElementById("nombreUsuario").innerText = userData.nombre+ " " + userData.apellidoPaterno + " " + userData.apellidoMaterno;
  document.getElementById("fechaNacimientoUsuario").innerText = userData.fechaNacimiento;
  document.getElementById("carreraUsuario").innerText = userData.carrera;
  

  // Mostrar la imagen del usuari

  // Mostrar un mensaje de éxito
  document.getElementById("mensaje").innerText = "¡Datos del usuario encontrados!";
}

ws.addEventListener('message', function(event) {
  const data = JSON.parse(event.data);
  console.log('Datos recibidos del servidor:', data);
  if (data.event === 'found') {
      // Si el evento es 'found', se procesan los datos del usuario
      const userData = data.data;
      console.log('Datos del usuario para login:', userData);

      // Actualizar el panel de sesión con los datos del usuario
      actualizarInterfazUsuario(userData);
  }
});

const iniciarSesion= document.getElementById('login');
iniciarSesion.addEventListener('click', async function(e) {
  e.preventDefault();
  const url= 'http://localhost:4321/api/arduino/verifyFinger'
  const data = await fetch(url);
  const response = await data.json();
  console.log(response);
});
