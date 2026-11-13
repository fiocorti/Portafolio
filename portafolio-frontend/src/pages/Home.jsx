
import { Link } from "react-router-dom";

// Tecnologías que mostraremos en el inicio
const tecnologias = [
  "HTML5",
  "CSS3",
  "JavaScript",
  "React",
  "Node.js",
  "MySQL",
];

// Servicios destacados
const servicios = [
  {
    titulo: "Desarrollo Frontend",
    descripcion:
      "Interfaces modernas, intuitivas y adaptables a diferentes dispositivos.",
  },
  {
    titulo: "Desarrollo Backend",
    descripcion:
      "APIs, bases de datos y lógica para aplicaciones web.",
  },
  {
    titulo: "Soluciones Fullstack",
    descripcion:
      "Desarrollo integral de aplicaciones, desde la interfaz hasta el servidor.",
  },
];

function Home() {
  return (
    <main className="home-page">

      {/* SECCIÓN 1: PRESENTACIÓN */}
      <section className="home-hero">
        <div className="container">
          <div className="row align-items-center g-5">

            <div className="col-lg-7 home-intro">
              <p className="home-eyebrow">
                DESARROLLO WEB FULLSTACK
              </p>

              <h1 className="home-title">
                Ideas que se convierten en{" "}
                <span>soluciones digitales.</span>
              </h1>

              <p className="home-description">
                Diseño y desarrollo experiencias web
                modernas, funcionales y adaptables
                a cualquier dispositivo.
              </p>

              <div className="home-actions">
                <Link
                  to="/proyectos"
                  className="btn home-btn-primary"
                >
                  Explorar proyectos
                </Link>

                <Link
                  to="/contacto"
                  className="btn home-btn-secondary"
                >
                  Contactar
                </Link>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="home-feature-card">
                <p className="home-feature-label">
                  Desarrollo integral
                </p>

                <h2>
                  Diseño, código y creatividad.
                </h2>

                <p>
                  Soluciones que combinan experiencia
                  de usuario, tecnología y funcionalidad.
                </p>

                <div className="home-feature-tags">
                  <span>Frontend</span>
                  <span>Backend</span>
                  <span>Responsive</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECCIÓN 2: TECNOLOGÍAS */}
      <section className="home-section">
        <div className="container">

          <p className="home-eyebrow">
            HERRAMIENTAS
          </p>

          <h2 className="home-section-title">
            Tecnologías
          </h2>

          <p className="home-section-description">
            Herramientas utilizadas para desarrollar
            soluciones web completas.
          </p>

          <div className="home-skills">
            {tecnologias.map((tecnologia) => (
              <span
                key={tecnologia}
                className="home-skill"
              >
                {tecnologia}
              </span>
            ))}
          </div>

          <Link
            to="/tecnologias"
            className="home-text-link"
          >
            Ver tecnologías
          </Link>

        </div>
      </section>

      {/* SECCIÓN 3: SERVICIOS */}
      <section className="home-section home-section-alt">
        <div className="container">

          <p className="home-eyebrow">
            QUÉ PUEDO HACER
          </p>

          <h2 className="home-section-title">
            Servicios
          </h2>

          <p className="home-section-description">
            Servicios orientados al desarrollo
            de aplicaciones web.
          </p>

          <div className="row g-4">
            {servicios.map((servicio) => (
              <div
                className="col-md-6 col-lg-4"
                key={servicio.titulo}
              >
                <article className="home-service-card">
                  <h3>{servicio.titulo}</h3>
                  <p>{servicio.descripcion}</p>
                </article>
              </div>
            ))}
          </div>

          <Link
            to="/servicios"
            className="home-text-link"
          >
            Ver todos los servicios
          </Link>

        </div>
      </section>

      {/* SECCIÓN 4: CONTACTO */}
      <section className="home-section">
        <div className="container">

          <div className="home-cta">
            <div>
              <p className="home-eyebrow">
                TRABAJEMOS JUNTOS
              </p>

              <h2>
                ¿Tenés un proyecto en mente?
              </h2>

              <p>
                Conversemos sobre tus ideas y
                cómo transformarlas en una solución web.
              </p>
            </div>

            <Link
              to="/contacto"
              className="btn home-btn-primary"
            >
              Ir a contacto
            </Link>
          </div>

        </div>
      </section>

    </main>
  );
}

export default Home;
