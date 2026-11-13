const express = require('express');
const router = express.Router();
const { obtenerExperiencias, crearExperiencia } = require('../controllers/experiencias.controller');

router.get('/', obtenerExperiencias);
router.post('/', crearExperiencia);

module.exports = router;