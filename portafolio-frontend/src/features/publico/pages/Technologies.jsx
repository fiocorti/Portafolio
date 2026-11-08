
import { Link } from "react-router-dom";

// Tecnologías agrupadas por categoría
const categorias = [
  {
    nombre: "Frontend",
    descripcion:
      "Tecnologías utilizadas para construir interfaces visuales, interactivas y adaptables.",
    tecnologias: [
      {
        nombre: "HTML5",
        iniciales: "HTML",
        descripcion: "Estructura y contenido de páginas web.",
      },
      {
        nombre: "CSS3",
        iniciales: "CSS",
        descripcion: "Estilos, diseños y animaciones.",
      },
      {
        nombre: "JavaScript",
        iniciales: "JS",
        descripcion: "Interactividad y lógica del navegador.",
      },
      {
        nombre: "React",
        iniciales: "R",
        descripcion: "Desarrollo de interfaces mediante componentes.",
      },
      {
        nombre: "Bootstrap",
        iniciales: "B",
        descripcion: "Diseños responsive y componentes visuales.",
      },
    ],
  },
  {
    nombre: "Backend",
    descripcion:
      "Herramientas para desarrollar la lógica y los servicios de una aplicación.",
    tecnologias: [
      {
        nombre: "Node.js",
        iniciales: "N",
        descripcion: "Ejecución de JavaScript en el servidor.",
      },
      {
        nombre: "Express",
        iniciales: "EX",
        descripcion: "Desarrollo de APIs y rutas del servidor.",
      },
    ],
  },
  {
    nombre: "Bases de datos",
    descripcion:
      "Tecnologías utilizadas para almacenar y administrar información.",
    tecnologias: [
      {
        nombre: "MySQL",
        iniciales: "SQL",
        descripcion: "Gestión de bases de datos relacionales.",
      },
    ],
  },
  {
    nombre: "Herramientas",
    descripcion:
      "Aplicaciones que facilitan el desarrollo, las pruebas y el trabajo colaborativo.",
    tecnologias: [
      {
        nombre: "Git",
        iniciales: "G",
        descripcion: "Control de versiones del código.",
      },
      {
        nombre: "GitHub",
        iniciales: "GH",
        descripcion: "Alojamiento de repositorios y colaboración.",
      },
      {
        nombre: "Visual Studio Code",
        iniciales: "VS",
        descripcion: "Editor de código utilizado en el desarrollo.",
      },
      {
        nombre: "Postman",
        iniciales: "API",
        descripcion: "Pruebas de endpoints y APIs REST.",
      },
    ],
  },
];

function Technologies() {
  return (
    <main className="technologies-page">

      {/* SECCIÓN 1: PRESENTACIÓN */}
      <section className="technologies-hero">
        <div className="container">

          <p className="technologies-eyebrow">
            MI STACK TECNOLÓGICO
          </p>

          <h1 className="technologies-title">
            Tecnologías y <span>herramientas.</span>
          </h1>

          <p className="technologies-description">
            Conjunto de tecnologías que permiten desarrollar
            aplicaciones web completas, desde la interfaz
            visual hasta la lógica del servidor y la
            gestión de datos.
          </p>

        </div>
      </section>

      {/* SECCIÓN 2: CATEGORÍAS */}
      {categorias.map((categoria, indice) => (
        <section
          key={categoria.nombre}
          className={`technologies-section ${
            indice % 2 !== 0 ? "technologies-section-alt" : ""
          }`}
        >
          <div className="container">

            <div className="technologies-section-header">
              <h2>{categoria.nombre}</h2>
              <p>{categoria.descripcion}</p>
            </div>

            <div className="row g-4">
              {categoria.tecnologias.map((tecnologia) => (
                <div
                  className="col-sm-6 col-lg-4"
                  key={tecnologia.nombre}
                >
                  <article className="technology-card">

                    <div className="technology-icon">
                      {tecnologia.iniciales}
                    </div>

                    <h3>{tecnologia.nombre}</h3>

                    <p>{tecnologia.descripcion}</p>

                  </article>
                </div>
              ))}
            </div>

          </div>
        </section>
      ))}

      {/* SECCIÓN 3: METODOLOGÍA */}
      <section className="technologies-section">
        <div className="container">

          <div className="technologies-method">

            <p className="technologies-eyebrow">
              DESARROLLO FULLSTACK
            </p>

            <h2>
              Tecnologías que trabajan juntas
            </h2>

            <p>
              Una aplicación web combina diferentes
              herramientas: React permite construir
              la interfaz, Node.js y Express gestionan
              los servicios del servidor, y MySQL
              permite almacenar la información.
            </p>

            <div className="technologies-flow">
              <span>React</span>
              <span className="technologies-arrow">→</span>
              <span>Node.js + Express</span>
              <span className="technologies-arrow">→</span>
              <span>MySQL</span>
            </div>

            <Link
              to="/proyectos"
              className="btn technologies-btn"
            >
              Explorar proyectos
            </Link>

          </div>

        </div>
      </section>

    </main>
  );
}

export default Technologies;
