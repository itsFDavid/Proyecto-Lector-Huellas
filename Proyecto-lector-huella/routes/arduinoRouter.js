// routes/arduinoRouter.js

const express = require('express');
const arduinoController = require('../controllers/arduinoController');

const router = express.Router();

// Ruta para enviar datos al Arduino
router.post('/register', arduinoController.signUp);

// Ruta para obtener datos del Arduino
router.get('/getFingers', arduinoController.getIdFingers);

router.delete('/deleteFinger/:id', arduinoController.deleteFinger);

router.get('/getAllData', arduinoController.getAllData);

router.get('/verifyFinger', arduinoController.logIn);

router.get('/getDataUser/:id', arduinoController.getDataUser);

module.exports = router;
