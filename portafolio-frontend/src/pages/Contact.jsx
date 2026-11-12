
import { useState } from "react";
import { enviarConsulta } from "../services/portafolioApi";

// Tipos de consultas disponibles
const tiposConsulta = [
  {
    valor: "general",
    nombre: "Consulta general",
  },
  {
    valor: "cotizacion",
    nombre: "Cotización de proyecto",
  },
  {
    valor: "asesoria",
    nombre: "Asesoría técnica",
  },
];

// Valores iniciales del formulario
const formularioInicial = {
  nombre: "",
  email: "",
  tipo: "",
  asunto: "",
  mensaje: "",
};

function Contact() {
  const [formulario, setFormulario] =
    useState(formularioInicial);

  const [errores, setErrores] = useState({});
  const [aviso, setAviso] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState(""); 

  // Actualizar el formulario
  const manejarCambio = (event) => {
    const { name, value } = event.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));

    // Limpiar el error del campo modificado
    setErrores((anterior) => ({
      ...anterior,
      [name]: "",
    }));

    setAviso("");
  };

  // Validar los datos ingresados
  const validarFormulario = () => {
    const nuevosErrores = {};

    const nombre = formulario.nombre.trim();
    const email = formulario.email.trim();
    const asunto = formulario.asunto.trim();
    const mensaje = formulario.mensaje.trim();

    // Validar nombre
    if (nombre.length < 2) {
      nuevosErrores.nombre =
        "Ingresá un nombre de al menos 2 caracteres.";
    }

    // Validar correo electrónico
    const expresionEmail =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!expresionEmail.test(email)) {
      nuevosErrores.email =
        "Ingresá un correo electrónico válido.";
    }

    // Validar tipo de consulta
    const tipoValido = tiposConsulta.some(
      (tipo) => tipo.valor === formulario.tipo
    );

    if (!tipoValido) {
      nuevosErrores.tipo =
        "Seleccioná un tipo de consulta.";
    }

    // Validar asunto
    if (asunto.length < 5) {
      nuevosErrores.asunto =
        "El asunto debe tener al menos 5 caracteres.";
    }

    // Validar mensaje
    if (mensaje.length < 20) {
      nuevosErrores.mensaje =
        "El mensaje debe tener al menos 20 caracteres.";
    }

    return nuevosErrores;
  };

  // Manejar el envío del formulario
  
  const manejarEnvio = async (event) => {
    event.preventDefault();

    if (enviando) return;

    const nuevosErrores = validarFormulario();

    setErrores(nuevosErrores);
    setAviso("");
    setErrorEnvio("");

    // Detener si hay errores de validación
    if (Object.keys(nuevosErrores).length > 0) {
      return;
    }

    
    // Adaptar el formulario a los campos de MySQL
    
    const motivos = {
      general: "General",
      cotizacion: "Cotización",
      asesoria: "Asesoría",
    };

    const datosConsulta = {
      id_servicio: null,
      nombre_remitente: formulario.nombre.trim(),
      email_remitente: formulario.email.trim(),
      motivo: motivos[formulario.tipo],
      contenido: `Asunto: ${formulario.asunto.trim()}\n\n${formulario.mensaje.trim()}`,
    };


    try {
      setEnviando(true);

      const respuesta = await enviarConsulta(datosConsulta);

      setAviso(
        respuesta.mensaje || "Consulta enviada correctamente."
      );

      // Limpiar el formulario solo si se envió correctamente
      setFormulario(formularioInicial);

    } catch (error) {
      setErrorEnvio(error.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <main className="contact-page">

      {/* SECCIÓN 1: PRESENTACIÓN */}
      <section className="contact-hero">
        <div className="container">

          <p className="contact-eyebrow">
            HABLEMOS DE TU PROYECTO
          </p>

          <h1 className="contact-title">
            Ponete en <span>contacto.</span>
          </h1>

          <p className="contact-description">
            ¿Tenés alguna consulta, necesitás
            asesoramiento o querés solicitar
            una cotización?

            Completá el formulario para contarnos
            sobre tu idea.
          </p>

        </div>
      </section>

      {/* SECCIÓN 2: FORMULARIO */}
      <section className="contact-section">
        <div className="container">

          <div className="row justify-content-center">
            <div className="col-lg-9 col-xl-8">

              <div className="contact-card">

                <div className="contact-card-header">
                  <h2>Enviar una consulta</h2>

                  <p>
                    Completá los siguientes campos.
                    Todos son obligatorios.
                  </p>
                </div>

                <form
                  onSubmit={manejarEnvio}
                  noValidate
                >

                  <div className="row g-4">

                    {/* NOMBRE COMPLETO */}
                    <div className="col-md-6">
                      <div className="contact-field">

                        <label htmlFor="contact-nombre">
                          Nombre completo
                        </label>

                        <input
                          type="text"
                          id="contact-nombre"
                          name="nombre"
                          className="contact-input"
                          placeholder="Ingresá tu nombre"
                          value={formulario.nombre}
                          onChange={manejarCambio}
                          maxLength={100}
                          autoComplete="name"
                          required
                          aria-invalid={
                            Boolean(errores.nombre)
                          }
                        />

                        {errores.nombre && (
                          <small className="contact-error">
                            {errores.nombre}
                          </small>
                        )}

                      </div>
                    </div>

                    {/* CORREO ELECTRÓNICO */}
                    <div className="col-md-6">
                      <div className="contact-field">

                        <label htmlFor="contact-email">
                          Correo electrónico
                        </label>

                        <input
                          type="email"
                          id="contact-email"
                          name="email"
                          className="contact-input"
                          placeholder="correo@ejemplo.com"
                          value={formulario.email}
                          onChange={manejarCambio}
                          maxLength={254}
                          autoComplete="email"
                          required
                          aria-invalid={
                            Boolean(errores.email)
                          }
                        />

                        {errores.email && (
                          <small className="contact-error">
                            {errores.email}
                          </small>
                        )}

                      </div>
                    </div>

                    {/* TIPO DE CONSULTA */}
                    <div className="col-12">
                      <div className="contact-field">

                        <label htmlFor="contact-tipo">
                          Tipo de consulta
                        </label>

                        <select
                          id="contact-tipo"
                          name="tipo"
                          className="contact-input"
                          value={formulario.tipo}
                          onChange={manejarCambio}
                          required
                          aria-invalid={
                            Boolean(errores.tipo)
                          }
                        >
                          <option value="">
                            Seleccioná una opción
                          </option>

                          {tiposConsulta.map((tipo) => (
                            <option
                              key={tipo.valor}
                              value={tipo.valor}
                            >
                              {tipo.nombre}
                            </option>
                          ))}

                        </select>

                        {errores.tipo && (
                          <small className="contact-error">
                            {errores.tipo}
                          </small>
                        )}

                      </div>
                    </div>

                    {/* ASUNTO */}
                    <div className="col-12">
                      <div className="contact-field">

                        <label htmlFor="contact-asunto">
                          Asunto
                        </label>

                        <input
                          type="text"
                          id="contact-asunto"
                          name="asunto"
                          className="contact-input"
                          placeholder="¿Sobre qué querés consultar?"
                          value={formulario.asunto}
                          onChange={manejarCambio}
                          maxLength={120}
                          required
                          aria-invalid={
                            Boolean(errores.asunto)
                          }
                        />

                        {errores.asunto && (
                          <small className="contact-error">
                            {errores.asunto}
                          </small>
                        )}

                      </div>
                    </div>

                    {/* MENSAJE */}
                    <div className="col-12">
                      <div className="contact-field">

                        <label htmlFor="contact-mensaje">
                          Mensaje
                        </label>

                        <textarea
                          id="contact-mensaje"
                          name="mensaje"
                          className="contact-input contact-textarea"
                          placeholder="Contanos sobre tu consulta o proyecto..."
                          value={formulario.mensaje}
                          onChange={manejarCambio}
                          maxLength={2000}
                          rows={6}
                          required
                          aria-invalid={
                            Boolean(errores.mensaje)
                          }
                        />

                        <div className="contact-field-footer">

                          {errores.mensaje ? (
                            <small className="contact-error">
                              {errores.mensaje}
                            </small>
                          ) : (
                            <span />
                          )}

                          <small className="contact-counter">
                            {formulario.mensaje.length}/2000
                          </small>

                        </div>

                      </div>
                    </div>

                  </div>

                  {/* AVISO */}
                  {aviso && (
                    <div
                      className="contact-alert"
                      role="status"
                    >
                      {aviso}
                    </div>
                  )}
                  {errorEnvio && (
                    <div className="contact-alert" role="alert">
                      No se pudo enviar la consulta: {errorEnvio}
                    </div>
                  )}

                  {/* BOTÓN */}
                  <button
                    type="submit"
                    className="btn contact-submit"
                    disabled={enviando}
                  >
                    {enviando ? "Enviando..." : "Enviar consulta"}
                  </button>

                  <p className="contact-form-note">
                    Tu consulta será registrada para que el administrador
                    pueda revisarla y responderte.
                  </p>

                </form>

              </div>

            </div>
          </div>

        </div>
      </section>

    </main>
  );
}

export default Contact;
