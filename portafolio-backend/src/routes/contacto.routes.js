const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit'); // Importamos el limitador de consultas

const { 
    recibirConsulta, 
    obtenerConsultas, 
    responderConsulta,
    obtenerConsultaPorId
} = require('../controllers/contacto.controller');

// --- CONFIGURACIÓN DEL LIMITADOR (Comentado para pruebas) ---

const limiteConsultas = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 35, // 35 consultas por hora
    message: { 
        exito: false, 
        mensaje: 'Solo podés enviar 35 mensajes de contacto por hora. Intentá más tarde.' 
    }
});


// GET: /api/contacto 
// Para que el admin vea las consultas en el panel (NUNCA lleva limitador)
router.get('/', obtenerConsultas);
    
// GET: /api/contacto/:id
// Para que el admin vea una consulta específica
router.get('/:id', obtenerConsultaPorId);

// POST: /api/contacto 
// Formulario público. Con el limitador de consultas para evitar spam
router.post('/', limiteConsultas, recibirConsulta);

// POST: /api/contacto/responder 
// Para que vos respondas (NUNCA lleva limitador porque vas a estar logueado)
router.post('/responder', responderConsulta);

module.exports = router;