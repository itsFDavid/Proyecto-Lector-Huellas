import React, { useState, useEffect } from 'react';
import Login from './components/login';
import Modal from './components/modal';
import './index.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:4321');

    ws.onmessage = (event) => {
      const eventData = JSON.parse(event.data);
      console.log('Datos recibidos del servidor:', eventData);
      console.log('Datos recibidos del servidor:', eventData.response);
      console.log('Datos recibidos del servidor:', eventData.message);
    
      // Verificar si eventData está definido y tiene la propiedad response
      if (eventData && eventData.response === 'success') {
        setCurrentMessage(eventData.message);
        setShowModal(true);
      } else if (eventData && eventData.response === 'message') {
        setMessages(prevMessages => [...prevMessages, eventData]);
      }
      setTimeout(() => {
        setMessages(prevMessages => prevMessages.filter(msg => msg !== eventData));
      }, 2000);
    };
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold my-4">Mensajes del Servidor</h1>
      <div className="grid gap-4">
        {messages.map((msg, index) => (
          <div key={index} className={`p-4 rounded-md ${msg.event === 'found' ? 'bg-blue-200' : msg.event === 'numFootprints' ? 'bg-green-200' : 'bg-red-200'}`}>
            <p className={`${msg.event === 'found' ? 'text-blue-900' : msg.event === 'numFootprints' ? 'text-green-900' : 'text-red-900'}`}>{msg.data ? msg.data.message : msg.message}</p>
          </div>
        ))}
      </div>
      <Login />
      {showModal && <Modal message={currentMessage} onClose={handleCloseModal} />}
    </div>
  );
}

export default App;
