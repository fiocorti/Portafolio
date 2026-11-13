
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [cerrando, setCerrando] = useState(false);
  const [error, setError] = useState("");

  const {
    usuario,
    cargandoSesion,
    errorSesion,
    salir,
  } = useAuth();

  const cerrarMenu = () => {
    setMenuAbierto(false);
  };

  const manejarCerrarSesion = async () => {
    if (cerrando) return;

    try {
      setCerrando(true);
      setError("");

      await salir();

      cerrarMenu();
    } catch (err) {
      setError(err.message);
    } finally {
      setCerrando(false);
    }
  };

  // Enlaces del frontend público
  const enlaces = [
    { nombre: "Inicio", ruta: "/" },
    { nombre: "Sobre mí", ruta: "/sobre-mi" },
    { nombre: "Tecnologías", ruta: "/tecnologias" },
    { nombre: "Servicios", ruta: "/servicios" },
    { nombre: "Proyectos", ruta: "/proyectos" },
    { nombre: "Contacto", ruta: "/contacto" },
  ];

  // Verificar si la cuenta tiene permisos administrativos
  const esAdministrador = [
    "administrador",
    "admin",
    "operador"
  ].includes(
    String(usuario?.rol || "").toLowerCase()
  );

  // Dirección de la aplicación administrativa
  const urlPanelAdmin = process.env.REACT_APP_ADMIN_URL;


  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-publica sticky-top">
      <div className="container">

        <NavLink
          className="navbar-brand fw-bold"
          to="/"
          onClick={cerrarMenu}
        >
          Portfolio<span className="marca-punto">.</span>
        </NavLink>

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

        <div
          className={`collapse navbar-collapse ${
            menuAbierto ? "show" : ""
          }`}
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

            {usuario && (
              <li className="nav-item">
                <NavLink
                  to="/demos"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "activo" : ""}`
                  }
                  onClick={cerrarMenu}
                >
                  Demos
                </NavLink>
              </li>
            )}

            {/* Acceso al panel administrativo */}
            {esAdministrador && urlPanelAdmin && (
              <li className="nav-item">
                <a
                  href={urlPanelAdmin}
                  className="nav-link"
                  onClick={cerrarMenu}
                >
                  Panel administrativo
                </a>
              </li>
            )}



            {/* Mientras se comprueba la sesión */}
            {cargandoSesion ? (
              <li className="nav-item">
                <span className="nav-link">
                  Verificando sesión...
                </span>
              </li>
            ) : usuario ? (
              <>
                {/* Usuario autenticado */}
                <li className="nav-item">
                  <span className="nav-link">
                    Hola, {usuario.nombre}
                  </span>
                </li>

                <li className="nav-item">
                  <button
                    type="button"
                    className="btn btn-registro ms-lg-2"
                    disabled={cerrando}
                    onClick={manejarCerrarSesion}
                  >
                    {cerrando
                      ? "Cerrando..."
                      : "Cerrar sesión"}
                  </button>
                </li>
              </>
            ) : (
              <>
                {/* Visitante sin sesión */}
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
              </>
            )}

            {error && (
              <li className="nav-item">
                <span
                  className="nav-link text-warning"
                  role="alert"
                >
                  {error}
                </span>
              </li>
            )}

            {errorSesion && (
              <li className="nav-item">
                <span
                  className="nav-link text-warning"
                  role="status"
                >
                  {errorSesion}
                </span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
