import React, { useState } from 'react';
import 'tailwindcss/tailwind.css';

function Login() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    fechaNacimiento: '',
    carrera: '',
    correoInstitucional: '',
    fotoUser: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
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
        <input type="file" name="fotoUser" value={formData.fotoUser} onChange={handleChange} placeholder="Foto (URL o Base64)" className="block w-full border border-gray-300 rounded-md px-3 py-2" />
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">Enviar</button>
      </form>
    </div>
  );
}

export default Login;
