const express = require('express');
const router = express.Router();
const { obtenerProyectos } = require('../controllers/proyectos.controller');

// Cuando alguien haga un GET a esta ruta, se ejecuta obtenerProyectos
router.get('/', obtenerProyectos);

module.exports = router;