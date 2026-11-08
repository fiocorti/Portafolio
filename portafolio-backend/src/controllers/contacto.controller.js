const pool = require('../config/db');
const nodemailer = require('nodemailer');

// EL VISITANTE HACE UNA CONSULTA (Solo se guarda en la BD)
const recibirConsulta = async (req, res) => {
    const { id_admin, id_servicio, nombre_remitente, email_remitente, motivo, contenido } = req.body;
    const conexion = await pool.getConnection();

    try {
        await conexion.beginTransaction();

        // Guardamos el encabezado de la consulta
        const queryConsulta = `
            INSERT INTO consultas (id_admin, id_servicio, nombre_remitente, email_remitente, motivo) 
            VALUES (?, ?, ?, ?, ?)
        `;
        const [resultadoConsulta] = await conexion.query(queryConsulta, [id_admin, id_servicio, nombre_remitente, email_remitente, motivo]);
        const idConsultaNueva = resultadoConsulta.insertId;

        // Guardamos el mensaje asociándolo a la nueva consulta
        const queryMensaje = `
            INSERT INTO mensajes (id_consulta, contenido, es_respuesta_admin, leido) 
            VALUES (?, ?, FALSE, FALSE)
        `;
        await conexion.query(queryMensaje, [idConsultaNueva, contenido]);

        await conexion.commit(); 
        
        // Respondemos al frontend de las chicas sin mandar ningún mail
        res.status(201).json({ 
            exito: true, 
            mensaje: 'Consulta registrada correctamente en la base de datos',
            id_consulta: idConsultaNueva 
        });

    } catch (error) {
        await conexion.rollback();
        console.error('Error al procesar la consulta:', error);
        res.status(500).json({ exito: false, mensaje: 'Error interno al procesar la consulta' });
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

module.exports = { recibirConsulta, responderConsulta };