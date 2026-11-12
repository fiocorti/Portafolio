
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProjectCard from "../components/ProjectCard";
import { obtenerProyectos } from "../services/portafolioApi";
import ProjectModal from "../components/ProjectModal";
import { useAuth } from "../context/AuthContext";

// Datos de ejemplo.
// Más adelante vendrán desde la API del backend.


// Opciones para filtrar los proyectos
const categorias = [
  "Todos",
  "Sitio web",
];

function Projects() {
  
const [proyectos, setProyectos] = useState([]);
const [cargando, setCargando] = useState(true);
const [error, setError] = useState("");

const [proyectoSeleccionado, setProyectoSeleccionado] =
  useState(null);

const { usuario, cargandoSesion } = useAuth();

const cerrarModal = useCallback(() => {
  setProyectoSeleccionado(null);
}, []);

// Si se cierra la sesión, cerrar también el modal.
useEffect(() => {
  if (!cargandoSesion && !usuario) {
    cerrarModal();
  }
}, [usuario, cargandoSesion, cerrarModal]);


useEffect(() => {
  let activo = true;

  obtenerProyectos()
    .then((datos) => {
      if (activo) setProyectos(datos);
    })
    .catch((err) => {
      if (activo) setError(err.message);
    })
    .finally(() => {
      if (activo) setCargando(false);
    });

  return () => {
    activo = false;
  };
  }, []);
    
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


          {/* Filtros y acceso a demos */}
          <div className="projects-filters">

            <div
              className="projects-filter-group"
              role="group"
              aria-label="Filtrar proyectos"
            >
              {categorias.map((categoria) => (
                <button
                  key={categoria}
                  type="button"
                  className={`projects-filter-btn ${
                    filtroActivo === categoria ? "active" : ""
                  }`}
                  aria-pressed={filtroActivo === categoria}
                  onClick={() => setFiltroActivo(categoria)}
                >
                  {categoria === "Todos"
                    ? "Todos"
                    : "Sitios web"}
                </button>
              ))}
            </div>

            {/* Acceso a las demos interactivas */}
            <Link
              to="/demos"
              className="projects-filter-btn projects-demos-link"
            >
              Ver demos interactivas
            </Link>

          </div>

          {/* Estados de la petición */}
          {cargando && (
            <p>Cargando proyectos...</p>
          )}

          {error && (
            <p role="alert">
              No se pudieron cargar los proyectos: {error}
            </p>
          )}
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
                  onVerDetalles={setProyectoSeleccionado}
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

      {/* MODAL DE DETALLES */}
      {usuario && proyectoSeleccionado && (
        <ProjectModal
          key={proyectoSeleccionado.id}
          proyecto={proyectoSeleccionado}
          onClose={cerrarModal}
        />
      )}

    </main>
  );
}

export default Projects;
