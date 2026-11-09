const express = require('express');
const router = express.Router();

const { obtenerTecnologias, 
    obtenerTecnologiasEnUso, 
    crearTecnologia,
    eliminarTecnologia } = require('../controllers/tecnologias.controller');

const upload = require('../middlewares/upload'); // Traemos nuestro middleware de Cloudinary

// GET: /api/tecnologias
router.get('/', obtenerTecnologias);
router.get('/en-uso', obtenerTecnologiasEnUso);

// POST: /api/tecnologias
router.post('/', upload.single('icono'), crearTecnologia);

// DELETE: /api/tecnologias/:id
router.delete('/:id', eliminarTecnologia);

module.exports = router;