
import { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mensaje, setMensaje] = useState("");

  const manejarSubmit = (event) => {
    event.preventDefault();

    // Por ahora, solo validamos los campos.
    // Más adelante conectaremos la API de autenticación.

    if (!email.trim() || !contrasena) {
      return;
    }

    setMensaje(
      "Formulario validado. Falta conectar el inicio de sesión con el servidor."
    );
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

                <button
                  type="submit"
                  className="btn auth-submit"
                >
                  Ingresar
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
