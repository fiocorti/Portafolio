
import { useState } from "react";
import { consultarClima } from "../../services/weatherApi";

function WeatherDemo() {
  const [ciudad, setCiudad] = useState("");
  const [clima, setClima] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const buscarClima = async (event) => {
    event.preventDefault();

    setError("");
    setClima(null);
    setCargando(true);

    try {
      const resultado = await consultarClima(ciudad);
      setClima(resultado);
    } catch (err) {
      setError(
        err.message ||
        "Ocurrió un error al consultar el clima."
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="demos-panel">

      {/* ENCABEZADO */}
      <div className="demos-panel-header">
        <p className="demos-eyebrow">
          OPEN-METEO API
        </p>

        <h2>Consulta del clima</h2>

        <p>
          Ingresá una ciudad para conocer
          su temperatura, sensación térmica,
          humedad y velocidad del viento.
        </p>
      </div>

      {/* BUSCADOR */}
      <form
        className="demos-search"
        onSubmit={buscarClima}
      >
        <label htmlFor="weather-city">
          Nombre de la ciudad
        </label>

        <div className="github-search-row">
          <input
            type="text"
            id="weather-city"
            className="demos-input"
            placeholder="Ejemplo: Salta, Argentina"
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
            minLength={2}
            maxLength={100}
            autoComplete="off"
            disabled={cargando}
            required
          />

          <button
            type="submit"
            className="demos-btn"
            disabled={cargando}
          >
            {cargando
              ? "Consultando..."
              : "Consultar clima"}
          </button>
        </div>
      </form>

      {/* MENSAJES */}
      <div aria-live="polite">
        {cargando && (
          <p className="github-message">
            Obteniendo información meteorológica...
          </p>
        )}

        {error && (
          <div className="github-error" role="alert">
            {error}
          </div>
        )}
      </div>

      {/* RESULTADOS */}
      {clima && (
        <section className="weather-results">

          <div className="weather-card">

            <p className="demos-eyebrow">
              CONDICIONES ACTUALES
            </p>

            <h3>{clima.ciudad}</h3>

            <p className="weather-location">
              {[clima.region, clima.pais]
                .filter(Boolean)
                .join(", ")}
            </p>

            <div className="weather-main">
              <span
                className="weather-icon"
                aria-hidden="true"
              >
                🌤️
              </span>

              <div>
                <div className="weather-temperature">
                  {Math.round(clima.temperatura)}°C
                </div>

                <p>{clima.descripcion}</p>
              </div>
            </div>

            <div className="weather-details">

              <div className="weather-detail">
                <span>Sensación térmica</span>
                <strong>
                  {Math.round(clima.sensacion)}°C
                </strong>
              </div>

              <div className="weather-detail">
                <span>Humedad</span>
                <strong>{clima.humedad}%</strong>
              </div>

              <div className="weather-detail">
                <span>Viento</span>
                <strong>
                  {clima.viento} km/h
                </strong>
              </div>

            </div>

            <p className="weather-update">
              Hora local de referencia:{" "}
              {clima.fechaHora.replace("T", " ")}
            </p>

          </div>

        </section>
      )}

    </div>
  );
}

export default WeatherDemo;
