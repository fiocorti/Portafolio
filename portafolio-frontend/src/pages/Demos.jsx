
import { useState } from "react";
import { Link } from "react-router-dom";

import GitHubDemo from "../components/demos/GitHubDemo";
import WeatherDemo from "../components/demos/WeatherDemo";

import "../styles/demos.css";

const demosDisponibles = [
  {
    id: "github",
    nombre: "Explorador de GitHub",
  },
  {
    id: "clima",
    nombre: "Consulta del clima",
  },
];

function Demos() {
  const [demoActiva, setDemoActiva] = useState("github");

  return (
    <main className="demos-page">

      {/* PRESENTACIÓN */}
      <section className="demos-hero">
        <div className="container">

          <Link to="/proyectos" className="demos-back">
            ← Volver a proyectos
          </Link>

          <p className="demos-eyebrow">
            DEMOSTRACIONES INTERACTIVAS
          </p>

          <h1 className="demos-title">
            Explorá mis <span>demos.</span>
          </h1>

          <p className="demos-description">
            Aplicaciones interactivas desarrolladas
            con React e integradas con APIs externas.
          </p>

        </div>
      </section>

      {/* SELECTOR DE DEMOS */}
      <section className="demos-section">
        <div className="container">

          <h2 className="demos-section-title">
            Seleccioná una demostración
          </h2>

          <div
            className="demos-selector"
            role="group"
            aria-label="Seleccionar demostración"
          >
            {demosDisponibles.map((demo) => (
              <button
                key={demo.id}
                type="button"
                className={`demos-selector-btn ${
                  demoActiva === demo.id
                    ? "active"
                    : ""
                }`}
                aria-pressed={demoActiva === demo.id}
                onClick={() => setDemoActiva(demo.id)}
              >
                {demo.nombre}
              </button>
            ))}
          </div>

          {/* COMPONENTES INDEPENDIENTES */}
          {demoActiva === "github" && (
            <GitHubDemo />
          )}

          {demoActiva === "clima" && (
            <WeatherDemo />
          )}

        </div>
      </section>

      {/* EXPLICACIÓN */}
      <section className="demos-section demos-section-alt">
        <div className="container">

          <p className="demos-eyebrow">
            INTEGRACIÓN DE APIS
          </p>

          <h2 className="demos-section-title">
            ¿Cómo funcionan estas aplicaciones?
          </h2>

          <div className="row g-4">
            {[
              {
                numero: "01",
                titulo: "Interfaz React",
                texto: "El usuario ingresa la información que desea consultar.",
              },
              {
                numero: "02",
                titulo: "API externa",
                texto: "La aplicación solicita información al servicio correspondiente.",
              },
              {
                numero: "03",
                titulo: "Resultados",
                texto: "React actualiza la interfaz con los datos recibidos.",
              },
            ].map((paso) => (
              <div
                key={paso.numero}
                className="col-md-4"
              >
                <article className="demos-info-card">
                  <span>{paso.numero}</span>
                  <h3>{paso.titulo}</h3>
                  <p>{paso.texto}</p>
                </article>
              </div>
            ))}
          </div>

        </div>
      </section>

    </main>
  );
}

export default Demos;
