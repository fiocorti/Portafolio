
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function obtenerEnlaceSeguro(valor) {
  if (!valor) return null;

  try {
    const url = new URL(valor.trim());

    return ["http:", "https:"].includes(url.protocol)
      ? url.href
      : null;
  } catch {
    return null;
  }
}

function ProjectCard({ proyecto, numero, onVerDetalles }) {
  const { usuario, cargandoSesion } = useAuth();
  const [imagenFallida, setImagenFallida] = useState(false);

  const imagenUrl = obtenerEnlaceSeguro(proyecto.imagenUrl);

  const repositorioUrl = obtenerEnlaceSeguro(
    proyecto.repositorioUrl
  );

  const demoUrl = obtenerEnlaceSeguro(proyecto.demoUrl);

  return (
    <article className="project-card">

      {/* IMAGEN O NÚMERO */}
      <div className="project-card-preview">

        {imagenUrl && !imagenFallida ? (
          <img
            src={imagenUrl}
            alt={`Vista previa de ${proyecto.nombre}`}
            className="project-card-image"
            loading="lazy"
            onError={() => setImagenFallida(true)}
          />
        ) : (
          <span className="project-card-number">
            {String(numero).padStart(2, "0")}
          </span>
        )}

        <span className="project-card-category">
          {proyecto.categoria}
        </span>

      </div>

      {/* INFORMACIÓN PÚBLICA */}
      <div className="project-card-content">

        <h3>{proyecto.nombre}</h3>

        <p className="project-card-description">
          {proyecto.descripcion}
        </p>

        {/* TECNOLOGÍAS */}
        <div className="project-card-tags">
          {proyecto.tecnologias.map((tecnologia) => (
            <span key={tecnologia}>
              {tecnologia}
            </span>
          ))}
        </div>

        {/* BOTONES */}
        <div className="project-card-footer">

          {cargandoSesion ? (
            <p className="project-card-private">
              Verificando sesión...
            </p>
          ) : usuario ? (

            <div className="project-card-actions">

              <button
                type="button"
                className="project-card-button"
                onClick={() => onVerDetalles(proyecto)}
              >
                Ver detalles
              </button>

              {repositorioUrl && (
                <a
                  href={repositorioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-card-button"
                >
                  Ver repositorio
                </a>
              )}

              {demoUrl && (
                <a
                  href={demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-card-button"
                >
                  Ver demo
                </a>
              )}

            </div>

          ) : (
            <>
              <p className="project-card-private">
                <span aria-hidden="true">🔒</span>
                Requiere iniciar sesión
              </p>

              <Link
                to="/login"
                state={{ desde: "/proyectos" }}
                className="project-card-button"
              >
                Iniciar sesión para ver detalles
              </Link>
            </>
          )}

        </div>
      </div>
    </article>
  );
}

export default ProjectCard;
