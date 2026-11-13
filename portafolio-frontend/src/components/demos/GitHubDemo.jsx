
import { useState } from "react";
import { obtenerRepositorios } from "../../services/githubApi";

function GitHubDemo() {
  const [usuario, setUsuario] = useState("");
  const [repositorios, setRepositorios] = useState(null);

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [usuarioConsultado, setUsuarioConsultado] =
    useState("");

  // Buscar repositorios en GitHub
  const buscarRepositorios = async (event) => {
    event.preventDefault();

    setError("");
    setRepositorios(null);
    setCargando(true);

    try {
      const datos = await obtenerRepositorios(usuario);

      setRepositorios(datos);
      setUsuarioConsultado(usuario.trim());

    } catch (err) {
      setError(
        err.message ||
        "Ocurrió un error al consultar GitHub."
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
          GITHUB API
        </p>

        <h2>Explorador de GitHub</h2>

        <p>
          Ingresá un nombre de usuario de GitHub
          para consultar sus repositorios públicos,
          tecnologías utilizadas y estrellas.
        </p>

      </div>

      {/* FORMULARIO */}
      <form
        className="demos-search"
        onSubmit={buscarRepositorios}
      >

        <label htmlFor="github-usuario">
          Nombre de usuario
        </label>

        <div className="github-search-row">

          <input
            type="text"
            id="github-usuario"
            className="demos-input"
            placeholder="Ejemplo: octocat"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            maxLength={39}
            autoComplete="off"
            required
          />

          <button
            type="submit"
            className="demos-btn"
            disabled={cargando}
          >
            {cargando
              ? "Buscando..."
              : "Buscar repositorios"}
          </button>

        </div>

      </form>

      {/* MENSAJES */}
      <div aria-live="polite">

        {cargando && (
          <p className="github-message">
            Consultando repositorios...
          </p>
        )}

        {error && (
          <div className="github-error" role="alert">
            {error}
          </div>
        )}

      </div>

      {/* RESULTADOS */}
      {repositorios !== null && (
        <section className="github-results">

          <div className="github-results-header">

            <h3>
              Repositorios de {usuarioConsultado}
            </h3>

            <p>
              {repositorios.length}
              {" "}
              {repositorios.length === 1
                ? "repositorio encontrado"
                : "repositorios encontrados"}
            </p>

          </div>

          {repositorios.length === 0 ? (

            <p className="github-message">
              Este usuario no tiene repositorios
              públicos para mostrar.
            </p>

          ) : (

            <div className="row g-4">

              {repositorios.map((repo) => (
                <div
                  className="col-md-6"
                  key={repo.id}
                >

                  <article className="github-repo-card">

                    <h4>{repo.nombre}</h4>

                    <p className="github-repo-description">
                      {repo.descripcion}
                    </p>

                    <div className="github-repo-info">

                      <span>
                        Lenguaje: {repo.lenguaje}
                      </span>

                      <span>
                        ★ {repo.estrellas}
                      </span>

                    </div>

                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="github-repo-link"
                    >
                      Ver en GitHub ↗
                    </a>

                  </article>

                </div>
              ))}

            </div>

          )}

        </section>
      )}

    </div>
  );
}

export default GitHubDemo;
