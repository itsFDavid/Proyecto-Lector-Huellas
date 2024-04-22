const { arduinoPort } = require('../utils/arduinoConnection');
const { dataTMP }= require('../utils/dataTMP');
const {eliminar, obtener, obtenerPorId, obtenerUltimoId} = require('../models/modelBD');




const getIdFingers= async (req, res)=>{
    console.log('Comando enviado al Arduino: getHuellasId');
    const data = { command: 'getHuellasId' };
    const jsonData = JSON.stringify(data);
    arduinoPort.write(jsonData);
    res.json({ response: 'ok', message: `Enviado correctamente.` });

}

const signUp = async (req, res) => {
    const data = req.body;
    console.log('Datos enviados:', data);
    const id_huella = data.id_huella;
    
    console.log('ID del usuario:', id_huella);

    const {nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento, carrera, correoInstitucional, command} = data;
    
    const userDuplicate = await obtenerPorId(id_huella);
    const huella_id_Duplicate = userDuplicate && userDuplicate.id_huella;


    if (!data || data == null || data == undefined || data == '' || data == {}) {
        res.status(400).json({ response: 'error', message: 'Los campos son requeridos, has enviado datos vacios' });
    }else if (nombre == '' || apellidoPaterno == '' || apellidoMaterno == '' || fechaNacimiento == '' || carrera == '' || correoInstitucional == '' || command == '' || id_huella == '' || id_huella == undefined || id_huella == null || id_huella < 0 || nombre == undefined || apellidoPaterno == undefined || apellidoMaterno == undefined || fechaNacimiento == undefined || carrera == undefined || correoInstitucional == undefined || command == undefined) {
        res.status(400).json({ response: 'error', message: 'Los campos del usuario son requeridos' });
    }else if(huella_id_Duplicate==id_huella){
        res.status(400).json({ response: 'error', message: 'El id ya existe'});
    }else {
        const userDataTmp = new dataTMP();


        userDataTmp.addData({id_huella: id_huella, nombre: nombre, apellidoPaterno: apellidoPaterno, 
                apellidoMaterno: apellidoMaterno, fechaNacimiento: fechaNacimiento, 
                carrera: carrera, correoInstitucional: correoInstitucional});

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
        const response = await eliminar(id);
        console.log('Datos eliminados en la bd:', response);
        
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
module.exports = {
    getIdFingers,
    signUp,
    deleteFinger,
    logIn,
    getAllData,
    getDataUser
};

