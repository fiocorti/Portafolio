
import { useState } from "react";
import { Link } from "react-router-dom";
import ProjectCard from "../components/ProjectCard";

// Datos de ejemplo.
// Más adelante vendrán desde la API del backend.

const proyectos = [
  {
    id: 1,
    nombre: "Portfolio profesional",
    categoria: "Sitio web",
    descripcion:
      "Sitio web para presentar un perfil profesional, sus servicios, tecnologías y proyectos.",
    tecnologias: [
      "React",
      "Bootstrap",
      "CSS3",
    ],
  },
  {
    id: 2,
    nombre: "Gestor de tareas",
    categoria: "Sitio web",
    descripcion:
      "Aplicación para organizar tareas, administrar actividades y realizar un seguimiento de pendientes.",
    tecnologias: [
      "React",
      "Node.js",
      "MySQL",
    ],
  },
  {
    id: 3,
    nombre: "Explorador de GitHub",
    categoria: "Demo interactiva",
    descripcion:
      "Aplicación que permite consultar información pública de repositorios utilizando la API de GitHub.",
    tecnologias: [
      "React",
      "JavaScript",
      "GitHub API",
    ],
  },
  {
    id: 4,
    nombre: "Aplicación del clima",
    categoria: "Demo interactiva",
    descripcion:
      "Aplicación para consultar información meteorológica de diferentes ciudades mediante una API externa.",
    tecnologias: [
      "React",
      "JavaScript",
      "Open-Meteo API",
    ],
  },
];

// Opciones para filtrar los proyectos
const categorias = [
  "Todos",
  "Sitio web",
  "Demo interactiva",
];

function Projects() {
  const [filtroActivo, setFiltroActivo] =
    useState("Todos");

  // Filtrar según la categoría seleccionada
  const proyectosFiltrados = proyectos.filter(
    (proyecto) =>
      filtroActivo === "Todos" ||
      proyecto.categoria === filtroActivo
  );

  return (
    <main className="projects-page">

      {/* SECCIÓN 1: PRESENTACIÓN */}
      <section className="projects-hero">
        <div className="container">

          <p className="projects-eyebrow">
            MIS TRABAJOS
          </p>

          <h1 className="projects-title">
            Proyectos y <span>demos.</span>
          </h1>

          <p className="projects-description">
            Explorá diferentes proyectos y
            demostraciones que combinan diseño,
            desarrollo web y tecnología.
          </p>

          <div className="projects-access-info">
            <span aria-hidden="true">🔒</span>

            <p>
              Para visualizar los detalles completos
              y acceder a las demos, es necesario
              registrarse e iniciar sesión.
            </p>
          </div>

        </div>
      </section>

      {/* SECCIÓN 2: LISTADO DE PROYECTOS */}
      <section className="projects-section">
        <div className="container">

          <p className="projects-eyebrow">
            EXPLORÁ MIS PROYECTOS
          </p>

          <h2 className="projects-section-title">
            Trabajos destacados
          </h2>

          <p className="projects-section-description">
            Una selección de proyectos web
            y demostraciones interactivas.
          </p>

          {/* Filtros */}
          <div
            className="projects-filters"
            role="group"
            aria-label="Filtrar proyectos"
          >
            {categorias.map((categoria) => (
              <button
                key={categoria}
                type="button"
                className={`projects-filter-btn ${
                  filtroActivo === categoria
                    ? "active"
                    : ""
                }`}
                aria-pressed={
                  filtroActivo === categoria
                }
                onClick={() =>
                  setFiltroActivo(categoria)
                }
              >
                {categoria === "Todos"
                  ? "Todos"
                  : categoria === "Sitio web"
                  ? "Sitios web"
                  : "Demos"}
              </button>
            ))}
          </div>

          {/* Tarjetas */}
          <div className="row g-4">

            {proyectosFiltrados.map(
              (proyecto, index) => (
                <div
                  className="col-md-6"
                  key={proyecto.id}
                >
                  <ProjectCard
                    proyecto={proyecto}
                    numero={proyecto.id}
                  />
                </div>
              )
            )}

          </div>

          <p
            className="projects-result-count"
            aria-live="polite"
          >
            Mostrando {proyectosFiltrados.length}
            {" "}
            {proyectosFiltrados.length === 1
              ? "proyecto"
              : "proyectos"}
          </p>

        </div>
      </section>

      {/* SECCIÓN 3: REGISTRO */}
      <section className="projects-section projects-section-alt">
        <div className="container">

          <div className="projects-cta">

            <p className="projects-eyebrow">
              ACCESO A PROYECTOS
            </p>

            <h2>
              Descubrí los proyectos completos
            </h2>

            <p>
              Creá una cuenta para acceder
              a información detallada y
              demostraciones interactivas.
            </p>

            <div className="projects-cta-actions">

              <Link
                to="/registro"
                className="btn projects-btn-primary"
              >
                Crear cuenta
              </Link>

              <Link
                to="/login"
                className="btn projects-btn-secondary"
              >
                Ya tengo una cuenta
              </Link>

            </div>

          </div>

        </div>
      </section>

    </main>
  );
}

export default Projects;
