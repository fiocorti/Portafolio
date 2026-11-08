const express = require('express');
const router = express.Router();
// Importamos las funciones
const { obtenerProyectos, crearProyecto } = require('../controllers/proyectos.controller');

// GET: Para pedir datos (ahora en http://localhost:3001/api/proyectos)
router.get('/', obtenerProyectos);

// POST: Para enviar datos nuevos 
router.post('/', crearProyecto);

module.exports = router;