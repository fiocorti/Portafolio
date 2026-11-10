class ErrorHttp extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

function validarObjeto(body, permitidos) {
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        throw new ErrorHttp(
            400,
            'Enviá un objeto JSON con los datos de la cuenta.'
        );
    }

    const extra = Object.keys(body).filter(
        campo => !permitidos.includes(campo)
    );

    if (extra.length) {
        throw new ErrorHttp(
            400,
            'La solicitud contiene campos no permitidos.'
        );
    }
}

function validarNombre(valor) {
    if (
        typeof valor !== 'string' ||
        !valor.trim() ||
        [...valor.trim()].length > 50 ||
        /[\u0000-\u001f\u007f]/u.test(valor)
    ) {
        throw new ErrorHttp(
            400,
            'El nombre es obligatorio y admite hasta 50 caracteres.'
        );
    }

    return valor.trim();
}

function validarApellido(valor) {
    if (valor == null || valor === '') return null;

    if (
        typeof valor !== 'string' ||
        [...valor.trim()].length > 50 ||
        /[\u0000-\u001f\u007f]/u.test(valor)
    ) {
        throw new ErrorHttp(
            400,
            'El apellido admite hasta 50 caracteres.'
        );
    }

    return valor.trim() || null;
}

function validarEmail(valor) {
    const email = typeof valor === 'string'
        ? valor.trim().toLowerCase()
        : '';

    if (
        email.length > 100 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(email)
    ) {
        throw new ErrorHttp(
            400,
            'Ingresá un correo electrónico válido de hasta 100 caracteres.'
        );
    }

    return email;
}

function leerId(valor) {
    // Distingue administrador.id_admin = 1 de usuarios.id_usuario = 1.
    // Un ID numérico sin prefijo identifica un registro de usuarios.
    const match = /^(?:(admin|usuario)-)?([1-9]\d{0,9})$/.exec(
        String(valor)
    );

    const id = match ? Number(match[2]) : NaN;

    if (!Number.isSafeInteger(id) || id > 2147483647) {
        throw new ErrorHttp(
            400,
            'El identificador de la cuenta no es válido.'
        );
    }

    return {
        tipo: match[1] === 'admin' ? 'administrador' : 'usuario',
        id
    };
}

function datosPublicos(cuenta) {
    const admin = cuenta.tipo === 'administrador';

    return {
        id: `${admin ? 'admin' : 'usuario'}-${cuenta.id_db}`,
        [admin ? 'id_admin' : 'id_usuario']: cuenta.id_db,
        nombre: cuenta.nombre,
        apellido: cuenta.apellido ?? null,
        email: cuenta.email,
        rol: admin ? 'administrador' : cuenta.rol,
        estado: cuenta.fecha_baja == null ? 'Activo' : 'Inactivo',
        fechaRegistro: cuenta.fechaRegistro ?? null
    };
}

function manejarError(error, _req, res, next) {
    if (res.headersSent) return next(error);

    let status = error.status || 500;
    let message = error.message;

    if (error.code === 'ER_DUP_ENTRY') {
        status = 409;
        message = 'Ese correo electrónico ya está registrado.';
    } else if (
        ['ER_LOCK_DEADLOCK', 'ER_LOCK_WAIT_TIMEOUT'].includes(error.code)
    ) {
        status = 409;
        message = 'La cuenta se modificó en otra operación. Intentá nuevamente.';
    } else if (error.code === 'ER_BAD_FIELD_ERROR') {
        status = 503;
        message = 'La base conectada no tiene los campos esperados. Revisá usuarios.rol.';
    } else if (error.type === 'entity.parse.failed') {
        status = 400;
        message = 'El cuerpo de la solicitud no contiene JSON válido.';
    } else if (status === 413) {
        message = 'La solicitud supera el tamaño permitido de 4 KB.';
    } else if (!(error instanceof ErrorHttp)) {
        status = 500;
        message = 'No se pudo completar la operación.';
    }

    if (status >= 500) {
        console.error(
            'Módulo de cuentas:',
            error.code || error.name
        );
    }

    return res.status(status).json({
        exito: false,
        error: message,
        message
    });
}

module.exports = {
    ErrorHttp,
    validarObjeto,
    validarNombre,
    validarApellido,
    validarEmail,
    leerId,
    datosPublicos,
    manejarError
};