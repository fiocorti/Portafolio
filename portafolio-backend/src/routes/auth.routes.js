const express = require('express');

const {
    registrarUsuario,
    iniciarSesion,
    sesionActual,
    cerrarSesion
} = require('../controllers/auth.controller');

const {
    validarConfiguracion,
    autenticar
} = require('../middlewares/autenticacion');

const router = express.Router();

router.post('/registro', registrarUsuario);

router.post(
    '/login',
    validarConfiguracion,
    iniciarSesion
);

router.get(
    '/me',
    validarConfiguracion,
    autenticar,
    sesionActual
);

router.post('/logout', cerrarSesion);

module.exports = router;