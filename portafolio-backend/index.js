const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit'); // Importamos para frenar el spam
require('dotenv').config();
require('./src/config/db'); // Inicializa y prueba la conexión a la base de datos de Aiven

const app = express();

// 🛡️ 1. SEGURIDAD: CORS (Control de Accesos)
// Lista blanca de URLs que tienen permiso para consumir tu API.
// Evita que cualquier otra página web maliciosa haga peticiones a tu servidor.
const rutasPermitidas = [
    'http://localhost:3000', // Típico de Create React App
    'http://localhost:5173'  // Típico de Vite
    // NOTA: Acá agregarás el link real (ej: 'https://midominio.com') cuando lo subas a producción
];
const authRoutes = require('./src/routes/auth.routes');
const origenesAuth = (process.env.AUTH_ALLOWED_ORIGINS ?? 'http://localhost:3000')
    .split(',')
    .map(origen => origen.trim())
    .filter(Boolean);



// Middlewares para procesar JSON y permitir conexión del frontend
app.use(cors({
    origin: (
        process.env.AUTH_ALLOWED_ORIGINS ||
        'http://localhost:3000,http://localhost:5173'
    )
        .split(',')
        .map(origen => origen.trim())
        .filter(Boolean),
    credentials: true
}));
require('./src/instalarCuentas')(app);
require('./src/instalarVisitas')(app);
app.use(express.json());

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || rutasPermitidas.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Bloqueado por CORS: Acceso denegado'));
        }
    },
    credentials: true // <-- AGREGAR ESTA LÍNEA
}));

// 🛡️ 2. SEGURIDAD: RATE LIMITING (Anti-Spam)
// Límite general para TODA la API: Máximo 100 peticiones cada 15 minutos por computadora (IP)
const limitadorGeneral = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos en milisegundos
    max: 100, // Límite de peticiones por ventana de tiempo
    message: { 
        exito: false, 
        mensaje: 'Te pasaste del límite de peticiones. Relajá y probá de nuevo en 15 minutos.' 
    },
    standardHeaders: true, // Devuelve información del límite en los headers
    legacyHeaders: false, // Deshabilita headers viejos
});

// Aplicamos el límite general a nivel global (afecta a todas las rutas a partir de acá)
app.use(limitadorGeneral);


// 3. MIDDLEWARES BÁSICOS
// Middlewares para procesar correctamente los datos que llegan en el body (JSON y Formularios URL-encoded)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// 4. IMPORTACIÓN DE RUTAS
// Importamos TODAS las rutas (las agrupamos para mantener el orden)
const proyectosRoutes = require('./src/routes/proyectos.routes');
const serviciosRoutes = require('./src/routes/servicios.routes');
const tecnologiasRoutes = require('./src/routes/tecnologias.routes');
const experienciasRoutes = require('./src/routes/experiencias.routes');
const contactoRoutes = require('./src/routes/contacto.routes');

// Ruta de prueba inicial (ping)
app.get('/api/test', (req, res) => {
    res.json({ exito: true, mensaje: 'API del Portafolio funcionando correctamente' });
});


// 5. REGISTRO DE RUTAS
// Usar TODAS las rutas (registramos las ventanillas donde la API escucha)
app.use('/api/proyectos', proyectosRoutes);
app.use('/api/servicios', serviciosRoutes);
app.use('/api/tecnologias', tecnologiasRoutes);
app.use('/api/experiencias', experienciasRoutes);


// 🚀 6. INICIO DEL SERVIDOR
// Levantar el servidor SIEMPRE como última instrucción
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
