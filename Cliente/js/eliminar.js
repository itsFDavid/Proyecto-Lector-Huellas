function eliminarDatos() {
    // Aquí puedes agregar la lógica para enviar una solicitud al servidor y eliminar los datos del usuario con el ID especificado
    // Por ahora, solo mostraremos un mensaje en la consola
    const idUsuario = document.getElementById('id').value;
    console.log('Eliminando datos del usuario con ID:', idUsuario);
  }

  // Función para mostrar los datos del usuario a eliminar en el modal
  function mostrarDatosUsuarioEliminar() {
    const idUsuario = document.getElementById('id').value;
    const datosUsuarioEliminar = document.getElementById('datosUsuarioEliminar');
    // Aquí puedes agregar la lógica para obtener los datos del usuario con el ID especificado y mostrarlos en el modal
    // Por ahora, solo mostraremos un mensaje en el modal
    datosUsuarioEliminar.innerHTML = `<p>Id: ${idUsuario}</p>
                                      <p>Nombre: [Nombre del usuario]</p>
                                      <p>Edad: [Edad del usuario]</p>
                                      <p>Carrera: [Carrera del usuario]</p>
                                      <p>Foto: [Foto del usuario]</p>
                                      <p>Huella: [Huella del usuario]</p>`;
  }

  // Evento que se dispara al abrir el modal de confirmación
  $('#confirmarEliminarModal').on('show.bs.modal', function (e) {
    mostrarDatosUsuarioEliminar();
  });