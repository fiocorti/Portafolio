

import { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  // Obtener el estado global de autenticación
  const {
    usuario,
    cargandoSesion,
    entrar,
  } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  // Recuperar la página que el visitante quería abrir
  const desde = location.state?.desde;

  // Solo permitir rutas internas del portafolio
  const destino =
    typeof desde === "string" &&
    desde.startsWith("/") &&
    !desde.startsWith("//")
      ? desde
      : "/";


  const manejarSubmit = async (event) => {
    event.preventDefault();

    if (enviando) return;

    setError("");

    if (!email.trim() || !contrasena) {
      setError("Completá el correo y la contraseña.");
      return;
    }

    try {
      setEnviando(true);


      // Iniciar sesión y obtener el usuario autenticado

    const usuarioAutenticado = await entrar(
      email.trim(),
      contrasena
    );

    setContrasena("");

    const rol = String(
      usuarioAutenticado?.rol || ""
    ).toLowerCase();

    const esAdministrador = [
      "administrador",
      "admin",
      "operador"
    ].includes(rol);

    // Administradores: ir al inicio público.
    // Usuarios comunes: continuar a la página solicitada.
    navigate(esAdministrador ? "/" : destino, {
      replace: true
    });



    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-9 col-lg-6 col-xl-5">

            <div className="auth-card">
              <div className="auth-header">
                <p className="auth-eyebrow">
                  BIENVENIDO NUEVAMENTE
                </p>

                <h1>
                  Iniciar <span>sesión.</span>
                </h1>

                <p>
                  Ingresá con tu cuenta para acceder
                  a los proyectos y demos.
                </p>
              </div>

              {cargandoSesion ? (
                <p
                  className="auth-alert auth-alert-info"
                  role="status"
                >
                  Verificando sesión...
                </p>
              ) : usuario ? (
                <p
                  className="auth-alert auth-alert-info"
                  role="status"
                >
                  Sesión iniciada correctamente.
                  Bienvenido/a, {usuario.nombre}.
                  Podés cerrar sesión desde el menú
                  de navegación.
                </p>
              ) : (
                <>
                  <form onSubmit={manejarSubmit}>

                    {/* CORREO */}
                    <div className="auth-field">
                      <label htmlFor="login-email">
                        Correo electrónico
                      </label>

                      <input
                        type="email"
                        id="login-email"
                        className="auth-input"
                        placeholder="correo@ejemplo.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setError("");
                        }}
                        autoComplete="email"
                        required
                      />
                    </div>

                    {/* CONTRASEÑA */}
                    <div className="auth-field">
                      <label htmlFor="login-password">
                        Contraseña
                      </label>

                      <input
                        type="password"
                        id="login-password"
                        className="auth-input"
                        placeholder="Ingresá tu contraseña"
                        value={contrasena}
                        onChange={(e) => {
                          setContrasena(e.target.value);
                          setError("");
                        }}
                        autoComplete="current-password"
                        required
                      />
                    </div>

                    {/* ERRORES */}
                    {error && (
                      <p
                        className="auth-alert auth-alert-error"
                        role="alert"
                      >
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      className="btn auth-submit"
                      disabled={enviando}
                    >
                      {enviando
                        ? "Iniciando sesión..."
                        : "Ingresar"}
                    </button>

                  </form>

                  <div className="auth-footer">
                    <p>
                      ¿Todavía no tenés una cuenta?{" "}
                      <Link to="/registro">
                        Registrate
                      </Link>
                    </p>
                  </div>
                </>
              )}
            </div>

            <Link
              to="/"
              className="auth-back-link"
            >
              ← Volver al inicio
            </Link>

          </div>
        </div>
      </div>
    </main>
  );
}

export default Login;
