
import { Link } from "react-router-dom";
import ServiceCard from "../components/ServiceCard";

// Datos de ejemplo de los servicios.
// Más adelante vendrán desde la API del backend.

const servicios = [
  {
    id: 1,
    nombre: "Desarrollo Frontend",
    descripcion:
      "Diseño y desarrollo de interfaces web modernas, intuitivas y adaptables a distintos dispositivos.",
    incluye: [
      "Diseño de interfaces responsive",
      "Desarrollo con React",
      "Interactividad con JavaScript",
      "Estilos y animaciones CSS",
    ],
  },
  {
    id: 2,
    nombre: "Desarrollo Backend",
    descripcion:
      "Construcción de la lógica del servidor y servicios que permiten el funcionamiento de aplicaciones web.",
    incluye: [
      "Desarrollo de APIs REST",
      "Integración con bases de datos",
      "Lógica del servidor",
      "Validación de datos",
    ],
  },
  {
    id: 3,
    nombre: "Desarrollo Fullstack",
    descripcion:
      "Creación de aplicaciones web completas, integrando la interfaz visual con el servidor y la base de datos.",
    incluye: [
      "Desarrollo frontend y backend",
      "Integración de APIs",
      "Gestión de bases de datos",
      "Implementación de funcionalidades",
    ],
  },
  {
    id: 4,
    nombre: "Asesoría técnica",
    descripcion:
      "Orientación para planificar proyectos web, elegir tecnologías y resolver necesidades técnicas.",
    incluye: [
      "Análisis de requerimientos",
      "Recomendación de tecnologías",
      "Planificación de proyectos",
      "Orientación técnica",
    ],
  },
];

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

          <div className="row g-4">

            {servicios.map((servicio, index) => (
              <div
                className="col-md-6"
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
