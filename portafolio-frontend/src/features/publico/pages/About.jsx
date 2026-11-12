
import { Link } from "react-router-dom";

// Especialidades del desarrollador
const especialidades = [
  {
    titulo: "Desarrollo Frontend",
    descripcion:
      "Creación de interfaces modernas, intuitivas y adaptables a diferentes dispositivos.",
    tecnologias: [
      "HTML5",
      "CSS3",
      "JavaScript",
      "React",
      "Bootstrap",
    ],
  },
  {
    titulo: "Desarrollo Backend",
    descripcion:
      "Desarrollo de APIs, lógica del servidor y gestión de bases de datos.",
    tecnologias: [
      "Node.js",
      "Express",
      "MySQL",
    ],
  },
];

// Contenido de ejemplo, editable más adelante
const experiencias = [
  {
    categoria: "PROYECTOS ACADÉMICOS",
    titulo: "Desarrollo de aplicaciones web",
    descripcion:
      "Participación en proyectos de desarrollo web, aplicando conocimientos de frontend, backend y bases de datos.",
  },
  {
    categoria: "APRENDIZAJE Y PRÁCTICA",
    titulo: "Integración de tecnologías",
    descripcion:
      "Práctica en construcción de interfaces, consumo de APIs y desarrollo de soluciones web completas.",
  },
];

function About() {
  return (
    <main className="about-page">

      {/* SECCIÓN 1: PRESENTACIÓN PERSONAL */}
      <section className="about-hero">
        <div className="container">

          <p className="about-eyebrow">
            CONOCÉ MÁS SOBRE MÍ
          </p>

          <h1 className="about-title">
            Sobre <span>mí.</span>
          </h1>

          <div className="row align-items-center g-5">

            <div className="col-lg-5">
              <div className="about-profile-card">
                <div className="about-profile-icon">
                  {"</>"}
                </div>

                <p>FULLSTACK DEVELOPER</p>

                <div className="about-profile-tags">
                  <span>Frontend</span>
                  <span>Backend</span>
                  <span>UI/UX</span>
                </div>
              </div>
            </div>

            <div className="col-lg-7">
              <div className="about-intro">

                <h2>
                  Desarrollo soluciones que combinan
                  <span> diseño y tecnología.</span>
                </h2>

                <p>
                  Me apasiona el desarrollo web y la
                  creación de aplicaciones que brindan
                  soluciones a necesidades reales.
                </p>

                <p>
                  Me interesa tanto el diseño de
                  interfaces como la lógica que permite
                  el funcionamiento de una aplicación.
                </p>

                <p>
                  Busco desarrollar experiencias
                  digitales modernas, accesibles y
                  adaptables a distintos dispositivos.
                </p>

                <Link
                  to="/proyectos"
                  className="btn about-btn-primary"
                >
                  Explorar proyectos
                </Link>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECCIÓN 2: ESPECIALIDADES */}
      <section className="about-section about-section-alt">
        <div className="container">

          <p className="about-eyebrow">
            MIS CONOCIMIENTOS
          </p>

          <h2 className="about-section-title">
            Mis especialidades
          </h2>

          <p className="about-section-description">
            Tecnologías y herramientas utilizadas
            para construir aplicaciones web.
          </p>

          <div className="row g-4">
            {especialidades.map((especialidad) => (
              <div
                className="col-md-6"
                key={especialidad.titulo}
              >
                <article className="about-specialty-card">

                  <h3>{especialidad.titulo}</h3>

                  <p>{especialidad.descripcion}</p>

                  <div className="about-tags">
                    {especialidad.tecnologias.map(
                      (tecnologia) => (
                        <span key={tecnologia}>
                          {tecnologia}
                        </span>
                      )
                    )}
                  </div>

                </article>
              </div>
            ))}
          </div>

          <Link
            to="/tecnologias"
            className="about-text-link"
          >
            Conocer todas las tecnologías
          </Link>

        </div>
      </section>

      {/* SECCIÓN 3: EXPERIENCIA */}
      <section className="about-section">
        <div className="container">

          <p className="about-eyebrow">
            MI RECORRIDO
          </p>

          <h2 className="about-section-title">
            Experiencia y formación
          </h2>

          <p className="about-section-description">
            Un recorrido de aprendizaje, práctica
            y desarrollo de proyectos.
          </p>

          <div className="about-timeline">

            {experiencias.map((experiencia) => (
              <article
                className="about-experience"
                key={experiencia.titulo}
              >
                <span className="about-experience-dot" />

                <div className="about-experience-content">

                  <p className="about-experience-category">
                    {experiencia.categoria}
                  </p>

                  <h3>{experiencia.titulo}</h3>

                  <p>{experiencia.descripcion}</p>

                </div>
              </article>
            ))}

          </div>

        </div>
      </section>

      {/* SECCIÓN 4: CONTACTO */}
      <section className="about-section about-section-alt">
        <div className="container">

          <div className="about-cta">

            <p className="about-eyebrow">
              CONTACTO
            </p>

            <h2>
              ¿Trabajamos en tu próxima idea?
            </h2>

            <p>
              Si tenés una propuesta o necesitás
              desarrollar una solución web,
              podemos conversar.
            </p>

            <Link
              to="/contacto"
              className="btn about-btn-primary"
            >
              Contactarme
            </Link>

          </div>

        </div>
      </section>

    </main>
  );
}

export default About;
