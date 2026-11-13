const bcrypt = require('bcryptjs');
const cuentas = require('../services/cuentas.service');

const {
    ErrorHttp,
    validarObjeto,
    validarNombre,
    validarApellido,
    validarEmail,
    datosPublicos
} = require('../utils/cuentas');

const {
    iniciarSesionCuenta,
    borrarSesion
} = require('../middlewares/autenticacion');

async function registrarUsuario(req, res, next) {
    try {
        validarObjeto(
            req.body,
            ['nombre', 'apellido', 'email', 'contrasena']
        );

        const nombre = validarNombre(req.body.nombre);
        const apellido = validarApellido(req.body.apellido);
        const email = validarEmail(req.body.email);
        const { contrasena } = req.body;

        if (
            typeof contrasena !== 'string' ||
            [...contrasena].length < 8 ||
            Buffer.byteLength(contrasena, 'utf8') > 72
        ) {
            throw new ErrorHttp(
                400,
                'La contraseña debe tener al menos 8 caracteres y ocupar como máximo 72 bytes UTF-8.'
            );
        }

        const hash = await bcrypt.hash(contrasena, 12);

        const cuenta = await cuentas.crearUsuario({
            nombre,
            apellido,
            email,
            hash
        });

        return res.status(201).json({
            exito: true,
            message: 'Cuenta creada correctamente. Ya podés iniciar sesión.',
            usuario: datosPublicos(cuenta)
        });
    } catch (error) {
        next(error);
    }
}

async function iniciarSesion(req, res, next) {
    try {
        validarObjeto(
            req.body,
            ['email', 'contrasena']
        );

        const email = validarEmail(req.body.email);
        const { contrasena } = req.body;

        if (
            typeof contrasena !== 'string' ||
            !contrasena ||
            Buffer.byteLength(contrasena, 'utf8') > 72
        ) {
            throw new ErrorHttp(
                400,
                'Ingresá un correo y una contraseña válidos.'
            );
        }

        const posibles = await cuentas.buscarParaLogin(email);

        for (const cuenta of posibles) {
            const esHashBcrypt =
                /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(
                    cuenta.contrasena || ''
                );

            if (!esHashBcrypt) continue;

            const coincide = await bcrypt.compare(
                contrasena,
                cuenta.contrasena
            );

            if (coincide) {
                return res.json(
                    iniciarSesionCuenta(res, cuenta)
                );
            }
        }

        throw new ErrorHttp(
            401,
            'Correo o contraseña incorrectos.'
        );
    } catch (error) {
        next(error);
    }
}

function sesionActual(req, res) {
    return res.json({
        exito: true,
        user: datosPublicos(req.auth)
    });
}

function cerrarSesion(_req, res) {
    borrarSesion(res);

    return res.json({
        exito: true,
        message: 'Sesión cerrada.'
    });
}

module.exports = {
    registrarUsuario,
    iniciarSesion,
    sesionActual,
    cerrarSesion
};