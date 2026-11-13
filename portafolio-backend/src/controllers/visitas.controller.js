const pool = require('../config/db');
const { ErrorHttp } = require('../utils/cuentas');

const DIA = 24 * 60 * 60 * 1000;
const HORA = 60 * 60 * 1000;
const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

const formatoFecha = new Intl.DateTimeFormat('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    dateStyle: 'short',
    timeStyle: 'short',
    hourCycle: 'h23'
});

function validarVisita(body) {
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        throw new ErrorHttp(
            400,
            'Enviá un objeto JSON con los datos de la visita.'
        );
    }

    const permitidos = ['id_admin', 'seccion_visita'];

    if (Object.keys(body).some(campo => !permitidos.includes(campo))) {
        throw new ErrorHttp(
            400,
            'Solo se permiten id_admin y seccion_visita.'
        );
    }

    const valor = body.id_admin;

    const id = typeof valor === 'number'
        ? valor
        : typeof valor === 'string' && /^[1-9]\d*$/.test(valor)
            ? Number(valor)
            : NaN;

    if (!Number.isSafeInteger(id) || id < 1 || id > 2147483647) {
        throw new ErrorHttp(
            400,
            'id_admin debe identificar un portfolio válido.'
        );
    }

    const seccion = typeof body.seccion_visita === 'string'
        ? body.seccion_visita.trim()
        : '';

    if (
        !seccion ||
        [...seccion].length > 50 ||
        /[\u0000-\u001f\u007f]/u.test(seccion)
    ) {
        throw new ErrorHttp(
            400,
            'seccion_visita es obligatoria y admite hasta 50 caracteres.'
        );
    }

    return { id, seccion };
}

function detectarDispositivo(req) {
    const agente = req.get('user-agent') || '';

    if (/ipad|tablet|kindle|silk|playbook/i.test(agente)) {
        return 'Tablet';
    }

    if (/mobi|android|iphone|ipod/i.test(agente)) {
        return 'Móvil';
    }

    if (/windows|macintosh|x11|linux/i.test(agente)) {
        return 'PC';
    }

    return 'Desconocido';
}

// Los registros nuevos se guardan en UTC.
// Los días del informe corresponden a UTC-3, Argentina.
function ultimosSieteDias() {
    const ahoraArgentina = new Date(Date.now() - 3 * HORA);

    const hoy = Date.parse(
        ahoraArgentina.toISOString().slice(0, 10) + 'T00:00:00Z'
    );

    const fechas = Array.from(
        { length: 7 },
        (_, i) => new Date(hoy - (6 - i) * DIA)
            .toISOString()
            .slice(0, 10)
    );

    const aSql = tiempo => new Date(tiempo)
        .toISOString()
        .slice(0, 19)
        .replace('T', ' ');

    return {
        fechas,
        inicio: aSql(hoy - 6 * DIA + 3 * HORA),
        fin: aSql(hoy + DIA + 3 * HORA)
    };
}

async function registrarVisita(req, res, next) {
    try {
        const { id, seccion } = validarVisita(req.body);

        const [[portfolio]] = await pool.execute(
            'SELECT id_admin FROM administrador WHERE id_admin = ?',
            [id]
        );

        if (!portfolio) {
            throw new ErrorHttp(
                404,
                'El portfolio solicitado no existe.'
            );
        }

        // administrador.id_admin y usuarios.id_usuario son
        // identidades diferentes. No se mezclan sus IDs.
        if (req.auth?.tipo === 'administrador') {
            return res.json({
                exito: true,
                registrado: false,
                mensaje: 'Las visitas de cuentas administradoras no se contabilizan.'
            });
        }

        const dispositivo = detectarDispositivo(req);
        const autenticada = req.auth?.tipo === 'usuario';

        let resultado;

        if (autenticada) {
            [resultado] = await pool.execute(
                `INSERT INTO sesiones
                    (
                        id_usuario,
                        id_admin,
                        fecha_hora_login,
                        dispositivo,
                        seccion_visita
                    )
                 VALUES (?, ?, UTC_TIMESTAMP(), ?, ?)`,
                [
                    req.auth.id_db,
                    id,
                    dispositivo,
                    seccion
                ]
            );
        } else {
            [resultado] = await pool.execute(
                `INSERT INTO visitas
                    (
                        id_admin,
                        fecha_hora_visita,
                        dispositivo,
                        seccion_visita
                    )
                 VALUES (?, UTC_TIMESTAMP(), ?, ?)`,
                [
                    id,
                    dispositivo,
                    seccion
                ]
            );
        }

        return res.status(201).json({
            exito: true,
            registrado: true,
            datos: {
                id: resultado.insertId,
                tipo: autenticada ? 'sesion' : 'visita',
                id_admin: id,
                seccion_visita: seccion,
                dispositivo
            }
        });
    } catch (error) {
        next(error);
    }
}

