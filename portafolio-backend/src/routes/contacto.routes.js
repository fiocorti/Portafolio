const express = require('express');
const router = express.Router();
const { recibirConsulta, responderConsulta } = require('../controllers/contacto.controller');

// El visitante manda su mensaje desde el portafolio
router.post('/', recibirConsulta);

// Vos mandás tu respuesta desde el dashboard de administración
router.post('/responder', responderConsulta);

module.exports = router;