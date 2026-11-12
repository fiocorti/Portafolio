const express = require('express');
const router = express.Router();

const { 
    obtenerTecnologias, 
    obtenerTecnologiasEnUso,
    crearTecnologia,
    editarTecnologia,
    eliminarTecnologia 
} = require('../controllers/tecnologias.controller');

// GET: /api/tecnologias
router.get('/', obtenerTecnologias);
router.get('/en-uso', obtenerTecnologiasEnUso);

// POST: /api/tecnologias
router.post('/', crearTecnologia);

// PUT: /api/tecnologias/:id
router.put('/:id', editarTecnologia);

// DELETE: /api/tecnologias/:id
router.delete('/:id', eliminarTecnologia);

module.exports = router;