async function obtenerEstadisticas(req, res, next) {
    try {
        if (Object.keys(req.query).length) {
            throw new ErrorHttp(
                400,
                'Las estadísticas usan los últimos 7 días y el portfolio del administrador autenticado. No envíes parámetros.'
            );
        }

        // Cada administrador consulta su propio portfolio.
        const id = req.auth.id_db;
        const { fechas, inicio, fin } = ultimosSieteDias();

        const parametros = [
            id, inicio, fin,
            id, inicio, fin
        ];

        const eventos = `
            SELECT
                CONCAT('visita-', id_visita) AS id,
                fecha_hora_visita AS fecha,
                seccion_visita AS seccion,
                0 AS autenticada
            FROM visitas
            WHERE id_admin = ?
              AND fecha_hora_visita >= ?
              AND fecha_hora_visita < ?

            UNION ALL

            SELECT
                CONCAT('sesion-', id_sesion) AS id,
                fecha_hora_login AS fecha,
                seccion_visita AS seccion,
                1 AS autenticada
            FROM sesiones
            WHERE id_admin = ?
              AND fecha_hora_login >= ?
              AND fecha_hora_login < ?
        `;

        const [
            [filas],
            [[totales]],
            [recientes]
        ] = await Promise.all([
            pool.execute(
                `SELECT
                    DATE_FORMAT(
                        DATE_SUB(fecha, INTERVAL 3 HOUR),
                        '%Y-%m-%d'
                    ) AS dia,
                    COUNT(*) AS total,
                    SUM(autenticada) AS autenticadas
                 FROM (${eventos}) AS eventos
                 GROUP BY dia
                 ORDER BY dia`,
                parametros
            ),

            pool.execute(
                `SELECT
                    (
                        SELECT COUNT(*)
                        FROM proyectos
                        WHERE id_admin = ?
                    ) AS proyectos,

                    (
                        SELECT COUNT(*)
                        FROM proyectos
                        WHERE id_admin = ?
                          AND NULLIF(TRIM(demo_url), '') IS NOT NULL
                    ) AS demos,

                    (
                        SELECT COUNT(*)
                        FROM servicios
                        WHERE id_admin = ?
                    ) AS servicios,

                    (
                        (SELECT COUNT(*) FROM usuarios) +
                        (SELECT COUNT(*) FROM administrador)
                    ) AS usuarios,

                    (
                        SELECT COUNT(*)
                        FROM consultas
                        WHERE id_admin = ?
                          AND estado = 'pendiente'
                    ) AS consultasPendientes`,
                [id, id, id, id]
            ),

            pool.execute(
                `SELECT
                    id,
                    seccion,
                    autenticada,
                    DATE_FORMAT(
                        fecha,
                        '%Y-%m-%dT%H:%i:%s.000Z'
                    ) AS fecha_utc
                 FROM (${eventos}) AS eventos
                 ORDER BY fecha DESC, id DESC
                 LIMIT 5`,
                parametros
            )
        ]);

        const porDia = new Map(
            filas.map(fila => [fila.dia, fila])
        );

        // Siempre devuelve los siete días, incluso los que tienen cero.
        const visits = fechas.map(fecha => ({
            label: DIAS[
                new Date(fecha + 'T00:00:00Z').getUTCDay()
            ],
            date: fecha,
            value: Number(porDia.get(fecha)?.total || 0)
        }));

        const counts = Object.fromEntries(
            Object.entries(totales).map(
                ([campo, cantidad]) => [campo, Number(cantidad)]
            )
        );

        return res.json({
            exito: true,

            counts,

            visits,

            authenticatedAccesses: filas.reduce(
                (total, fila) => total + Number(fila.autenticadas),
                0
            ),

            distribution: [
                {
                    label: 'Proyectos',
                    value: counts.proyectos
                },
                {
                    label: 'Demos',
                    value: counts.demos
                },
                {
                    label: 'Servicios',
                    value: counts.servicios
                }
            ],

            activity: recientes.map(evento => ({
                id: evento.id,
                text: `${
                    Number(evento.autenticada)
                        ? 'Acceso autenticado'
                        : 'Visita'
                } a ${evento.seccion || 'inicio'}`,
                date: formatoFecha.format(
                    new Date(evento.fecha_utc)
                )
            })),

            periodo: {
                desde: fechas[0],
                hasta: fechas[6],
                zonaHoraria: 'America/Argentina/Buenos_Aires'
            }
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    registrarVisita,
    obtenerEstadisticas
};