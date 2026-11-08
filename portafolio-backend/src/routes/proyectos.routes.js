const express = require('express');
const router = express.Router();
// Importamos las funciones
const { 
    obtenerProyectos, 
    crearProyecto, 
    eliminarProyecto, 
    actualizarProyecto } = require('../controllers/proyectos.controller');

// Rutas base
router.get('/', obtenerProyectos);
router.post('/', crearProyecto);

// Rutas con ID específico
router.delete('/:id', eliminarProyecto);
router.put('/:id', actualizarProyecto);

module.exports = router;