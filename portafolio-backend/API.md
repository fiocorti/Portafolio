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

## 2. Proyectos

### Obtener todos los Proyectos
- **Ruta:** `/proyectos`
- **Método:** `GET`
- **Respuesta Exitosa (200 OK):** Devuelve un arreglo con los proyectos y sus tecnologías asociadas concatenadas.

### Crear un nuevo Proyecto
- **Ruta:** `/proyectos`
- **Método:** `POST`
- **Body requerido (JSON):**
  ```json
  {
    "nombre": "API E-commerce",
    "descripcion": "Backend para tienda",
    "repositorio_url": "https://github.com/...",
    "estado": "Publicado",
    "tecnologias": [
      { "nombre": "Node.js", "categoria": "Backend" },
      { "nombre": "MySQL", "categoria": "Base de Datos" }
    ]
  }
  ```
- **Respuesta Exitosa (200 OK):** `{"exito": true, "mensaje": "Proyecto creado exitosamente"}`

### Actualizar un Proyecto
- **Ruta:** `/proyectos/:id`
- **Método:** `PUT`
- **Descripción:** Actualiza los datos del proyecto y reemplaza sus tecnologías asociadas en la tabla intermedia.
- **Body requerido (JSON):** Igual al del POST.
- **Respuestas:** `200 OK` (Éxito), `404 Not Found` (Proyecto no encontrado).

### Eliminar un Proyecto
- **Ruta:** `/proyectos/:id`
- **Método:** `DELETE`
- **Descripción:** Elimina el proyecto y limpia su relación con las tecnologías (borrado en cascada). Las tecnologías NO se borran del sistema.
- **Respuestas:** `200 OK` (Éxito), `404 Not Found`.

---

## 3. Servicios

### Obtener todos los Servicios
- **Ruta:** `/servicios`
- **Método:** `GET`
- **Respuesta Exitosa (200 OK):** Devuelve un arreglo con la lista completa de servicios.

### Crear un nuevo Servicio
- **Ruta:** `/servicios`
- **Método:** `POST`
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
- **Respuesta Exitosa (200 OK):** `{"exito": true, "mensaje": "Servicio creado..."}`

### Actualizar un Servicio
- **Ruta:** `/servicios/:id`
- **Método:** `PUT`
- **Descripción:** Actualiza todos los datos de un servicio existente.
- **Body requerido (JSON):** Igual al del POST.
- **Respuestas:** `200 OK` (Éxito), `404 Not Found`.

### Eliminar un Servicio
- **Ruta:** `/servicios/:id`
- **Método:** `DELETE`
- **Descripción:** Elimina un servicio de la base de datos.
- **Respuestas:** `200 OK` (Éxito), `404 Not Found`.

---

## 4. Tecnologías

### Obtener todas las Tecnologías
- **Ruta:** `/tecnologias`
- **Método:** `GET`
- **Descripción:** Devuelve el catálogo de tecnologías ordenadas por categoría y nombre.
- **Respuesta Exitosa (200 OK):** Arreglo de objetos con las tecnologías.

### Eliminar una Tecnología
- **Ruta:** `/tecnologias/:id`
- **Método:** `DELETE`
- **Descripción:** Elimina una tecnología. **Restricción:** Solo se permite si no está asociada a ningún proyecto (huérfana).
- **Respuestas:**
  - `200 OK`: Eliminada con éxito.
  - `409 Conflict`: Bloqueado porque está en uso.
  - `404 Not Found`: No encontrada.