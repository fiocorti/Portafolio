
export async function obtenerRepositorios(usuario) {
  const nombreUsuario = usuario.trim();

  // Validar el nombre de usuario
  const formatoValido =
    /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(
      nombreUsuario
    );

  if (
    !formatoValido ||
    nombreUsuario.includes("--")
  ) {
    throw new Error(
      "Ingresá un nombre de usuario de GitHub válido."
    );
  }

  // URL de la API de GitHub
  const url =
    `https://api.github.com/users/${encodeURIComponent(nombreUsuario)}/repos?sort=updated&per_page=20`;

  const respuesta = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
    },
  });

  // Manejo de errores HTTP
  if (respuesta.status === 404) {
    throw new Error(
      "No se encontró el usuario de GitHub."
    );
  }

  if (
    respuesta.status === 429 ||
    (respuesta.status === 403 &&
      respuesta.headers.get("x-ratelimit-remaining") === "0")
  ) {
    throw new Error(
      "Se alcanzó el límite de consultas de GitHub. Intentá más tarde."
    );
  }

  if (!respuesta.ok) {
    throw new Error(
      "No se pudieron obtener los repositorios."
    );
  }

  // Convertir la respuesta JSON
  const datos = await respuesta.json();

  // Devolver solamente los campos necesarios
  return datos.map((repositorio) => ({
    id: repositorio.id,
    nombre: repositorio.name,
    descripcion:
      repositorio.description || "Sin descripción.",
    lenguaje:
      repositorio.language || "No especificado",
    estrellas: repositorio.stargazers_count,
    url: repositorio.html_url,
  }));
}
