const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const claveJwt = process.env.JWT_SECRET;
const duracionSesion = 8 * 60 * 60;
const nombreCookie = 'portafolio_sesion';
const opcionesCookie = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api'
};
const contextoJwt = {
    issuer: 'portafolio-backend',
    audience: 'portafolio'
};
const formatoBcrypt = /^\$2[aby]\$(0[4-9]|[12]\d|3[01])\$[./A-Za-z0-9]{53}$/;

const consultasPorRol = {
    administrador: 'SELECT id_admin AS id, nombre, apellido, email FROM administrador WHERE id_admin = ?',
    usuario: "SELECT id_usuario AS id, nombre, apellido, email FROM usuarios WHERE id_usuario = ? AND metodo_auth = 'Local' AND fecha_baja IS NULL"
};

function validarConfiguracion(_req, res, next) {
    if (!claveJwt || Buffer.byteLength(claveJwt) < 32) {
        return res.status(503).json({ exito: false, error: 'El inicio de sesión no está configurado' });
    }
    next();
}

function datosCuenta({ id, nombre, apellido, email, rol }) {
    const campoId = rol === 'administrador' ? 'id_admin' : 'id_usuario';
    return { id, [campoId]: id, nombre, apellido, email, rol };
}

async function iniciarSesion(req, res) {
    const { email, contrasena } = req.body ?? {};
    const correo = typeof email === 'string' ? email.trim() : '';

    if (!/^[^\s@]+@[^\s@]+$/.test(correo) || correo.length > 100 ||
        typeof contrasena !== 'string' || !contrasena || Buffer.byteLength(contrasena) > 72) {
        return res.status(400).json({ exito: false, error: 'Ingresá un correo y una contraseña válidos' });
    }

    try {
        const [cuentas] = await pool.execute(`
            SELECT id_admin AS id, nombre, apellido, email, contrasena, 'administrador' AS rol
            FROM administrador WHERE email = ?
            UNION ALL
            SELECT id_usuario, nombre, apellido, email, contrasena, 'usuario'
            FROM usuarios WHERE email = ? AND metodo_auth = 'Local' AND fecha_baja IS NULL
            ORDER BY rol
        `, [correo, correo]);

        for (const cuenta of cuentas) {
            if (!formatoBcrypt.test(cuenta.contrasena) || !(await bcrypt.compare(contrasena, cuenta.contrasena))) {
                continue;
            }

            const usuario = datosCuenta(cuenta);
            const token = jwt.sign({ rol: usuario.rol }, claveJwt, {
                ...contextoJwt,
                subject: String(usuario.id),
                expiresIn: duracionSesion,
                algorithm: 'HS256'
            });

            res.cookie(nombreCookie, token, { ...opcionesCookie, maxAge: duracionSesion * 1000 });
            return res.json({ exito: true, token, usuario });
        }

        return res.status(401).json({ exito: false, error: 'Correo o contraseña incorrectos' });
    } catch (error) {
        console.error('Error al iniciar sesión:', error.code || error.name);
        return res.status(500).json({ exito: false, error: 'No se pudo iniciar sesión' });
    }
}

function obtenerToken(req) {
    const autorizacion = req.get('authorization');
    if (autorizacion) {
        return autorizacion.match(/^Bearer (\S+)$/i)?.[1];
    }

    const prefijo = nombreCookie + '=';
    return req.get('cookie')?.split(';')
        .map(cookie => cookie.trim())
        .find(cookie => cookie.startsWith(prefijo))
        ?.slice(prefijo.length);
}

function sesionInvalida(res) {
    return res.status(401).json({ exito: false, error: 'La sesión no es válida o venció' });
}

async function sesionActual(req, res) {
    const token = obtenerToken(req);
    if (!token) {
        return sesionInvalida(res);
    }

    let sesion;
    try {
        sesion = jwt.verify(token, claveJwt, { ...contextoJwt, algorithms: ['HS256'] });
    } catch {
        return sesionInvalida(res);
    }

    const id = Number(sesion.sub);
    if (!Number.isSafeInteger(id) || id < 1 || !Object.hasOwn(consultasPorRol, sesion.rol)) {
        return sesionInvalida(res);
    }

    try {
        const [[cuenta]] = await pool.execute(consultasPorRol[sesion.rol], [id]);
        if (!cuenta) {
            return sesionInvalida(res);
        }

        return res.json({ exito: true, user: datosCuenta({ ...cuenta, rol: sesion.rol }) });
    } catch (error) {
        console.error('Error al verificar la sesión:', error.code || error.name);
        return res.status(500).json({ exito: false, error: 'No se pudo verificar la sesión' });
    }
}

function cerrarSesion(_req, res) {
    res.clearCookie(nombreCookie, opcionesCookie);
    return res.json({ exito: true });
}

module.exports = { validarConfiguracion, iniciarSesion, sesionActual, cerrarSesion };
