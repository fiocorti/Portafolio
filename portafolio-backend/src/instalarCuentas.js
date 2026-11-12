const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const usuariosRoutes = require('./routes/usuarios.routes');

const {
    ErrorHttp,
    manejarError
} = require('./utils/cuentas');

module.exports = function instalarCuentas(app) {
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

        scope.use(express.json({ limit: '4kb' }));
        scope.use(router);
        scope.use(manejarError);

        return scope;
    }

    app.use('/api/auth', configurar(authRoutes));

    app.use(
        '/api/admin/usuarios',
        configurar(usuariosRoutes)
    );
};