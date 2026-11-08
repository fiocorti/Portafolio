# Documentación de la API - Portafolio Backend

URL Base de desarrollo: `http://localhost:3001/api`

---

## 1. Autenticación

### Iniciar Sesión (Login Local)
- **Ruta:** `/auth/login`
- **Método:** `POST`
- **Body requerido (JSON):**
  ```json
  {
    "email": "lucas@email.com",
    "contrasena": "mi_clave_secreta"
  }
  ```

---

## 2. Proyectos

### Obtener todos los Proyectos
- **Ruta:** `/proyectos`
- **Método:** `GET`
- **Respuesta Exitosa (200 OK):** Devuelve un arreglo con los proyectos y sus tecnologías asociadas.

### Crear un nuevo Proyecto (Con Imagen)
- **Ruta:** `/proyectos`
- **Método:** `POST`
- **Tipo de Envío:** `FormData` (Multipart) - *¡Ya no es JSON!*
- **Campos del FormData requeridos:**
  - `nombre` (Texto)
  - `descripcion` (Texto)
  - `repositorio_url` (Texto)
  - `demo_url` (Texto)
  - `estado` (Texto)
  - `tecnologias` (Texto/JSON Stringificado): Ej. `[{"nombre":"React","categoria":"Frontend"}]`
  - `imagen` (Archivo - File): Solo formatos jpg, png, webp, avif.
- **Respuesta Exitosa (201 Created):** `{"exito": true, "mensaje": "...", "id_nuevo": 1, "imagen_url": "https://res.cloudinary..."}`

---

## 3. Servicios

### Obtener todos los Servicios
- **Ruta:** `/servicios`
- **Método:** `GET`

### Crear un nuevo Servicio
- **Ruta:** `/servicios`
- **Método:** `POST`
- **Body requerido (JSON):**
  ```json
  {
    "nombre": "Desarrollo Web",
    "descripcion": "Creación de sitios a medida",
    "caracteristicas": "Diseño responsivo\nSEO Optimizado",
    "icono_url": "FaCode",
    "estado": "Publicado"
  }
  ```

---

## 4. Tecnologías

### Obtener todas las Tecnologías
- **Ruta:** `/tecnologias`
- **Método:** `GET`

---

## 5. Experiencias

### Obtener todas las Experiencias
- **Ruta:** `/experiencias`
- **Método:** `GET`

### Crear una nueva Experiencia
- **Ruta:** `/experiencias`
- **Método:** `POST`
- **Body requerido (JSON):**
  ```json
  {
    "id_admin": 1,
    "titulo": "Desarrollador Backend",
    "categoria": "Proyectos Académicos",
    "descripcion": "Diseño de API REST...",
    "fecha_inicio": "2026-08-01",
    "fecha_fin": "2026-11-06",
    "estado": "Publicado"
  }
  ```

---

## 6. Contacto (Consultas)

### 6.1. Enviar Consulta (Desde el Portafolio)
- **Ruta:** `/contacto`
- **Método:** `POST`
- **Descripción:** Registra la consulta del visitante en la base de datos (tablas `consultas` y `mensajes`). Protegido por limitador anti-spam (5 peticiones/hora).
- **Body requerido (JSON):**
  ```json
  {
    "id_admin": 1,
    "id_servicio": 2,
    "nombre_remitente": "Alonso Yatra",
    "email_remitente": "alonso@ejemplo.com",
    "motivo": "Cotización",
    "contenido": "Hola, me gustaría saber el presupuesto para una página de e-commerce."
  }
  ```
- **Respuesta:** `201 Created` (Consulta registrada correctamente).

### 6.2. Responder Consulta (Desde el Panel de Admin)
- **Ruta:** `/contacto/responder`
- **Método:** `POST`
- **Descripción:** Registra la respuesta del administrador en la base de datos y envía un correo electrónico automático al visitante vía Nodemailer.
- **Body requerido (JSON):**
  ```json
  {
    "id_consulta": 1,
    "contenido_respuesta": "Hola Alonso, te adjunto el presupuesto detallado..."
  }
  ```
- **Respuesta:** `200 OK` (Respuesta guardada y correo enviado al visitante).