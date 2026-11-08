const express = require('express');
const router = express.Router();
// Importamos las funciones
const { obtenerServicios, crearServicio } = require('../controllers/servicios.controller');

// GET: Para pedir la lista de servicios
router.get('/', obtenerServicios);

// POST: /api/servicios (para crear uno nuevo)
router.post('/', crearServicio);

module.exports = router;