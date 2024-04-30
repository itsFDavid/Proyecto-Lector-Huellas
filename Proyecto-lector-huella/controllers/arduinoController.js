const { arduinoPort } = require('../utils/arduinoConnection');
const { dataTMP }= require('../utils/dataTMP');
const {eliminar, obtener, obtenerPorId, obtenerUltimoId} = require('../models/modelBD');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { use } = require('../routes/arduinoRouter');


const getIdFingers= async (req, res)=>{
    console.log('Comando enviado al Arduino: getHuellasId');
    const data = { command: 'getHuellasId' };
    const jsonData = JSON.stringify(data);
    arduinoPort.write(jsonData);
    res.json({ response: 'ok', message: `Enviado correctamente.` });

}

const signUp = async (req, res) => {
    const file = req.file;
    console.log('Archivo:', file);
    const data = req.body;
    console.log('Datos enviados:', data);

    console.log('Datos enviados:', data);
    const id_huella = data.id_huella;
    
    console.log('ID del usuario:', id_huella);

    const {nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento, carrera, correoInstitucional, command} = data;
    
    console.log('Datos del usuario:', nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento, carrera, correoInstitucional, command);

    const userDuplicate = await obtenerPorId(id_huella);
    const huella_id_Duplicate = userDuplicate && userDuplicate.id_huella;


    if (!data) {
        res.status(400).json({ response: 'error', message: 'Los campos son requeridos, has enviado datos vacios' });
    }else if (nombre == '' || apellidoPaterno == '' || apellidoMaterno == '' || fechaNacimiento == '' || carrera == '' || correoInstitucional == '' || command == '' || id_huella == '' || id_huella == undefined || id_huella == null || id_huella < 0 || nombre == undefined || apellidoPaterno == undefined || apellidoMaterno == undefined || fechaNacimiento == undefined || carrera == undefined || correoInstitucional == undefined || command == undefined) {
        res.status(400).json({ response: 'error', message: 'Los campos del usuario son requeridos' });
    }else if(huella_id_Duplicate==id_huella){
        res.status(400).json({ response: 'error', message: 'El id ya existe'});
    }else {
        const userDataTmp = new dataTMP();
        const imageName = file.fieldname + '-' + id_huella + '-' + correoInstitucional + `.${file.originalname.split('.').pop()}`;
        console.log('foto nombre:', imageName);

        userDataTmp.addData({id_huella: id_huella, nombre: nombre, apellidoPaterno: apellidoPaterno, 
                apellidoMaterno: apellidoMaterno, fechaNacimiento: fechaNacimiento, 
                carrera: carrera, correoInstitucional: correoInstitucional, fotoUser: imageName});

        const jsonData = JSON.stringify({command: command, huella_id: id_huella});
        arduinoPort.write(jsonData);
        console.log('Comando enviado al Arduino:', jsonData);
        res.json({ response: 'ok', message: `Enviado correctamente.` });
    }
    
};



const deleteFinger = async (req, res) => {
    const {id} = req.params;
    console.log('id enviado a eliminar al Arduino:', id);
    if (!id || id == null || id == undefined || id == '' || id < 0) {
        res.status(400).json({ response: 'error', message: 'Los campos enviados no son validos' });
    } else {
        const jsonData = JSON.stringify({ command: 'deleteFinger', huella_id: id });
        const dataImage = await obtenerPorId(id);
        console.log('Datos del usuario:', dataImage);
        const imageName = dataImage.fotoUser;
        const response = await eliminar(id);
        console.log('Datos eliminados en la bd:', response);



        
        // Lee el contenido del directorio
        const pathImage = path.join(__dirname, '../public/uploads', imageName);
        fs.unlinkSync(pathImage);

        
        arduinoPort.write(jsonData);
        res.json({ response: 'ok', message: `Enviado correctamente.` });
    }
}
const logIn = (req, res) => {
    const data= {"command": "verifyFinger"};
    console.log('Comando enviado al Arduino:', data);
    if (!data || data == null) {
        res.status(400).json({ response: 'error', message: 'Los campos son requerido' });
    } else {
        const jsonData = JSON.stringify(data);
        arduinoPort.write(jsonData);
        res.json({ response: 'ok', message: `Enviado correctamente.` });
    }
};



const getAllData = async (req, res) => {
    const response = await obtener();
    console.log('Datos de la base de datos:', response);
    res.json(response);
};


const getDataUser = async (req, res) => {
    const { id } = req.params;
    console.log('ID del usuario:', id);

    const userData = await obtenerPorId(id);
    console.log('Datos del usuario:', userData);
    


    if (!userData) {
        res.status(404).json({ response: 'error', message: 'No se encontraron datos' });
    } else {
        res.json(userData);
    }
}

const uploadImage = (req, res) => {
    try {
        console.log('Imagen recibida:', req.file);
        console.log('Datos de la imagen:', JSON.parse(req.file));
        const {image } = req.body;
        const data = JSON.parse(image);

        const imageName = data.fieldname + '-' + Date.now() + `.${data.originalname.split('.').pop()}`;
        console.log('foto nombre:', imageName);

        res.status(200).json({ 
            success: true, 
            data: { imageName: imageName }, 
            message: 'La imagen se ha subido correctamente.' 
        });
    } catch (error) {
        console.error('Error al cargar la imagen:', error);
        res.status(500).json({ success: false, message: 'Error al cargar la imagen.' });
    }
};

module.exports = {
    uploadImage: uploadImage
};

const getImages = async (req, res) => {
    console.log('Imagen solicitada:', req.params.image);
    const imageName = req.params.image;
    res.sendFile(path.join(__dirname, `../public/uploads/${imageName}`));
}
module.exports = {
    getIdFingers,
    signUp,
    deleteFinger,
    logIn,
    getAllData,
    getDataUser,
    uploadImage,
    getImages
};

