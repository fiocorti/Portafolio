
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  iniciarSesion,
  obtenerSesionActual,
} from "../services/portafolioApi";

function Login() {
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);  

  
const manejarSubmit = async (event) => {
  event.preventDefault();

  if (enviando) return;

  setMensaje("");
  setError("");

  if (!email.trim() || !contrasena) {
    setError("Completá el correo y la contraseña.");
    return;
  }

  try {
    setEnviando(true);

    // Enviar credenciales al backend
    await iniciarSesion(email.trim(), contrasena);

    // Comprobar que se creó la sesión
    const usuario = await obtenerSesionActual();

    setContrasena("");

    setMensaje(
      `Sesión iniciada correctamente. Bienvenido/a, ${usuario.nombre}.`
    );

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
                      setMensaje("");
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
                      setMensaje("");
                    }}
                    autoComplete="current-password"
                    required
                  />
                </div>

                {/* MENSAJE TEMPORAL */}
                {mensaje && (
                  <p
                    className="auth-alert auth-alert-info"
                    role="status"
                  >
                    {mensaje}
                  </p>
                )}
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
                  {enviando ? "Iniciando sesión..." : "Ingresar"}
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
