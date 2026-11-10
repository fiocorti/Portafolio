const cuentas = require('../services/cuentas.service');

const {
    ErrorHttp,
    validarObjeto,
    validarNombre,
    validarEmail,
    leerId,
    datosPublicos
} = require('../utils/cuentas');

async function listarUsuarios(_req, res, next) {
    try {
        const usuarios = (
            await cuentas.listarCuentas()
        ).map(datosPublicos);

        return res.json({
            exito: true,
            datos: usuarios
        });
    } catch (error) {
        next(error);
    }
}

async function obtenerUsuario(req, res, next) {
    try {
        const identidad = leerId(req.params.id);

        const cuenta = await cuentas.buscarCuenta(
            identidad.tipo,
            identidad.id
        );

        if (!cuenta) {
            throw new ErrorHttp(
                404,
                'No se encontró la cuenta solicitada.'
            );
        }

        return res.json({
            exito: true,
            item: datosPublicos(cuenta)
        });
    } catch (error) {
        next(error);
    }
}

async function editarUsuario(req, res, next) {
    try {
        const identidad = leerId(req.params.id);

        validarObjeto(
            req.body,
            ['nombre', 'email', 'estado', 'rol']
        );

        const cambios = {
            nombre: validarNombre(req.body.nombre),
            email: validarEmail(req.body.email)
        };

        if (Object.hasOwn(req.body, 'estado')) {
            if (!['Activo', 'Inactivo'].includes(req.body.estado)) {
                throw new ErrorHttp(
                    400,
                    'El estado debe ser Activo o Inactivo.'
                );
            }

            cambios.estado = req.body.estado;
        }

        if (Object.hasOwn(req.body, 'rol')) {
            if (
                !['usuario', 'operador', 'administrador']
                    .includes(req.body.rol)
            ) {
                throw new ErrorHttp(
                    400,
                    'El rol solicitado no es válido.'
                );
            }

            cambios.rol = req.body.rol;
        }

        const cuenta = await cuentas.editarCuenta(
            identidad,
            cambios,
            req.auth
        );

        return res.json({
            exito: true,
            message: 'Usuario actualizado correctamente.',
            item: datosPublicos(cuenta)
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    listarUsuarios,
    obtenerUsuario,
    editarUsuario
};