const express = require('express');
const router = express.Router();
const { recibirConsulta, 
    responderConsulta, 
    obtenerConsultas, 
    obtenerConsultaPorId } = require('../controllers/contacto.controller');

// El visitante manda su mensaje desde el portafolio
router.post('/', recibirConsulta);

// Vos mandás tu respuesta desde el dashboard de administración
router.post('/responder', responderConsulta);

// Ruta GET para listar todas las consultas en la tabla de React
router.get('/', obtenerConsultas);

// Ruta GET para ver el detalle de una consulta y sus mensajes por ID
router.get('/:id', obtenerConsultaPorId);

module.exports = router;