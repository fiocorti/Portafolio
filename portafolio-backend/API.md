# Documentación de la API - Portafolio Backend

URL base de desarrollo `http://localhost:3001/api`

---

## 1. Módulo de Autenticación y Usuarios

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

## 2. Módulo de Portfolio (Proyectos y Servicios)

### Obtener todos los Proyectos
- **Ruta:** `/proyectos`
- **Método:** `GET`
- **Respuesta Exitosa (200 OK):**
  ```json
  {
    "exito": true,
    "datos": [
      {
        "id_proyecto": 1,
        "nombre": "API E-commerce",
        "estado": "Publicado",
        "tecnologias": ["Node.js", "Express", "MySQL"]
      }
    ]
  }
  ```

### Crear un nuevo Servicio
- **Ruta:** `/servicios`
- **Método:** `POST`
- **Headers:** `Authorization: Bearer <token_del_admin>`
- **Body requerido (JSON):**
  ```json
  {
    "nombre": "Desarrollo Web",
    "descripcion": "Creación de sitios a medida",
    "caracteristicas": "Diseño responsivo\nSEO Optimizado",
    "icono_url": "Code2",
    "estado": "Publicado"
  }
  ```
