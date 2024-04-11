const { arduinoPort } = require('../utils/arduinoConnection');
const allData = require('../utils/data');
const { dataTMP }= require('../utils/dataTMP');




const getIdFingers= (req, res)=>{
    console.log('Comando enviado al Arduino: getHuellasId');
    const data = { command: 'getHuellasId' };
    const jsonData = JSON.stringify(data);
    arduinoPort.write(jsonData);
    res.json({ response: 'ok', message: `Enviado correctamente.` });

}

const signUp = async (req, res) => {
    const data = req.body;
    const urlGetData= `http://localhost:4321/api/arduino/getDataUser/${data.huellas_id}`;

    const response = await fetch(urlGetData);
    const dataUser = await response.json();
    console.log('Datos del usuario:', dataUser);

    console.log('Datos del usuario:', data.huellas_id);
    console.log('ID del usuario:', dataUser.response);
    if (!data || data == null || data == undefined || data == '') {
        res.status(400).json({ response: 'error', message: 'Los campos son requeridos' });
    } else if(data.id<0){
        res.status(400).json({ response: 'error', message: 'El id no puede ser menor a 0' });
    }else if(dataUser.response=='ok'){
        res.status(400).json({ response: 'error', message: 'El id ya existe'});
    }else {
        const { nombre, edad, carrera, huella_id, fotoUser, command } = data;
        const userDataTmp = new dataTMP();
        userDataTmp.addData({nombre: nombre, edad: edad, carrera: carrera, huella_id: huella_id, fotoUser: fotoUser});

        const jsonData = JSON.stringify({command: command, huella_id: huella_id});
        arduinoPort.write(jsonData);
        console.log('Comando enviado al Arduino:', jsonData);
        res.json({ response: 'ok', message: `Enviado correctamente.` });
    }
};



const deleteFinger = (req, res) => {
    const {id} = req.params;
    console.log('id enviado a eliminar al Arduino:', id);
    if (!id || id == null) {
        res.status(400).json({ response: 'error', message: 'Los campos son requerido' });
    } else {
        const jsonData = JSON.stringify({ command: 'deleteFinger', huella_id: id });
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


const getAllData = (req, res) => {
    res.json(allData);
};


const getDataUser = async (req, res) => {
    const { id } = req.params;
    const data = await fetch("http://localhost:4321/api/arduino/getAllData");
    const allUsers = await data.json();

    const userData = await allUsers.allData.users.find((user) => user.huella_id == id);

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

