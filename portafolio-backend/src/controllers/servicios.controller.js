// Importamos la conexión a la base de datos
const pool = require('../config/db'); // Ajustá la ruta si tu archivo de conexión se llama distinto

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

module.exports = { obtenerServicios, crearServicio };