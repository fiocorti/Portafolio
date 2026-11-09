const express = require('express');
const {
    validarConfiguracion,
    iniciarSesion,
    sesionActual,
    cerrarSesion
} = require('../controllers/auth.controller');

const router = express.Router();

router.use((_req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
});

router.post('/login', validarConfiguracion, iniciarSesion);
router.get('/me', validarConfiguracion, sesionActual);
router.post('/logout', cerrarSesion);

module.exports = router;
