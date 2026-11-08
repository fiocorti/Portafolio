const pool = require('../config/db');

const obtenerProyectos = async (req, res) => {
    try {
        // Hacemos la consulta con JOIN para traer las tecnologías asociadas
        const query = `
            SELECT p.*, 
                   GROUP_CONCAT(t.nombre) as tecnologias
            FROM proyectos p
            LEFT JOIN proyecto_tecnologia pt ON p.id_proyecto = pt.id_proyecto
            LEFT JOIN tecnologias t ON pt.id_tecnologia = t.id_tecnologia
            GROUP BY p.id_proyecto
        `;
        
        const [resultados] = await pool.query(query);

        // Formateamos los datos para que "tecnologias" sea un arreglo (array) en el JSON
        const proyectosFormateados = resultados.map(proyecto => {
            return {
                ...proyecto,
                tecnologias: proyecto.tecnologias ? proyecto.tecnologias.split(',') : []
            };
        });
        
        res.json({
            exito: true,
            datos: proyectosFormateados
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ exito: false, mensaje: 'Error al obtener los proyectos' });
    }
};

const crearProyecto = async (req, res) => {
    // Pedimos una conexión exclusiva al pool para manejar la transacción
    const conexion = await pool.getConnection();

    try {
        const { nombre, descripcion, repositorio_url, imagen_url, demo_url, estado, tecnologias } = req.body;
        const id_admin = 1; 
        const estadoFinal = estado || 'Borrador';

        // 1. Validar la regla de negocio: ¿Vinieron tecnologías?
        if (!tecnologias || tecnologias.length === 0) {
            return res.status(400).json({ 
                exito: false, 
                mensaje: 'Regla de negocio: Un proyecto debe incluir al menos una tecnología.' 
            });
        }

        // 2. Iniciamos la transacción segura
        await conexion.beginTransaction();

        // 3. Insertamos el proyecto en la tabla maestra
        const queryProyecto = `
            INSERT INTO proyectos 
            (id_admin, nombre, descripcion, repositorio_url, imagen_url, demo_url, fecha_creacion, estado) 
            VALUES (?, ?, ?, ?, ?, ?, CURDATE(), ?)
        `;
        const [resProyecto] = await conexion.query(queryProyecto, [id_admin, nombre, descripcion, repositorio_url, imagen_url, demo_url, estadoFinal]);
        const idProyectoNuevo = resProyecto.insertId;

        // 4. Procesamos las tecnologías una por una
        for (const tec of tecnologias) {
            let idTecnologia;

            // Verificamos si la tecnología ya existe en la base (por nombre)
            const [existeTec] = await conexion.query('SELECT id_tecnologia FROM tecnologias WHERE nombre = ?', [tec.nombre]);

            if (existeTec.length > 0) {
                // Si ya existe, rescatamos su ID
                idTecnologia = existeTec[0].id_tecnologia;
            } else {
                // Si es nueva, la creamos en la tabla maestra de tecnologías
                const queryNuevaTec = 'INSERT INTO tecnologias (nombre, categoria) VALUES (?, ?)';
                const [resTecnologia] = await conexion.query(queryNuevaTec, [tec.nombre, tec.categoria]);
                idTecnologia = resTecnologia.insertId;
            }

            // 5. Insertamos la relación en la tabla intermedia N:M
            await conexion.query(
                'INSERT INTO proyecto_tecnologia (id_proyecto, id_tecnologia) VALUES (?, ?)', 
                [idProyectoNuevo, idTecnologia]
            );
        }

        // 6. Si todo salió perfecto, confirmamos los cambios en el disco
        await conexion.commit();

        res.json({
            exito: true,
            mensaje: '¡Proyecto y tecnologías guardados con éxito!',
            id_nuevo: idProyectoNuevo
        });

    } catch (error) {
        // Si explotó cualquier cosa en el proceso, deshacemos todo
        await conexion.rollback();
        console.error('Error en la transacción:', error);
        res.status(500).json({ exito: false, mensaje: 'Error al guardar el proyecto completo' });
    } finally {
        // Siempre hay que devolver la conexión al pool para no saturar el servidor
        conexion.release();
    }
};

const actualizarProyecto = async (req, res) => {
    const conexion = await pool.getConnection();

    try {
        const { id } = req.params;
        const { nombre, descripcion, repositorio_url, imagen_url, demo_url, estado, tecnologias } = req.body;

        await conexion.beginTransaction();

        // 1. Actualizamos los datos principales del proyecto
        const queryUpdate = `
            UPDATE proyectos 
            SET nombre = ?, descripcion = ?, repositorio_url = ?, imagen_url = ?, demo_url = ?, estado = ?
            WHERE id_proyecto = ?
        `;
        const [resultadoProyecto] = await conexion.query(queryUpdate, [nombre, descripcion, repositorio_url, imagen_url, demo_url, estado, id]);

        if (resultadoProyecto.affectedRows === 0) {
            await conexion.rollback();
            return res.status(404).json({ exito: false, mensaje: 'Proyecto no encontrado' });
        }

        // 2. Si el frontend nos manda tecnologías, actualizamos las relaciones
        if (tecnologias && tecnologias.length > 0) {
            // Borramos los "cables" viejos de este proyecto
            await conexion.query('DELETE FROM proyecto_tecnologia WHERE id_proyecto = ?', [id]);

            // Conectamos los "cables" nuevos
            for (const tec of tecnologias) {
                let idTecnologia;
                const [existeTec] = await conexion.query('SELECT id_tecnologia FROM tecnologias WHERE nombre = ?', [tec.nombre]);

                if (existeTec.length > 0) {
                    idTecnologia = existeTec[0].id_tecnologia;
                } else {
                    const [nuevaTec] = await conexion.query('INSERT INTO tecnologias (nombre, categoria) VALUES (?, ?)', [tec.nombre, tec.categoria]);
                    idTecnologia = nuevaTec.insertId;
                }

                await conexion.query(
                    'INSERT INTO proyecto_tecnologia (id_proyecto, id_tecnologia) VALUES (?, ?)', 
                    [id, idTecnologia]
                );
            }
        }

        await conexion.commit();
        res.json({ exito: true, mensaje: 'Proyecto y tecnologías actualizados correctamente' });

    } catch (error) {
        await conexion.rollback();
        console.error('Error al actualizar proyecto:', error);
        res.status(500).json({ exito: false, mensaje: 'Error interno al actualizar' });
    } finally {
        conexion.release();
    }
};

const eliminarProyecto = async (req, res) => {
    try {
        const { id } = req.params;

        // Al borrar el proyecto, MySQL borra automáticamente las filas asociadas 
        // en proyecto_tecnologia (si configuraste la FK en cascada)
        const query = 'DELETE FROM proyectos WHERE id_proyecto = ?';
        const [resultado] = await pool.query(query, [id]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ 
                exito: false, 
                mensaje: 'Proyecto no encontrado o ya eliminado' 
            });
        }

        res.json({ 
            exito: true, 
            mensaje: 'Proyecto eliminado correctamente (las tecnologías siguen disponibles en el sistema)' 
        });
    } catch (error) {
        console.error('Error al eliminar proyecto:', error);
        res.status(500).json({ exito: false, mensaje: 'Error interno al eliminar el proyecto' });
    }
};

module.exports = { obtenerProyectos, crearProyecto, actualizarProyecto, eliminarProyecto };