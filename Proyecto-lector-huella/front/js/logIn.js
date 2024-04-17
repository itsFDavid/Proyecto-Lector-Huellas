// Conexión al servidor de WebSocket
const ws = new WebSocket('ws://localhost:4321');

function actualizarInterfazUsuario(userData) {
  // Mostrar los datos del usuario en algún lugar de la página web
  document.getElementById("nombreUsuario").innerText = userData.nombre;
  document.getElementById("fechaNacimientoUsuario").innerText = userData.fechaNacimiento;
  document.getElementById("carreraUsuario").innerText = userData.carrera;
  
  const fotoUserBuffer = userData.fotoUser.data;
  console.log('Foto del usuario en Buffer:', fotoUserBuffer);

  // Convertir el ArrayBuffer en una cadena base64
  const base64Image = arrayBufferToBase64(fotoUserBuffer);
  console.log('Foto del usuario en base64:', base64Image);
  // Construir la URL de la imagen
  const imageUrl = `data:image/jpeg;base64,${base64Image}`;
  console.log('URL de la imagen:', imageUrl);

  // Mostrar la imagen del usuario
  const img = document.createElement("img");
  img.src = imageUrl;
  img.alt = "Foto de perfil";
  document.getElementById("fotoUsuario").appendChild(img);

  // Mostrar un mensaje de éxito
  document.getElementById("mensaje").innerText = "¡Datos del usuario encontrados!";
}

function arrayBufferToBase64(buffer) {
  const binary = new Uint8Array(buffer);
  const bytes = [];
  binary.forEach((byte) => {
    bytes.push(String.fromCharCode(byte));
  });
  return btoa(bytes.join(''));
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
