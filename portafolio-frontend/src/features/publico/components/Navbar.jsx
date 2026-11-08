
import React, { useState } from "react";
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

        {/* NOMBRE PROVISIONAL */}
        <NavLink
          className="navbar-brand fw-bold"
          to="/"
          exact
          onClick={cerrarMenu}
        >
          Portfolio<span className="marca-punto">.</span>
        </NavLink>

        {/* BOTÓN DEL MENÚ MÓVIL */}
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

        {/* MENÚ DE NAVEGACIÓN */}
        <div
          className={`collapse navbar-collapse ${
            menuAbierto ? "show" : ""
          }`}
          id="menuPrincipal"
        >
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">

            {/* RECORRER LOS ENLACES */}
            {enlaces.map((enlace) => (
              <li
                className="nav-item"
                key={enlace.ruta}
              >
                <NavLink
                  to={enlace.ruta}
                  exact={enlace.ruta === "/"}
                  className="nav-link"
                  activeClassName="activo"
                  onClick={cerrarMenu}
                >
                  {enlace.nombre}
                </NavLink>
              </li>
            ))}

            {/* INICIAR SESIÓN */}
            <li className="nav-item">
              <NavLink
                to="/login"
                className="nav-link"
                activeClassName="activo"
                onClick={cerrarMenu}
              >
                Iniciar sesión
              </NavLink>
            </li>

            {/* REGISTRARSE */}
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
