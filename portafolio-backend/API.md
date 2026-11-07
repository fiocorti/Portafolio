# Documentación de la API - Portafolio Backend

URL Base de desarrollo: `http://localhost:3000/api`

---

## 1. Módulo de Autenticación y Usuarios

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
- **Respuesta Exitosa (200 OK):**
  ```json
  {
    "exito": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5...",
    "usuario": {
      "id_usuario": 1,
      "nombre": "Lucas"
    }
  }
  ```

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