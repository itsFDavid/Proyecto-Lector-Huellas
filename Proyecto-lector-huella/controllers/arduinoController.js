const { arduinoPort } = require('../utils/arduinoConnection');
const allData = require('../utils/data');




const getIdFingers= (req, res)=>{
    console.log('Comando enviado al Arduino: getHuellasId');
    const data = { command: 'getHuellasId' };
    const jsonData = JSON.stringify(data);
    arduinoPort.write(jsonData);
    res.json({ response: 'ok', message: `Enviado correctamente.` });

}

const signUp = (req, res) => {
    const data = req.body;

    if (!data || data == null || data == undefined || data == '') {
        res.status(400).json({ response: 'error', message: 'Los campos son requeridos' });
    } else {
        const jsonData = JSON.stringify(data);
        arduinoPort.write(jsonData);
        console.log('Comando enviado al Arduino:', jsonData);
        res.json({ response: 'ok', message: `Enviado correctamente.` });
    }
};

module.exports = {
    signUp
};

const deleteFinger = (req, res) => {
    const data = req.body;
    console.log('Comando enviado al Arduino:', data);
    if (!data || data == null) {
        res.status(400).json({ response: 'error', message: 'Los campos son requerido' });
    } else {
        const jsonData = JSON.stringify(data);
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

