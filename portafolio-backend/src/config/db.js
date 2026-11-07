const mysql = require('mysql2/promise');
require('dotenv').config();

// Creamos un "pool" (piscina) de conexiones para administrar múltiples peticiones
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Testeamos la conexión apenas arranca el archivo
pool.getConnection()
    .then(connection => {
        console.log('¡Conexión a la base de datos en Aiven exitosa! 🚀');
        connection.release(); // Liberamos la conexión para que no quede colgada
    })
    .catch(error => {
        console.error('Error al conectar con Aiven:', error.message);
    });

module.exports = pool;