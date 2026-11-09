
const API_URL = (
  process.env.REACT_APP_API_URL || ""
).replace(/\/+$/, "");

// Función reutilizable para consultar el backend.
async function consultarAPI(ruta) {
  if (!API_URL) {
    throw new Error("Falta configurar REACT_APP_API_URL");
  }

  const respuesta = await fetch(`${API_URL}${ruta}`, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!respuesta.ok) {
    throw new Error(`Error HTTP ${respuesta.status} en ${ruta}`);
  }

  const tipo = respuesta.headers.get("content-type") || "";

  if (!tipo.includes("application/json")) {
    throw new Error("El servidor no devolvió JSON. Revisá la URL.");
  }

  return respuesta.json();
}

// GET /api/proyectos
export async function obtenerProyectos() {
  const respuesta = await consultarAPI("/api/proyectos");

  if (!respuesta.exito || !Array.isArray(respuesta.datos)) {
    throw new Error("Formato de proyectos inesperado");
  }

  return respuesta.datos.map((p) => ({
    id: p.id_proyecto,
    nombre: p.nombre,
    descripcion: p.descripcion || "",
    categoria: p.categoria || "Sitio web",
    tecnologias: Array.isArray(p.tecnologias)
      ? p.tecnologias
      : [],
  }));
}

// GET /api/servicios
export async function obtenerServicios() {
  const datos = await consultarAPI("/api/servicios");

  if (!Array.isArray(datos)) {
    throw new Error("Formato de servicios inesperado");
  }

  return datos.map((s) => ({
    id: s.id_servicio,
    nombre: s.nombre,
    descripcion: s.descripcion || "",
    incluye: Array.isArray(s.caracteristicas)
      ? s.caracteristicas
      : String(s.caracteristicas || "")
          .split(/\r?\n/)
          .map((item) => item.trim())
          .filter(Boolean),
  }));
}

export async function obtenerTecnologias() {
  const respuesta = await consultarAPI("/api/tecnologias");

  if (!respuesta.exito || !Array.isArray(respuesta.datos)) {
    throw new Error("Formato de tecnologías inesperado");
  }

  return respuesta.datos;
}

export async function obtenerExperiencias() {
  const respuesta = await consultarAPI("/api/experiencias");

  if (!respuesta.exito || !Array.isArray(respuesta.datos)) {
    throw new Error("Formato de experiencias inesperado");
  }

  return respuesta.datos.map((experiencia) => ({
    id: experiencia.id_experiencia,
    titulo: experiencia.titulo,
    categoria: experiencia.categoria || "Experiencia",
    descripcion: experiencia.descripcion || "",
    fecha_inicio: experiencia.fecha_inicio,
    fecha_fin: experiencia.fecha_fin,
    estado: experiencia.estado,
  }));
}

export async function enviarConsulta(datos) {
  if (!API_URL) {
    throw new Error("Falta configurar REACT_APP_API_URL");
  }

  const respuesta = await fetch(`${API_URL}/api/contacto`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(datos),
  });

  const tipo = respuesta.headers.get("content-type") || "";

  if (!tipo.includes("application/json")) {
    throw new Error("El backend no devolvió JSON");
  }

  const resultado = await respuesta.json();

  if (!respuesta.ok || !resultado.exito) {
    throw new Error(
      resultado.mensaje ||
      `Error HTTP ${respuesta.status}`
    );
  }

  return resultado;
}

export async function iniciarSesion(email, contrasena) {
  if (!API_URL) {
    throw new Error("Falta configurar REACT_APP_API_URL");
  }

  const respuesta = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email,
      contrasena,
    }),
  });

  const datos = await respuesta.json().catch(() => null);

  if (!respuesta.ok || !datos?.exito) {
    throw new Error(
      datos?.error ||
      datos?.mensaje ||
      `Error HTTP ${respuesta.status}`
    );
  }

  return datos.usuario;
}

export async function obtenerSesionActual() {
  const respuesta = await fetch(`${API_URL}/api/auth/me`, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  const datos = await respuesta.json().catch(() => null);

  if (!respuesta.ok || !datos?.exito) {
    throw new Error(
      datos?.error || "No se pudo verificar la sesión"
    );
  }

  return datos.user;
}

export async function cerrarSesion() {
  if (!API_URL) {
    throw new Error("Falta configurar REACT_APP_API_URL");
  }

  const respuesta = await fetch(`${API_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  const datos = await respuesta.json();

  if (!respuesta.ok || !datos.exito) {
    throw new Error(
      datos.error || "No se pudo cerrar la sesión"
    );
  }

  return datos;
}
