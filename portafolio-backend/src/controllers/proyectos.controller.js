const pool = require('../config/db');

const obtenerProyectos = async (req, res) => {
    try {
        // Hacemos la consulta con JOIN para traer las tecnologías asociadas
        const query = `
            SELECT p.*, 
                   GROUP_CONCAT(t.nombre) as tecnologias
            FROM proyectos p
            LEFT JOIN proyecto_tecnologia pt ON p.id_proyecto = pt.id_proyecto
            LEFT JOIN tecnologías t ON pt.id_tecnologia = t.id_tecnologia
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

module.exports = { obtenerProyectos };