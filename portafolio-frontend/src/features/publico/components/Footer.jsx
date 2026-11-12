
import { Link } from "react-router-dom";

// Enlaces de navegación del footer
const enlacesNavegacion = [
  { nombre: "Inicio", ruta: "/" },
  { nombre: "Sobre mí", ruta: "/sobre-mi" },
  { nombre: "Tecnologías", ruta: "/tecnologias" },
  { nombre: "Servicios", ruta: "/servicios" },
  { nombre: "Proyectos", ruta: "/proyectos" },
];

const enlacesAcceso = [
  { nombre: "Contacto", ruta: "/contacto" },
  { nombre: "Iniciar sesión", ruta: "/login" },
  { nombre: "Registrarse", ruta: "/registro" },
];

function Footer() {
  const anioActual = new Date().getFullYear();

  return (
    <footer className="footer-publico">

      <div className="container">

        <div className="row g-4">

          {/* COLUMNA 1: PRESENTACIÓN */}
          <div className="col-lg-5 col-md-12">

            <Link
              to="/"
              className="footer-brand"
            >
              Portfolio
              <span>.</span>
            </Link>

            <p className="footer-description">
              Desarrollo de soluciones digitales
              modernas, funcionales y adaptables
              a diferentes dispositivos.
            </p>

            <p className="footer-specialty">
              Desarrollo Web Fullstack
            </p>

          </div>

          {/* COLUMNA 2: NAVEGACIÓN */}
          <div className="col-lg-3 col-md-6">

            <nav aria-label="Navegación del pie de página">

              <h2 className="footer-title">
                Navegación
              </h2>

              <ul className="footer-links">

                {enlacesNavegacion.map((enlace) => (
                  <li key={enlace.ruta}>

                    <Link to={enlace.ruta}>
                      {enlace.nombre}
                    </Link>

                  </li>
                ))}

              </ul>

            </nav>

          </div>

          {/* COLUMNA 3: CONTACTO Y ACCESO */}
          <div className="col-lg-4 col-md-6">

            <nav aria-label="Contacto y acceso de usuarios">

              <h2 className="footer-title">
                Contacto y acceso
              </h2>

              <ul className="footer-links">

                {enlacesAcceso.map((enlace) => (
                  <li key={enlace.ruta}>

                    <Link to={enlace.ruta}>
                      {enlace.nombre}
                    </Link>

                  </li>
                ))}

              </ul>

            </nav>

            <p className="footer-contact-text">
              ¿Tenés un proyecto en mente?
              Conversemos sobre tu idea.
            </p>

            <Link
              to="/contacto"
              className="btn footer-contact-btn"
            >
              Contactarme
            </Link>

          </div>

        </div>

        {/* SEPARADOR */}
        <hr className="footer-divider" />

        {/* INFORMACIÓN INFERIOR */}
        <div className="footer-bottom">

          <p>
            © {anioActual} Portfolio.
            Todos los derechos reservados.
          </p>

          <p>
            Diseñado y desarrollado con React.
          </p>

        </div>

      </div>

    </footer>
  );
}

export default Footer;
