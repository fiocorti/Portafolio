const express = require('express');

const {
    validarConfiguracion,
    autenticar,
    soloAdministrador
} = require('../middlewares/autenticacion');

const {
    registrarVisita,
    obtenerEstadisticas
} = require('../controllers/visitas.controller');

function autenticarSiHayCredenciales(req, res, next) {
    const tieneCookie = (req.get('cookie') || '')
        .split(';')
        .some(cookie =>
            cookie.trim().startsWith('portafolio_sesion=')
        );

    if (req.get('authorization') == null && !tieneCookie) {
        req.auth = null;
        return next();
    }

    // Una credencial inválida devuelve 401.
    // No se convierte en una visita anónima.
    return validarConfiguracion(req, res, error => {
        if (error) return next(error);

        return autenticar(req, res, next);
    });
}

const visitas = express.Router();

visitas.post(
    '/',
    autenticarSiHayCredenciales,
    registrarVisita
);

const estadisticas = express.Router();

estadisticas.get(
    '/',
    validarConfiguracion,
    autenticar,
    soloAdministrador,
    obtenerEstadisticas
);

module.exports = {
    visitas,
    estadisticas
};