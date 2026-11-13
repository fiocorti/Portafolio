const pool = require('../config/db');
const nodemailer = require('nodemailer');

// EL VISITANTE HACE UNA CONSULTA (Solo se guarda en la BD)
const recibirConsulta = async (req, res) => {
    const { id_servicio, nombre_remitente, email_remitente, motivo, contenido } = req.body;
    const id_admin = 1; // Asignamos tu ID automáticamente en el backend
    const conexion = await pool.getConnection();

    try {
        await conexion.beginTransaction();

        // Insertamos el encabezado de la consulta
        const [resultConsulta] = await conexion.query(`
            INSERT INTO consultas (id_admin, id_servicio, nombre_remitente, email_remitente, motivo, estado) 
            VALUES (?, ?, ?, ?, ?, 'pendiente')
        `, [id_admin, id_servicio || null, nombre_remitente, email_remitente, motivo]);
        const idConsultaGenerada = resultConsulta.insertId;

        // Insertamos el mensaje inicial asociado
        await conexion.query(`
            INSERT INTO mensajes (id_consulta, contenido, es_respuesta_admin, leido) 
            VALUES (?, ?, FALSE, FALSE)
        `, [idConsultaGenerada, contenido]);

        await conexion.commit();
        res.status(201).json({ exito: true, mensaje: 'Consulta enviada con éxito' });

    } catch (error) {
        await conexion.rollback();
        console.error('Error al recibir la consulta:', error);
        res.status(500).json({ exito: false, mensaje: 'Error interno al registrar la consulta' });
    } finally {
        conexion.release();
    }
};

// EL ADMIN LE RESPONDE (se guarda en la BD y manda un email al visitante)
const responderConsulta = async (req, res) => {
    const { id_consulta, contenido_respuesta } = req.body;
    const conexion = await pool.getConnection();

    try {
        // 1. Buscamos a quién hay que contestarle
        const [consultas] = await conexion.query('SELECT nombre_remitente, email_remitente, motivo FROM consultas WHERE id_consulta = ?', [id_consulta]);
        
        if (consultas.length === 0) {
            return res.status(404).json({ exito: false, mensaje: 'Consulta no encontrada' });
        }

        const datosVisitante = consultas[0];

        await conexion.beginTransaction();

        // 2. Guardamos tu respuesta fijando "es_respuesta_admin" en TRUE
        const queryMensaje = `
            INSERT INTO mensajes (id_consulta, contenido, es_respuesta_admin, leido) 
            VALUES (?, ?, TRUE, TRUE) 
        `;
        await conexion.query(queryMensaje, [id_consulta, contenido_respuesta]);

        // 3. Opcional pero recomendado: pasamos el estado de la consulta a 'respondida'
        await conexion.query(`UPDATE consultas SET estado = 'respondida' WHERE id_consulta = ?`, [id_consulta]);

        await conexion.commit();

        // 4. Armamos el correo para el visitante
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,             // Sale de tu Gmail
            to: datosVisitante.email_remitente,       // Llega al email del visitante
            subject: `Respuesta a tu consulta sobre: ${datosVisitante.motivo}`,
            html: `
                <h3>Hola ${datosVisitante.nombre_remitente},</h3>
                <p>Gracias por contactarte conmigo a través de mi portafolio.</p>
                <br/>
                <p>${contenido_respuesta}</p>
                <br/>
                <p>Saludos cordiales,</p>
                <p><strong>Ezequiel Pantoja</strong></p>
                <p><i>Desarrollador Backend</i></p>
            `
        };

        // 5. Disparamos el correo
        await transporter.sendMail(mailOptions);

        res.status(200).json({ 
            exito: true, 
            mensaje: 'Tu respuesta fue guardada y el correo enviado al visitante' 
        });

    } catch (error) {
        await conexion.rollback();
        console.error('Error al enviar la respuesta:', error);
        res.status(500).json({ exito: false, mensaje: 'Error al procesar tu respuesta' });
    } finally {
        conexion.release();
    }
};

// OBTENER TODAS LAS CONSULTAS (Para la tabla/bandeja del panel)
const obtenerConsultas = async (req, res) => {
    try {
        const query = `
            SELECT c.id_consulta, c.nombre_remitente, c.email_remitente, c.motivo, c.estado, c.fecha_inicio,
                   s.nombre AS nombre_servicio
            FROM consultas c
            LEFT JOIN servicios s ON c.id_servicio = s.id_servicio
            ORDER BY c.fecha_inicio DESC
        `;
        const [consultas] = await pool.query(query);
        
        res.status(200).json({
            exito: true,
            consultas
        });
    } catch (error) {
        console.error('Error al obtener las consultas:', error);
        res.status(500).json({ exito: false, mensaje: 'Error al obtener la lista de consultas' });
    }
};

// OBTENER UNA CONSULTA ESPECÍFICA CON SUS MENSAJES (Para el chat/detalle)
const obtenerConsultaPorId = async (req, res) => {
    const { id } = req.params;
    const conexion = await pool.getConnection();

    try {
        const [consultas] = await conexion.query(`
            SELECT c.*, s.nombre AS nombre_servicio 
            FROM consultas c 
            LEFT JOIN servicios s ON c.id_servicio = s.id_servicio 
            WHERE c.id_consulta = ?
        `, [id]);

        if (consultas.length === 0) {
            return res.status(404).json({ exito: false, mensaje: 'Consulta no encontrada' });
        }

        const [mensajes] = await conexion.query(`
            SELECT id_mensaje, contenido, es_respuesta_admin, leido, fecha_envio 
            FROM mensajes 
            WHERE id_consulta = ? 
            ORDER BY fecha_envio ASC
        `, [id]);

        res.status(200).json({
            exito: true,
            consulta: consultas[0],
            mensajes
        });

    } catch (error) {
        console.error('Error al obtener el detalle de la consulta:', error);
        res.status(500).json({ exito: false, mensaje: 'Error al obtener el detalle' });
    } finally {
        conexion.release();
    }
};

module.exports = { recibirConsulta, responderConsulta, obtenerConsultas, obtenerConsultaPorId };