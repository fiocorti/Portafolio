
import { Link } from "react-router-dom";
import ServiceCard from "../components/ServiceCard";
import { useEffect, useRef, useState } from "react";
import { obtenerServicios } from "../services/portafolioApi";

// Datos de ejemplo de los servicios.
// Más adelante vendrán desde la API del backend.


// Etapas del proceso de trabajo
const etapas = [
  {
    numero: "01",
    titulo: "Consulta",
    descripcion:
      "Conversamos sobre la idea, los objetivos y las necesidades del proyecto.",
  },
  {
    numero: "02",
    titulo: "Planificación",
    descripcion:
      "Definimos las funcionalidades, tecnologías y etapas de desarrollo.",
  },
  {
    numero: "03",
    titulo: "Desarrollo",
    descripcion:
      "Construimos la solución aplicando las tecnologías seleccionadas.",
  },
];

function Services() {
  
const [servicios, setServicios] = useState([]);
const [cargando, setCargando] = useState(true);
const [error, setError] = useState("");

const carruselRef = useRef(null);

const desplazarServicios = (direccion) => {
  const contenedor = carruselRef.current;
  if (!contenedor) return;

  const tarjeta = contenedor.querySelector(
    ".services-carousel-item"
  );

  if (!tarjeta) return;

  const separacion =
    parseFloat(window.getComputedStyle(contenedor).gap) || 0;

  const distancia =
    tarjeta.getBoundingClientRect().width + separacion;

  const movimientoReducido = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  contenedor.scrollBy({
    left: direccion * distancia,
    behavior: movimientoReducido ? "auto" : "smooth",
  });
};


useEffect(() => {
  let activo = true;

  obtenerServicios()
    .then((datos) => {
      if (activo) setServicios(datos);
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

  return (
    <main className="services-page">
      
      {/* SECCIÓN 1: PRESENTACIÓN */}
      <section className="services-hero">
        <div className="container">

          <p className="services-eyebrow">
            SOLUCIONES DIGITALES
          </p>

          <h1 className="services-title">
            Mis <span>servicios.</span>
          </h1>

          <p className="services-description">
            Soluciones de desarrollo web orientadas
            a transformar ideas en aplicaciones
            modernas, funcionales y adaptables.
          </p>

          <Link
            to="/contacto"
            className="btn services-btn-primary"
          >
            Solicitar cotización
          </Link>

        </div>
      </section>

      {/* SECCIÓN 2: LISTADO DE SERVICIOS */}
      <section className="services-section">
        <div className="container">

          <p className="services-eyebrow">
            QUÉ PUEDO OFRECER
          </p>

          <h2 className="services-section-title">
            Servicios disponibles
          </h2>

          <p className="services-section-description">
            Diferentes soluciones adaptadas a las
            necesidades de cada proyecto.
          </p>
          {/* Estados de la petición */}
          {cargando && (
            <p>Cargando servicios...</p>
          )}

          {error && (
            <p role="alert">
              No se pudieron cargar los servicios: {error}
            </p>
          )}

        {/* Controles del carrusel */}
        {servicios.length > 1 && (
          <div className="services-carousel-controls">
            <button
              type="button"
              className="services-carousel-btn"
              aria-label="Ver servicios anteriores"
              aria-controls="services-carousel-track"
              onClick={() => desplazarServicios(-1)}
            >
              ←
            </button>

            <button
              type="button"
              className="services-carousel-btn"
              aria-label="Ver servicios siguientes"
              aria-controls="services-carousel-track"
              onClick={() => desplazarServicios(1)}
            >
              →
            </button>
          </div>
        )}

      {/* Tarjetas desplazables */}
      <div
        id="services-carousel-track"
        className="services-carousel-track"
        ref={carruselRef}
        role="region"
        aria-roledescription="carrusel"
        aria-label="Servicios disponibles"
        tabIndex={0}
      >
        {servicios.map((servicio, index) => (
          <div
            className="services-carousel-item"
            key={servicio.id}
          >
            <ServiceCard
              servicio={servicio}
              numero={index + 1}
            />
          </div>
        ))}
      </div>

        </div>
      </section>

      {/* SECCIÓN 3: PROCESO DE TRABAJO */}
      <section className="services-section services-section-alt">
        <div className="container">

          <p className="services-eyebrow">
            METODOLOGÍA
          </p>

          <h2 className="services-section-title">
            ¿Cómo trabajamos?
          </h2>

          <p className="services-section-description">
            Cada proyecto comienza con una idea
            y se desarrolla mediante un proceso
            organizado.
          </p>

          <div className="row g-4">

            {etapas.map((etapa) => (
              <div
                className="col-md-4"
                key={etapa.numero}
              >
                <article className="services-step">

                  <span className="services-step-number">
                    {etapa.numero}
                  </span>

                  <h3>{etapa.titulo}</h3>

                  <p>{etapa.descripcion}</p>

                </article>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* SECCIÓN 4: CONTACTO */}
      <section className="services-section">
        <div className="container">

          <div className="services-cta">

            <p className="services-eyebrow">
              EMPECEMOS
            </p>

            <h2>
              ¿Tenés un proyecto en mente?
            </h2>

            <p>
              Contame qué necesitás y conversemos
              sobre cómo desarrollar tu idea.
            </p>

            <Link
              to="/contacto"
              className="btn services-btn-primary"
            >
              Solicitar cotización
            </Link>

          </div>

        </div>
      </section>

    </main>
  );
}

export default Services;
