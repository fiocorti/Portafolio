
import { Link } from "react-router-dom";

// Proyecto de ejemplo para diseñar la interfaz.
// Luego reemplazaremos estos datos por los del backend.

const proyectoEjemplo = {
  id: 2,
  nombre: "Gestor de tareas",
  categoria: "Aplicación web",

  resumen:
    "Aplicación web para organizar actividades y administrar tareas de manera sencilla.",

  objetivo:
    "Facilitar la organización de tareas mediante una interfaz intuitiva y un sistema de seguimiento de actividades.",

  descripcion:
    "El proyecto propone una aplicación en la que los usuarios puedan crear tareas, modificar su información y organizarlas según su estado. La solución integra una interfaz desarrollada con React y un servidor encargado de gestionar los datos.",

  tecnologias: [
    "React",
    "Bootstrap",
    "Node.js",
    "Express",
    "MySQL",
  ],

  funcionalidades: [
    "Crear nuevas tareas",
    "Editar información de tareas",
    "Eliminar tareas",
    "Organizar tareas por estado",
    "Consultar tareas registradas",
    "Interfaz adaptable a distintos dispositivos",
  ],
};

function ProjectDetail() {
  const proyecto = proyectoEjemplo;

  return (
    <main className="project-detail-page">

      {/* SECCIÓN 1: PRESENTACIÓN */}
      <section className="project-detail-hero">
        <div className="container">

          <Link
            to="/proyectos"
            className="project-detail-back"
          >
            ← Volver a proyectos
          </Link>

          <p className="project-detail-eyebrow">
            DETALLE DEL PROYECTO
          </p>

          <h1 className="project-detail-title">
            {proyecto.nombre}
            <span>.</span>
          </h1>

          <p className="project-detail-description">
            {proyecto.resumen}
          </p>

          <div className="project-detail-tags">
            {proyecto.tecnologias.map((tecnologia) => (
              <span key={tecnologia}>
                {tecnologia}
              </span>
            ))}
          </div>

          <p className="project-detail-notice">
            Vista previa de diseño con datos de ejemplo.
            La autenticación todavía no está integrada.
          </p>

        </div>
      </section>

      {/* SECCIÓN 2: VISTA PREVIA */}
      <section className="project-detail-section">
        <div className="container">

          <div className="project-detail-preview">

            <div className="project-detail-preview-header">
              <span className="project-detail-dot"></span>
              <span className="project-detail-dot"></span>
              <span className="project-detail-dot"></span>
            </div>

            <div className="project-detail-preview-body">

              <h2>Panel de tareas</h2>

              <p>
                Ejemplo visual de la aplicación
              </p>

              <div className="row g-3">

                {[
                  {
                    titulo: "Pendientes",
                    tareas: [
                      "Diseñar interfaz",
                      "Crear API",
                    ],
                  },
                  {
                    titulo: "En proceso",
                    tareas: [
                      "Base de datos",
                    ],
                  },
                  {
                    titulo: "Completadas",
                    tareas: [
                      "Planificación",
                    ],
                  },
                ].map((columna) => (
                  <div
                    className="col-md-4"
                    key={columna.titulo}
                  >
                    <div className="project-detail-column">

                      <h3>{columna.titulo}</h3>

                      {columna.tareas.map((tarea) => (
                        <div
                          className="project-detail-task"
                          key={tarea}
                        >
                          {tarea}
                        </div>
                      ))}

                    </div>
                  </div>
                ))}

              </div>

            </div>

          </div>

          <p className="project-detail-caption">
            Representación visual ilustrativa.
            No es una demo funcional.
          </p>

        </div>
      </section>

      {/* SECCIÓN 3: INFORMACIÓN */}
      <section className="project-detail-section project-detail-alt">
        <div className="container">

          <div className="row g-5">

            <div className="col-lg-6">

              <p className="project-detail-eyebrow">
                SOBRE EL PROYECTO
              </p>

              <h2 className="project-detail-subtitle">
                Descripción general
              </h2>

              <p className="project-detail-text">
                {proyecto.descripcion}
              </p>

              <h3 className="project-detail-small-title">
                Objetivo
              </h3>

              <p className="project-detail-text">
                {proyecto.objetivo}
              </p>

            </div>

            <div className="col-lg-6">

              <p className="project-detail-eyebrow">
                CARACTERÍSTICAS
              </p>

              <h2 className="project-detail-subtitle">
                Funcionalidades principales
              </h2>

              <ul className="project-detail-features">
                {proyecto.funcionalidades.map(
                  (funcionalidad) => (
                    <li key={funcionalidad}>
                      <span aria-hidden="true">✓</span>
                      {funcionalidad}
                    </li>
                  )
                )}
              </ul>

            </div>

          </div>

        </div>
      </section>

      {/* SECCIÓN 4: DEMO */}
      <section className="project-detail-section">
        <div className="container">

          <div className="project-detail-cta">

            <p className="project-detail-eyebrow">
              DEMOSTRACIÓN
            </p>

            <h2>
              Explorá el proyecto en acción
            </h2>

            <p>
              Próximamente podrás acceder
              a una demostración interactiva
              de este proyecto.
            </p>

            <button
              type="button"
              className="btn project-detail-btn"
              disabled
            >
              Demo próximamente
            </button>

          </div>

        </div>
      </section>

    </main>
  );
}

export default ProjectDetail;
