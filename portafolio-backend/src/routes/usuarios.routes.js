const express = require('express');

const {
    listarUsuarios,
    obtenerUsuario,
    editarUsuario
} = require('../controllers/usuarios.controller');

const {
    validarConfiguracion,
    autenticar,
    soloAdministrador
} = require('../middlewares/autenticacion');

const router = express.Router();

router.use(
    validarConfiguracion,
    autenticar,
    soloAdministrador
);

router.get('/', listarUsuarios);
router.get('/:id', obtenerUsuario);
router.put('/:id', editarUsuario);

module.exports = router;