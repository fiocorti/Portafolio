const express = require('express');
const router = express.Router();
// Importamos las funciones
const { 
    obtenerServicios, 
    crearServicio ,
    actualizarServicio,
    eliminarServicio
} = require('../controllers/servicios.controller');

// Rutas base
router.get('/', obtenerServicios);
router.post('/', crearServicio);

// Rutas con ID específico
router.put('/:id', actualizarServicio);
router.delete('/:id', eliminarServicio);

module.exports = router;