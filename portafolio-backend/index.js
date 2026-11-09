const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./src/config/db');

const app = express();

const authRoutes = require('./src/routes/auth.routes');
const origenesAuth = (process.env.AUTH_ALLOWED_ORIGINS ?? 'http://localhost:3000')
    .split(',')
    .map(origen => origen.trim())
    .filter(Boolean);

app.use('/api/auth', cors({ origin: origenesAuth, credentials: true }), express.json({ limit: '4kb' }), authRoutes);

// Middlewares para procesar JSON y permitir conexión del frontend
app.use(cors());
app.use(express.json());

// Ruta de prueba inicial
app.get('/api/test', (req, res) => {
    res.json({ exito: true, mensaje: 'API del Portafolio funcionando correctamente' });
});

// 1. Importar TODAS las rutas (las agrupamos para mantener el orden)
const proyectosRoutes = require('./src/routes/proyectos.routes');
const serviciosRoutes = require('./src/routes/servicios.routes');

// Ruta de prueba inicial
app.get('/api/test', (req, res) => {
    res.json({ exito: true, mensaje: 'API del Portafolio funcionando correctamente' });
});

// 2. Usar TODAS las rutas (registramos las ventanillas)
app.use('/api/proyectos', proyectosRoutes);
app.use('/api/servicios', serviciosRoutes);

// 3. Levantar el servidor SIEMPRE como última instrucción
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
