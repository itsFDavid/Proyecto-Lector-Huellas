// routes/arduinoRouter.js

const express = require('express');
const arduinoController = require('../controllers/arduinoController');
const multer = require('multer');
const path = require('path');

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = path.join(__dirname, '../public/uploads');
      cb(null, uploadPath)
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + req.body.id_huella + '-' + req.body.correoInstitucional + `.${file.originalname.split('.').pop()}`)
    }
  })
  
const uploadTemp = multer();
const upload = multer({ storage: storage })

// Ruta para enviar datos al Arduino
router.post('/register', upload.single('fotoUser'), arduinoController.signUp);

// Ruta para obtener datos del Arduino
router.get('/getFingers', arduinoController.getIdFingers);

router.delete('/deleteFinger/:id', arduinoController.deleteFinger);

router.get('/getAllData', arduinoController.getAllData);

router.get('/verifyFinger', arduinoController.logIn);

router.get('/getDataUser/:id', arduinoController.getDataUser);

//router.post('/uploadImage', upload.single('image'), arduinoController.uploadImage);

router.get('/getImages/:image', arduinoController.getImages);

module.exports = router;
