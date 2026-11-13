const express = require('express');
const router = express.Router();
// const { verificarUsuario } = require('../middlewares/auth.middleware'); // A descomentar cuando el login esté listo

const { obtenerEstadisticasDashboard } = require('../controllers/dashboard.controller');

// GET: /api/dashboard/resumen
// Por ahora está libre para que el front pueda ir maquetando los gráficos.
router.get('/resumen', obtenerEstadisticasDashboard);

// Cuando salgan a producción, comentás la línea de arriba y descomentás esta:
// router.get('/resumen', verificarUsuario, obtenerEstadisticasDashboard);

module.exports = router;