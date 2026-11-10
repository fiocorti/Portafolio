const express = require('express');
const router = express.Router();
// const rateLimit = require('express-rate-limit'); // Lo comentamos por ahora

const { 
    recibirConsulta, 
    obtenerConsultas, 
    responderConsulta 
} = require('../controllers/contacto.controller');

// --- CONFIGURACIÓN DEL LIMITADOR (Comentado para pruebas) ---
/*
const limiteConsultas = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 5, // 5 consultas por hora
    message: { 
        exito: false, 
        mensaje: 'Solo podés enviar 5 mensajes de contacto por hora. Intentá más tarde.' 
    }
});
*/

// GET: /api/contacto 
// Para que el admin vea las consultas en el panel (NUNCA lleva limitador)
router.get('/', obtenerConsultas);

// POST: /api/contacto 
// Formulario público. Por ahora está LIBRE para pruebas.
router.post('/', recibirConsulta);

// Cuando salgan a producción, comentás la línea de arriba y descomentás esta:
// router.post('/', limiteConsultas, recibirConsulta);

// POST: /api/contacto/responder 
// Para que vos respondas (NUNCA lleva limitador porque vas a estar logueado)
router.post('/responder', responderConsulta);

module.exports = router;