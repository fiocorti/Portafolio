const pool = require('../config/db');

const obtenerExperiencias = async (req, res) => {
    try {
        const query = 'SELECT * FROM experiencias ORDER BY fecha_inicio DESC';
        const [experiencias] = await pool.query(query);
        
        res.json({
            exito: true,
            datos: experiencias
        });
    } catch (error) {
        console.error('Error al obtener experiencias:', error);
        res.status(500).json({ exito: false, mensaje: 'Error interno al obtener experiencias' });
    }
};

const crearExperiencia = async (req, res) => {
    try {
        // Extraemos exactamente los campos que definiste en tu DER
        const { titulo, categoria, descripcion, fecha_inicio, fecha_fin, estado } = req.body;
        
        // Asumimos el id_admin = 1 por ahora, hasta que conectemos el token de login
        const id_admin = 1; 

        const query = `
            INSERT INTO experiencias (id_admin, titulo, categoria, descripcion, fecha_inicio, fecha_fin, estado) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        const [resultado] = await pool.query(query, [id_admin, titulo, categoria, descripcion, fecha_inicio, fecha_fin, estado]);

        res.status(201).json({
            exito: true,
            mensaje: 'Experiencia agregada correctamente',
            id_experiencia: resultado.insertId
        });
    } catch (error) {
        console.error('Error al crear experiencia:', error);
        res.status(500).json({ exito: false, mensaje: 'Error interno al crear la experiencia' });
    }
};

module.exports = { obtenerExperiencias, crearExperiencia };