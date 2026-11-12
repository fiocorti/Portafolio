const express = require('express');
const cors = require('cors');

const {
    visitas,
    estadisticas
} = require('./routes/visitas.routes');

const { ErrorHttp } = require('./utils/cuentas');

function manejarError(error, _req, res, next) {
    if (res.headersSent) return next(error);

    let status = 500;
    let message = 'No se pudo completar la operación de visitas y estadísticas.';

    if (error instanceof ErrorHttp) {
        status = error.status;
        message = error.message;
    } else if (error.type === 'entity.parse.failed') {
        status = 400;
        message = 'El cuerpo de la solicitud no contiene JSON válido.';
    } else if (error.status === 413) {
        status = 413;
        message = 'La solicitud supera el tamaño permitido de 4 KB.';
    } else if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        status = 409;
        message = 'El portfolio o el usuario ya no está disponible. Actualizá la sesión e intentá nuevamente.';
    } else if (
        ['ER_NO_SUCH_TABLE', 'ER_BAD_FIELD_ERROR']
            .includes(error.code)
    ) {
        status = 503;
        message = 'La base de datos no tiene las tablas o los campos esperados para visitas y estadísticas.';
    }

    if (status >= 500) {
        console.error(
            'Visitas y estadísticas:',
            error.code || error.name
        );
    }

    return res.status(status).json({
        exito: false,
        error: message,
        message
    });
}

module.exports = function instalarVisitas(app) {
    const origenes = (
        process.env.AUTH_ALLOWED_ORIGINS ||
        'http://localhost:3000,http://localhost:5173'
    )
        .split(',')
        .map(origen => origen.trim())
        .filter(Boolean);

    function configurar(router) {
        const scope = express.Router();

        scope.use((req, res, next) => {
            res.set('Cache-Control', 'no-store');

            const origen = req.get('origin');

            if (origen && !origenes.includes(origen)) {
                return next(new ErrorHttp(
                    403,
                    'El origen de la solicitud no está habilitado.'
                ));
            }

            next();
        });

        scope.use(cors({
            origin: origenes,
            credentials: true
        }));

        scope.use(express.json({
            limit: '4kb'
        }));

        scope.use(router);
        scope.use(manejarError);

        return scope;
    }

    app.use(
        '/api/visitas',
        configurar(visitas)
    );

    app.use(
        '/api/admin/estadisticas',
        configurar(estadisticas)
    );
};