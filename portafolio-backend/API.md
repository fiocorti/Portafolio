# Documentación de la API - Portafolio Backend

URL Base de desarrollo: `http://localhost:3001/api`
URL base de desarrollo `http://localhost:3001/api`

---

## 1. Autenticación

### Configuración de la sesión

- Generá una clave con `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"` y guardala en `JWT_SECRET` en el `.env` del backend.
- Configurá `AUTH_ALLOWED_ORIGINS` con los orígenes de React separados por comas si usás una dirección distinta de `http://localhost:3000`.
- El login usa las cuentas de `administrador` y las cuentas locales activas de `usuarios`. El campo `contrasena` de cada cuenta debe contener un hash bcrypt. Para generar uno, usá `bcryptjs.hash(contrasena, 12)`.

### Iniciar sesión con `POST /api/auth/login`

- Enviá este cuerpo como JSON.
  ```json
  {
    "email": "admin@ejemplo.com",
    "contrasena": "clave-de-ejemplo"
  }
  ```
- La respuesta `200` incluye el token y los datos de la cuenta. La cookie `portafolio_sesion` es HttpOnly y vence a las 8 horas.
  ```json
  {
    "exito": true,
    "token": "<jwt>",
    "usuario": {
      "id": 1,
      "id_admin": 1,
      "nombre": "Ana",
      "apellido": "Pérez",
      "email": "admin@ejemplo.com",
      "rol": "administrador"
    }
  }
  ```
- React debe enviar `credentials: 'include'` al hacer el login y actualizar `AuthProvider` con `setUser(respuesta.usuario)`. Cuando `usuario.rol` es `administrador`, puede navegar a `/admin`. Las cuentas públicas reciben `rol: "usuario"` e `id_usuario`.
- Los campos inválidos devuelven `400`. Las credenciales incorrectas devuelven `401`.

### Consultar la sesión con `GET /api/auth/me`

Devuelve `{ "exito": true, "user": { ... } }` con los datos de la cuenta. React envía la cookie con `credentials: 'include'`. En Thunder Client podés usar `Authorization: Bearer <token>`. Si la sesión venció o la cuenta ya no está disponible, devuelve `401`.

### Cerrar la sesión del navegador con `POST /api/auth/logout`

Borra la cookie y devuelve `{ "exito": true }`. Los tokens enviados manualmente como Bearer vencen a las 8 horas.

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
