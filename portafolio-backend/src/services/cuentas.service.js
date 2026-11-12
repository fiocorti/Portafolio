const pool = require('../config/db');
const { ErrorHttp } = require('../utils/cuentas');

const SELECT_ADMIN = `
    SELECT
        id_admin AS id_db,
        nombre,
        apellido,
        email,
        'administrador' AS tipo,
        'administrador' AS rol,
        NULL AS fecha_baja,
        NULL AS fechaRegistro
    FROM administrador`;

const SELECT_USUARIO = `
    SELECT
        id_usuario AS id_db,
        nombre,
        apellido,
        email,
        'usuario' AS tipo,
        rol,
        fecha_baja,
        DATE_FORMAT(fecha_registro, '%Y-%m-%d') AS fechaRegistro
    FROM usuarios`;

async function buscarCuenta(
    tipo,
    id,
    conexion = pool,
    bloquear = false
) {
    const admin = tipo === 'administrador';

    const sql = `
        ${admin ? SELECT_ADMIN : SELECT_USUARIO}
        WHERE ${admin ? 'id_admin' : 'id_usuario'} = ?
        ${bloquear ? 'FOR UPDATE' : ''}
    `;

    const [[cuenta]] = await conexion.execute(sql, [id]);

    return cuenta || null;
}

async function listarCuentas() {
    const [[admins], [usuarios]] = await Promise.all([
        pool.execute(`${SELECT_ADMIN} ORDER BY nombre, id_admin`),
        pool.execute(`${SELECT_USUARIO} ORDER BY nombre, id_usuario`)
    ]);

    return [...admins, ...usuarios].sort(
        (a, b) => a.nombre.localeCompare(b.nombre, 'es')
    );
}

async function buscarParaLogin(email) {
    const sqlAdmin = SELECT_ADMIN.replace(
        'FROM administrador',
        ', contrasena FROM administrador'
    );

    const sqlUsuario = SELECT_USUARIO.replace(
        'FROM usuarios',
        ', contrasena FROM usuarios'
    );

    const [[admins], [usuarios]] = await Promise.all([
        pool.execute(
            `${sqlAdmin} WHERE email = ?`,
            [email]
        ),
        pool.execute(
            `${sqlUsuario}
             WHERE email = ?
             AND fecha_baja IS NULL
             AND metodo_auth = 'Local'`,
            [email]
        )
    ]);

    return [...admins, ...usuarios];
}

async function transaccion(operacion) {
    const conexion = await pool.getConnection();

    try {
        await conexion.beginTransaction();

        const resultado = await operacion(conexion);

        await conexion.commit();

        return resultado;
    } catch (error) {
        try {
            await conexion.rollback();
        } catch (_) {
            // Se conserva el error original.
        }

        throw error;
    } finally {
        conexion.release();
    }
}

async function comprobarEmail(conexion, email, excepto = null) {
    const [admins] = await conexion.execute(
        `SELECT id_admin AS id
         FROM administrador
         WHERE email = ?
         FOR UPDATE`,
        [email]
    );

    const [usuarios] = await conexion.execute(
        `SELECT id_usuario AS id
         FROM usuarios
         WHERE email = ?
         FOR UPDATE`,
        [email]
    );

    const ocupadoEnAdmins = admins.some(
        cuenta => !(
            excepto?.tipo === 'administrador' &&
            cuenta.id === excepto.id
        )
    );

    const ocupadoEnUsuarios = usuarios.some(
        cuenta => !(
            excepto?.tipo === 'usuario' &&
            cuenta.id === excepto.id
        )
    );

    if (ocupadoEnAdmins || ocupadoEnUsuarios) {
        throw new ErrorHttp(
            409,
            'Ese correo electrónico ya está registrado.'
        );
    }
}

async function crearUsuario({ nombre, apellido, email, hash }) {
    return transaccion(async conexion => {
        await comprobarEmail(conexion, email);

        const [resultado] = await conexion.execute(
            `INSERT INTO usuarios
                (nombre, apellido, email, contrasena, metodo_auth, rol)
             VALUES (?, ?, ?, ?, 'Local', 'usuario')`,
            [nombre, apellido, email, hash]
        );

        return buscarCuenta(
            'usuario',
            resultado.insertId,
            conexion
        );
    });
}

async function editarCuenta(identidad, cambios, actor) {
    return transaccion(async conexion => {
        const actual = await buscarCuenta(
            identidad.tipo,
            identidad.id,
            conexion,
            true
        );

        if (!actual) {
            throw new ErrorHttp(
                404,
                'No se encontró la cuenta solicitada.'
            );
        }

        const propia =
            actor.tipo === identidad.tipo &&
            actor.id_db === identidad.id;

        const estado = cambios.estado ??
            (actual.fecha_baja == null ? 'Activo' : 'Inactivo');

        const rol = cambios.rol ?? actual.rol;

        if (propia && rol !== actual.rol) {
            throw new ErrorHttp(
                403,
                'No podés modificar tu propio rol.'
            );
        }

        if (propia && estado === 'Inactivo') {
            throw new ErrorHttp(
                403,
                'No podés desactivar tu propia cuenta.'
            );
        }

        if (identidad.tipo === 'administrador') {
            if (rol !== 'administrador' || estado !== 'Activo') {
                throw new ErrorHttp(
                    403,
                    'El rol y el estado de las cuentas administradoras no se modifican desde esta pantalla.'
                );
            }
        } else if (!['usuario', 'operador'].includes(rol)) {
            throw new ErrorHttp(
                403,
                'Solo se pueden asignar los roles usuario u operador.'
            );
        }

        await comprobarEmail(
            conexion,
            cambios.email,
            identidad
        );

        if (identidad.tipo === 'administrador') {
            await conexion.execute(
                `UPDATE administrador
                 SET nombre = ?, email = ?
                 WHERE id_admin = ?`,
                [
                    cambios.nombre,
                    cambios.email,
                    identidad.id
                ]
            );
        } else {
            await conexion.execute(
                `UPDATE usuarios
                 SET nombre = ?,
                     email = ?,
                     rol = ?,
                     fecha_baja = CASE
                         WHEN ? = 'Activo' THEN NULL
                         ELSE COALESCE(fecha_baja, CURRENT_TIMESTAMP)
                     END
                 WHERE id_usuario = ?`,
                [
                    cambios.nombre,
                    cambios.email,
                    rol,
                    estado,
                    identidad.id
                ]
            );
        }

        return buscarCuenta(
            identidad.tipo,
            identidad.id,
            conexion
        );
    });
}

module.exports = {
    buscarCuenta,
    listarCuentas,
    buscarParaLogin,
    crearUsuario,
    editarCuenta
};