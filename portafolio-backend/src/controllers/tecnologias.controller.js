const pool = require('../config/db'); // Ajustá la ruta a tu archivo de conexión

// TRAER TODAS (Para el panel de administración)
const obtenerTecnologias = async (req, res) => {
    try {
        const query = 'SELECT * FROM tecnologias ORDER BY categoria, nombre';
        const [tecnologias] = await pool.query(query);
        
        res.json({ exito: true, datos: tecnologias });
    } catch (error) {
        console.error('Error al obtener tecnologías:', error);
        res.status(500).json({ exito: false, mensaje: 'Error interno al obtener tecnologías' });
    }
};

// TRAER SOLO LAS EN USO (Para el filtro del portafolio público)
const obtenerTecnologiasEnUso = async (req, res) => {
    try {
        const query = `
            SELECT DISTINCT t.* 
            FROM tecnologias t
            INNER JOIN proyecto_tecnologia pt ON t.id_tecnologia = pt.id_tecnologia
            ORDER BY t.categoria, t.nombre
        `;
        const [tecnologias] = await pool.query(query);
        
        res.json({ exito: true, datos: tecnologias });
    } catch (error) {
        console.error('Error al obtener tecnologías en uso:', error);
        res.status(500).json({ exito: false, mensaje: 'Error interno' });
    }
};

// CREAR TECNOLOGÍA (Validando que no exista un duplicado)
const crearTecnologia = async (req, res) => {
    try {
        // Ahora atrapamos el link del ícono directamente desde el body, junto al nombre y categoría
        const { nombre, categoria, icono_url } = req.body;
        
        // Validamos que no exista otra con el mismo nombre
        const [existe] = await pool.query('SELECT * FROM tecnologias WHERE LOWER(nombre) = LOWER(?)', [nombre]);
        if (existe.length > 0) {
            return res.status(400).json({ exito: false, mensaje: 'Esta tecnología ya está registrada.' });
        }

        // Insertamos en la base de datos usando el nombre correcto de columna (icono_url)
        const query = 'INSERT INTO tecnologias (nombre, categoria, icono_url) VALUES (?, ?, ?)';
        // Si no mandan ícono, guardamos null para que siga siendo opcional
        const [resultado] = await pool.query(query, [nombre, categoria, icono_url || null]);

        res.status(201).json({ 
            exito: true, 
            id_tecnologia: resultado.insertId, 
            icono_url: icono_url,
            mensaje: 'Tecnología creada correctamente' 
        });
    } catch (error) {
        console.error('Error al crear tecnología:', error);
        res.status(500).json({ exito: false, mensaje: 'Error interno al crear' });
    }
};

// ELIMINAR TECNOLOGÍA (Solo se puede eliminar las que no estan en uso)
const eliminarTecnologia = async (req, res) => {
    try {
        const { id } = req.params;

        const queryUso = 'SELECT COUNT(*) as uso_count FROM proyecto_tecnologia WHERE id_tecnologia = ?';
        const [resultadoUso] = await pool.query(queryUso, [id]);

        if (resultadoUso[0].uso_count > 0) {
            return res.status(409).json({ 
                exito: false, 
                mensaje: `No se puede eliminar la tecnología porque está en uso en ${resultadoUso[0].uso_count} proyecto(s).` 
            });
        }

        const queryDelete = 'DELETE FROM tecnologias WHERE id_tecnologia = ?';
        const [resultadoDelete] = await pool.query(queryDelete, [id]);

        if (resultadoDelete.affectedRows === 0) {
            return res.status(404).json({ exito: false, mensaje: 'Tecnología no encontrada' });
        }

        res.json({ exito: true, mensaje: 'Tecnología eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar tecnología:', error);
        res.status(500).json({ exito: false, mensaje: 'Error al intentar eliminar' });
    }
};

module.exports = { obtenerTecnologias, obtenerTecnologiasEnUso, crearTecnologia, eliminarTecnologia };