const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./src/config/db');

const app = express();

// Middlewares para procesar JSON y permitir conexión del frontend
app.use(cors());
app.use(express.json());

// Ruta de prueba inicial
app.get('/api/test', (req, res) => {
    res.json({ exito: true, mensaje: 'API del Portafolio funcionando correctamente' });
});

// Levantar el servidor
const PORT = process.env.PORT || 3000;

// Importar rutas
const proyectosRoutes = require('./src/routes/proyectos.routes');

// Usar rutas
app.use('/api/proyectos', proyectosRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});