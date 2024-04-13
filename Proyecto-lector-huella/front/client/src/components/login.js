import React, { useState } from 'react';
import { imageFileResizer } from 'react-image-file-resizer'; // Importar la función de redimensionamiento
function Login() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    fechaNacimiento: '',
    carrera: '',
    correoInstitucional: '',
    fotoUser: '' // Inicialmente vacío
  });

  const handleChange = async (e) => {
    const { name, type } = e.target;
    
    if (type === 'file') {
      const file = e.target.files[0];
      
      try {
        // Redimensionar la imagen antes de guardarla
        const resizedImage = await resizeImage(file);
        setFormData(prevData => ({
          ...prevData,
          [name]: resizedImage // Guardar la imagen redimensionada
        }));
      } catch (error) {
        console.error('Error al redimensionar la imagen:', error);
      }
    } else {
      const { value } = e.target;
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const resizeImage = (file) => {
    return new Promise((resolve, reject) => {
      // Configurar opciones de redimensionamiento
      const options = {
        maxSizeMB: 0.5, // Tamaño máximo en megabytes
        maxWidthOrHeight: 800, // Ancho o altura máximo
        useWebWorker: true // Usar un worker para un rendimiento óptimo
      };
      
      imageFileResizer(file, options, (resizedFile) => {
        resolve(resizedFile); // Devolver la imagen redimensionada
      }, 'blob');
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes realizar acciones como validar los datos y enviar una solicitud al servidor
    console.log('Datos del formulario:', formData);
  };



  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Iniciar sesión</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre" className="block w-full border border-gray-300 rounded-md px-3 py-2" />
        <input type="text" name="apellidoPaterno" value={formData.apellidoPaterno} onChange={handleChange} placeholder="Apellido Paterno" className="block w-full border border-gray-300 rounded-md px-3 py-2" />
        <input type="text" name="apellidoMaterno" value={formData.apellidoMaterno} onChange={handleChange} placeholder="Apellido Materno" className="block w-full border border-gray-300 rounded-md px-3 py-2" />
        <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} placeholder="Fecha de Nacimiento" className="block w-full border border-gray-300 rounded-md px-3 py-2" />
        <input type="text" name="carrera" value={formData.carrera} onChange={handleChange} placeholder="Carrera" className="block w-full border border-gray-300 rounded-md px-3 py-2" />
        <input type="email" name="correoInstitucional" value={formData.correoInstitucional} onChange={handleChange} placeholder="Correo Institucional" className="block w-full border border-gray-300 rounded-md px-3 py-2" />
        <input type="file" name="fotoUser" onChange={handleChange} className="block w-full border border-gray-300 rounded-md px-3 py-2" />

        {formData.fotoUser && (
          <img src={formData.fotoUser} alt="Foto del usuario" className="mt-2 max-w-xs" />
        )}
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">Enviar</button>
      </form>
    </div>
  );
}

export default Login;

