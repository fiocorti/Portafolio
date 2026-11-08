const express = require('express');
const router = express.Router();

const { obtenerTecnologias, eliminarTecnologia } = require('../controllers/tecnologias.controller');
    
// GET: /api/tecnologias
router.get('/', obtenerTecnologias);

// DELETE: /api/tecnologias/:id
router.delete('/:id', eliminarTecnologia);

module.exports = router;