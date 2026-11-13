const express = require('express');
const router = express.Router();
// Importamos las funciones
const { 
    obtenerProyectos, 
    crearProyecto, 
    eliminarProyecto, 
    actualizarProyecto
} = require('../controllers/proyectos.controller');

const upload = require('../middlewares/upload'); // Traemos nuestro middleware de Cloudinary

// Rutas base
router.get('/', obtenerProyectos);
// El 'imagen' adentro de single() es clave: es el nombre exacto del campo que tiene que mandar React
router.post('/', upload.single('imagen'), crearProyecto);

// Rutas con ID específico
router.delete('/:id', eliminarProyecto);
router.put('/:id', actualizarProyecto);

module.exports = router;