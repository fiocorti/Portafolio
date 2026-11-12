
import { useState } from "react";
import { Link } from "react-router-dom";
import { registrarUsuario } from "../services/portafolioApi";

function Register() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmar, setConfirmar] = useState("");

  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [apellido, setApellido] = useState("");
  const [enviando, setEnviando] = useState(false);

  const limpiarMensajes = () => {
    setError("");
    setMensaje("");
  };

  
  const manejarSubmit = async (event) => {
    event.preventDefault();

    if (enviando) return;

    setError("");
    setMensaje("");

    // Validaciones del formulario
    if (!nombre.trim()) {
      setError("Ingresá tu nombre.");
      return;
    }

    if (contrasena.length < 8) {
      setError(
        "La contraseña debe tener al menos 8 caracteres."
      );
      return;
    }

    if (new TextEncoder().encode(contrasena).length > 72) {
      setError(
        "La contraseña supera el máximo de 72 bytes permitido."
      );
      return;
    }

    if (contrasena !== confirmar) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    // Datos que espera el backend
    const nuevoUsuario = {
      nombre: nombre.trim(),
      apellido: apellido.trim() || null,
      email: email.trim().toLowerCase(),
      contrasena: contrasena,
    };

    try {
      setEnviando(true);

      // Enviar los datos al backend
      const respuesta = await registrarUsuario(nuevoUsuario);

      // Mostrar el resultado
      setMensaje(
        respuesta.message ||
        "Cuenta creada correctamente. Ya podés iniciar sesión."
      );

      // Limpiar el formulario
      setNombre("");
      setApellido("");
      setEmail("");
      setContrasena("");
      setConfirmar("");

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
                  UNITE AL PORTFOLIO
                </p>

                <h1>
                  Crear <span>cuenta.</span>
                </h1>

                <p>
                  Registrate para acceder a los detalles
                  de proyectos y demos interactivas.
                </p>
              </div>

              <form onSubmit={manejarSubmit}>

                {/* NOMBRE */}
                <div className="auth-field">
                  <label htmlFor="register-name">
                    Nombre
                  </label>

                  <input
                    type="text"
                    id="register-name"
                    className="auth-input"
                    placeholder="Ingresá tu nombre"
                    value={nombre}
                    onChange={(e) => {
                      setNombre(e.target.value);
                      limpiarMensajes();
                    }}
                    autoComplete="given-name"
                    maxLength={50}
                    required
                  />
                </div>
                {/* APELLIDO */}
                <div className="auth-field">
                  <label htmlFor="register-apellido">
                    Apellido (opcional)
                  </label>

                  <input
                    type="text"
                    id="register-apellido"
                    className="auth-input"
                    placeholder="Ingresá tu apellido"
                    value={apellido}
                    onChange={(e) => {
                      setApellido(e.target.value);
                      limpiarMensajes();
                    }}
                    autoComplete="family-name"
                    maxLength={50}
                  />
                </div>

                {/* CORREO */}
                <div className="auth-field">
                  <label htmlFor="register-email">
                    Correo electrónico
                  </label>

                  <input
                    type="email"
                    id="register-email"
                    className="auth-input"
                    placeholder="correo@ejemplo.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      limpiarMensajes();
                    }}
                    autoComplete="email"
                    required
                    maxLength={100}
                  />
                </div>

                {/* CONTRASEÑA */}
                <div className="auth-field">
                  <label htmlFor="register-password">
                    Contraseña
                  </label>

                  <input
                    type="password"
                    id="register-password"
                    className="auth-input"
                    placeholder="Mínimo 8 caracteres"
                    value={contrasena}
                    onChange={(e) => {
                      setContrasena(e.target.value);
                      limpiarMensajes();
                    }}
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />

                  <small className="auth-help">
                    Utilizá al menos 8 caracteres.
                  </small>
                </div>

                {/* CONFIRMAR CONTRASEÑA */}
                <div className="auth-field">
                  <label htmlFor="register-confirm">
                    Confirmar contraseña
                  </label>

                  <input
                    type="password"
                    id="register-confirm"
                    className="auth-input"
                    placeholder="Repetí tu contraseña"
                    value={confirmar}
                    onChange={(e) => {
                      setConfirmar(e.target.value);
                      limpiarMensajes();
                    }}
                    autoComplete="new-password"
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
                  disabled={enviando}
                >
                  {enviando ? "Registrando..." : "Registrarme"}
                </button>

              </form>

              <div className="auth-footer">
                <p>
                  ¿Ya tenés una cuenta?{" "}
                  <Link to="/login">
                    Iniciá sesión
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

export default Register;
