// Importamos la conexión a la base de datos
const pool = require('../config/db'); // Ajustá la ruta si tu archivo de conexión se llama distinto

// Función para mostrar (GET)
const obtenerServicios = async (req, res) => {
    try {
        // Hacemos la consulta SQL directa. Por ahora traemos todos.
        const query = `SELECT * FROM servicios`;
        const [rows] = await pool.query(query);

        // Devolvemos los datos al frontend
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener servicios:', error);
        res.status(500).json({ 
            exito: false, 
            mensaje: 'Error interno del servidor al cargar los servicios' 
        });
    }
};

// Función para crear (POST)
const crearServicio = async (req, res) => {
    try {
        // Atrapamos los datos enviados desde el frontend
        const { nombre, descripcion, caracteristicas, icono_url, estado } = req.body;
        
        // Administrador por defecto (Camila)
        const id_admin = 1; 
        const estadoFinal = estado || 'Borrador';

        const query = `
            INSERT INTO servicios 
            (id_admin, nombre, descripcion, caracteristicas, icono_url, estado) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        const [resultado] = await pool.query(query, [
            id_admin, 
            nombre, 
            descripcion, 
            caracteristicas, 
            icono_url, 
            estadoFinal
        ]);

        res.json({
            exito: true,
            mensaje: '¡Servicio creado con éxito!',
            id_nuevo: resultado.insertId
        });
    } catch (error) {
        console.error('Error al crear servicio:', error);
        res.status(500).json({ exito: false, mensaje: 'Error al guardar el servicio' });
    }
};

// Función para actualizar (PUT)
const actualizarServicio = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, caracteristicas, icono_url, estado } = req.body;
        
        // El IFNULL de SQL permite que si no mandás un dato, conserve el que ya tenía
        const query = `
            UPDATE servicios 
            SET nombre = ?, descripcion = ?, caracteristicas = ?, icono_url = ?, estado = ? 
            WHERE id_servicio = ?
        `;
        
        const [resultado] = await pool.query(query, [nombre, descripcion, caracteristicas, icono_url, estado, id]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ exito: false, mensaje: 'Servicio no encontrado' });
        }

        res.json({ exito: true, mensaje: 'Servicio actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar servicio:', error);
        res.status(500).json({ exito: false, mensaje: 'Error interno al actualizar' });
    }
};

// Función para eliminar (DELETE)
const eliminarServicio = async (req, res) => {
    try {
        const { id } = req.params;

        const query = 'DELETE FROM servicios WHERE id_servicio = ?';
        const [resultado] = await pool.query(query, [id]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ exito: false, mensaje: 'Servicio no encontrado o ya eliminado' });
        }

        res.json({ exito: true, mensaje: 'Servicio eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar servicio:', error);
        res.status(500).json({ exito: false, mensaje: 'Error interno al eliminar' });
    }
};

module.exports = { obtenerServicios, crearServicio, actualizarServicio, eliminarServicio };