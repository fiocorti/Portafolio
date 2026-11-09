
import { Link } from "react-router-dom";

function ProjectCard({ proyecto, numero }) {
  return (
    <article className="project-card">

      {/* Vista visual del proyecto */}
      <div className="project-card-preview">
        <span className="project-card-number">
          {String(numero).padStart(2, "0")}
        </span>

        <span className="project-card-category">
          {proyecto.categoria}
        </span>
      </div>

      {/* Información pública */}
      <div className="project-card-content">

        <h3>{proyecto.nombre}</h3>

        <p className="project-card-description">
          {proyecto.descripcion}
        </p>

        {/* Tecnologías utilizadas */}
        <div className="project-card-tags">
          {proyecto.tecnologias.map((tecnologia) => (
            <span key={tecnologia}>
              {tecnologia}
            </span>
          ))}
        </div>

        {/* Acceso restringido */}
        <div className="project-card-footer">

          <p className="project-card-private">
            <span aria-hidden="true">🔒</span>
            Requiere iniciar sesión
          </p>

          <Link
            to="/login"
            className="project-card-button"
          >
            Iniciar sesión para ver detalles
          </Link>

        </div>

      </div>

    </article>
  );
}

export default ProjectCard;
