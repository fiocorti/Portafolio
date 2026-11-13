const pool = require('../config/db');

const obtenerEstadisticasDashboard = async (req, res) => {
    const id_admin = 1; // Tu ID de admin fijo por ahora (o el que venga del token)
    const conexion = await pool.getConnection();

    try {
        // Ejecutamos las 3 consultas al mismo tiempo
        const [
            [totalUsuarios],
            [consultasPorMotivo],
            [visitasPorSeccion]
        ] = await Promise.all([
            // 1. Usuarios totales (no depende del admin)
            conexion.query("SELECT COUNT(*) AS total FROM usuarios"),
            // 2. Consultas agrupadas por motivo, solo las tuyas
            conexion.query("SELECT motivo, COUNT(*) AS cantidad FROM consultas WHERE id_admin = ? GROUP BY motivo", [id_admin]),
            // 3. Visitas agrupadas por sección, solo a tu portafolio
            conexion.query("SELECT seccion_visita, COUNT(*) AS cantidad FROM visitas WHERE id_admin = ? GROUP BY seccion_visita", [id_admin])
        ]);

        res.status(200).json({
            exito: true,
            estadisticas: {
                usuariosRegistrados: totalUsuarios[0].total,
                graficoConsultas: consultasPorMotivo,
                graficoVisitas: visitasPorSeccion
            }
        });

    } catch (error) {
        console.error('Error al obtener estadísticas del dashboard:', error);
        res.status(500).json({ exito: false, mensaje: 'Error interno al cargar métricas' });
    } finally {
        conexion.release();
    }
};

module.exports = { obtenerEstadisticasDashboard };