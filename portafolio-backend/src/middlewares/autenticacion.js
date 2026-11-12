const jwt = require('jsonwebtoken');
const cuentas = require('../services/cuentas.service');
const {
    ErrorHttp,
    datosPublicos
} = require('../utils/cuentas');

const nombreCookie = 'portafolio_sesion';

const contextoJwt = {
    issuer: 'portafolio-backend',
    audience: 'portafolio'
};

const duracionSesion = 8 * 60 * 60;

function opcionesCookie() {
    return {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/api'
    };
}

function validarConfiguracion(_req, _res, next) {
    const clave = process.env.JWT_SECRET;

    if (!clave || Buffer.byteLength(clave) < 32) {
        return next(new ErrorHttp(
            503,
            'Configurá JWT_SECRET con una clave aleatoria de al menos 32 bytes.'
        ));
    }

    next();
}

function obtenerToken(req) {
    const autorizacion = req.get('authorization');

    if (autorizacion) {
        return autorizacion.match(/^Bearer (\S+)$/i)?.[1];
    }

    const prefijo = nombreCookie + '=';

    return req.get('cookie')
        ?.split(';')
        .map(cookie => cookie.trim())
        .find(cookie => cookie.startsWith(prefijo))
        ?.slice(prefijo.length);
}

function iniciarSesionCuenta(res, cuenta) {
    const token = jwt.sign(
        { rol: cuenta.rol },
        process.env.JWT_SECRET,
        {
            ...contextoJwt,
            subject: String(cuenta.id_db),
            expiresIn: duracionSesion,
            algorithm: 'HS256'
        }
    );

    res.cookie(nombreCookie, token, {
        ...opcionesCookie(),
        maxAge: duracionSesion * 1000
    });

    return {
        exito: true,
        token,
        usuario: datosPublicos(cuenta)
    };
}

async function autenticar(req, _res, next) {
    try {
        const token = obtenerToken(req);
        let sesion;

        try {
            sesion = jwt.verify(
                token || '',
                process.env.JWT_SECRET,
                {
                    ...contextoJwt,
                    algorithms: ['HS256']
                }
            );
        } catch (_) {
            throw new ErrorHttp(
                401,
                'La sesión no es válida o venció.'
            );
        }

        const id = Number(sesion.sub);

        if (
            !/^[1-9]\d*$/.test(String(sesion.sub)) ||
            !Number.isSafeInteger(id) ||
            id > 2147483647 ||
            typeof sesion.exp !== 'number' ||
            !['administrador', 'usuario', 'operador'].includes(sesion.rol)
        ) {
            throw new ErrorHttp(
                401,
                'La sesión no es válida o venció.'
            );
        }

        const tipo = sesion.rol === 'administrador'
            ? 'administrador'
            : 'usuario';

        const cuenta = await cuentas.buscarCuenta(tipo, id);

        if (!cuenta || cuenta.fecha_baja != null) {
            throw new ErrorHttp(
                401,
                'La cuenta no está disponible.'
            );
        }

        req.auth = cuenta;
        next();
    } catch (error) {
        next(error);
    }
}

function soloAdministrador(req, _res, next) {
    if (
        req.auth?.tipo !== 'administrador' ||
        req.auth?.rol !== 'administrador'
    ) {
        return next(new ErrorHttp(
            403,
            'Esta operación requiere permisos de administrador.'
        ));
    }

    next();
}

function borrarSesion(res) {
    res.clearCookie(nombreCookie, opcionesCookie());
}

module.exports = {
    validarConfiguracion,
    autenticar,
    soloAdministrador,
    iniciarSesionCuenta,
    borrarSesion
};