
import { useState } from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const cerrarMenu = () => {
    setMenuAbierto(false);
  };

  const enlaces = [
    { nombre: "Inicio", ruta: "/" },
    { nombre: "Sobre mí", ruta: "/sobre-mi" },
    { nombre: "Tecnologías", ruta: "/tecnologias" },
    { nombre: "Servicios", ruta: "/servicios" },
    { nombre: "Proyectos", ruta: "/proyectos" },
    { nombre: "Contacto", ruta: "/contacto" },
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-publica sticky-top">
      <div className="container">

        {/* Nombre provisional del portfolio */}
        <NavLink
          className="navbar-brand fw-bold"
          to="/"
          onClick={cerrarMenu}
        >
          Portfolio<span className="marca-punto">.</span>
        </NavLink>



        {/* Botón del menú en celulares */}
        <button
          className="navbar-toggler"
          type="button"
          aria-controls="menuPrincipal"
          aria-expanded={menuAbierto}
          aria-label="Abrir o cerrar menú"
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Enlaces de navegación */}
        <div
          className={`collapse navbar-collapse ${menuAbierto ? "show" : ""}`}
          id="menuPrincipal"
        >
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">

            {enlaces.map((enlace) => (
              <li className="nav-item" key={enlace.ruta}>
                <NavLink
                  to={enlace.ruta}
                  end={enlace.ruta === "/"}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "activo" : ""}`
                  }
                  onClick={cerrarMenu}
                >
                  {enlace.nombre}
                </NavLink>
              </li>
            ))}

            <li className="nav-item">
              <NavLink
                to="/login"
                className="nav-link"
                onClick={cerrarMenu}
              >
                Iniciar sesión
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/registro"
                className="btn btn-registro ms-lg-2"
                onClick={cerrarMenu}
              >
                Registrarse
              </NavLink>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
