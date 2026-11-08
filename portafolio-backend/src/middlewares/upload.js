const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// 1. Conectamos con tu cuenta usando las variables del .env
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Configuramos dónde y cómo se guardan los archivos en la nube
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'portafolio_imagenes', // Así se va a llamar la carpeta en tu Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'avif'] // Protegemos el server de archivos raros
    }
});

// 3. Empaquetamos todo en el middleware de Multer
const upload = multer({ storage: storage });

module.exports = upload;