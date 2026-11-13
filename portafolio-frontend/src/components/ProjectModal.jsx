
import { useEffect, useRef, useState } from "react";

// Verificar que los enlaces sean HTTP o HTTPS
function obtenerEnlaceSeguro(valor) {
  if (!valor) return null;

  try {
    const url = new URL(valor.trim());

    return ["http:", "https:"].includes(url.protocol)
      ? url.href
      : null;
  } catch {
    return null;
  }
}

function ProjectModal({ proyecto, onClose }) {
  const [imagenFallida, setImagenFallida] = useState(false);

  const modalRef = useRef(null);
  const cerrarRef = useRef(null);

  const imagenUrl = obtenerEnlaceSeguro(proyecto.imagenUrl);
  const repositorioUrl = obtenerEnlaceSeguro(
    proyecto.repositorioUrl
  );
  const demoUrl = obtenerEnlaceSeguro(proyecto.demoUrl);

  useEffect(() => {
    const elementoAnterior = document.activeElement;
    const overflowAnterior = document.body.style.overflow;

    // Evitar que se desplace la página de fondo
    document.body.style.overflow = "hidden";

    // Mover el foco al modal
    cerrarRef.current?.focus();

    const manejarTeclas = (event) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      // Mantener la navegación por teclado dentro del modal
      if (event.key === "Tab") {
        const elementos = Array.from(
          modalRef.current?.querySelectorAll(
            'button:not([disabled]), a[href]'
          ) || []
        );

        if (elementos.length === 0) {
          event.preventDefault();
          return;
        }

        const primero = elementos[0];
        const ultimo = elementos[elementos.length - 1];

        if (
          event.shiftKey &&
          document.activeElement === primero
        ) {
          event.preventDefault();
          ultimo.focus();
        } else if (
          !event.shiftKey &&
          document.activeElement === ultimo
        ) {
          event.preventDefault();
          primero.focus();
        }
      }
    };

    document.addEventListener("keydown", manejarTeclas);

    return () => {
      document.removeEventListener(
        "keydown",
        manejarTeclas
      );

      document.body.style.overflow = overflowAnterior;

      // Recuperar el foco en el botón que abrió el modal
      elementoAnterior?.focus?.();
    };
  }, [onClose]);

  return (
    <div
      className="project-modal-overlay"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        ref={modalRef}
        className="project-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
      >
        {/* CERRAR */}
        <button
          ref={cerrarRef}
          type="button"
          className="project-modal-close"
          aria-label="Cerrar detalles del proyecto"
          onClick={onClose}
        >
          ×
        </button>

        {/* IMAGEN */}
        {imagenUrl && !imagenFallida ? (
          <img
            src={imagenUrl}
            alt={`Vista previa de ${proyecto.nombre}`}
            className="project-modal-image"
            onError={() => setImagenFallida(true)}
          />
        ) : (
          <div className="project-modal-placeholder">
            {proyecto.nombre}
          </div>
        )}

        {/* INFORMACIÓN */}
        <div className="project-modal-body">

          <p className="projects-eyebrow">
            DETALLES DEL PROYECTO
          </p>

          <h2 id="project-modal-title">
            {proyecto.nombre}
          </h2>

          <p className="project-modal-description">
            {proyecto.descripcion ||
              "Este proyecto todavía no tiene descripción."}
          </p>

          {/* TECNOLOGÍAS */}
          {proyecto.tecnologias?.length > 0 && (
            <>
              <h3>Tecnologías utilizadas</h3>

              <div className="project-card-tags">
                {proyecto.tecnologias.map((tecnologia) => (
                  <span key={tecnologia}>
                    {tecnologia}
                  </span>
                ))}
              </div>
            </>
          )}

          {/* ENLACES OPCIONALES */}
          <div className="project-modal-actions">

            {repositorioUrl && (
              <a
                href={repositorioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-card-button"
              >
                Ver repositorio
              </a>
            )}

            {demoUrl && (
              <a
                href={demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-card-button"
              >
                Ver demo
              </a>
            )}

            <button
              type="button"
              className="project-modal-back"
              onClick={onClose}
            >
              Cerrar detalles
            </button>

          </div>

        </div>
      </section>
    </div>
  );
}

export default ProjectModal;
