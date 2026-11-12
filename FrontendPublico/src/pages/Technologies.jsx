
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { obtenerTecnologias } from "../services/portafolioApi";

// Tecnologías agrupadas por categoría
const descripcionesCategorias = {
  Frontend: "Tecnologías para construir interfaces web.",
  Backend: "Herramientas para desarrollar la lógica del servidor.",
  "Bases de datos": "Tecnologías para almacenar información.",
  Herramientas: "Herramientas utilizadas durante el desarrollo.",
};


function IconoTecnologia({ nombre, iconoUrl, iniciales }) {
  const [imagenFallida, setImagenFallida] = useState(false);

  useEffect(() => {
    setImagenFallida(false);
  }, [iconoUrl]);

  const mostrarImagen = Boolean(iconoUrl) && !imagenFallida;

  return (
    <div className="technology-icon" aria-hidden="true">
      {mostrarImagen ? (
        <img
          src={iconoUrl}
          alt=""
          className="technology-icon-image"
          loading="lazy"
          onError={() => setImagenFallida(true)}
        />
      ) : (
        <span>{iniciales}</span>
      )}
    </div>
  );
}

function Technologies() {
  
const [tecnologias, setTecnologias] = useState([]);
const [cargando, setCargando] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
  let activo = true;

  obtenerTecnologias()
    .then((datos) => {
      if (activo) setTecnologias(datos);
    })
    .catch((err) => {
      if (activo) setError(err.message);
    })
    .finally(() => {
      if (activo) setCargando(false);
    });

  return () => {
    activo = false;
  };
}, []);

// Agrupar las tecnologías que llegan desde MySQL.

const categoriasAgrupadas = tecnologias.reduce(
  (grupos, tecnologia) => {
    const categoria = tecnologia.categoria || "Otras";

    // Crear la categoría si todavía no existe
    if (!grupos[categoria]) {
      grupos[categoria] = [];
    }

    // Normalizar el nombre para comparar tecnologías
    const nombreNormalizado = tecnologia.nombre
      .trim()
      .toLowerCase();

    // Buscar si esta tecnología ya fue agregada
    const tecnologiaExistente = grupos[categoria].find(
      (item) =>
        item.nombre.trim().toLowerCase() ===
        nombreNormalizado
    );

    if (tecnologiaExistente) {
      // Si la primera no tenía imagen y la segunda sí,
      // aprovechar la imagen disponible.
      if (
        !tecnologiaExistente.iconoUrl &&
        tecnologia.icono_url
      ) {
        tecnologiaExistente.iconoUrl = tecnologia.icono_url;
      }

      return grupos;
    }

    // Agregar solamente tecnologías no repetidas
    grupos[categoria].push({
      id: tecnologia.id_tecnologia,
      nombre: tecnologia.nombre,
      iniciales: tecnologia.nombre
        .slice(0, 3)
        .toUpperCase(),
      iconoUrl: tecnologia.icono_url || null,
      descripcion: "",
    });

    return grupos;
  },
  {}
);


const categorias = Object.entries(categoriasAgrupadas).map(
  ([nombre, tecnologias]) => ({
    nombre,
    descripcion: descripcionesCategorias[nombre] || "",
    tecnologias,
  })
);

  return (
    <main className="technologies-page">

      {/* SECCIÓN 1: PRESENTACIÓN */}
      <section className="technologies-hero">
        <div className="container">

          <p className="technologies-eyebrow">
            MI STACK TECNOLÓGICO
          </p>

          <h1 className="technologies-title">
            Tecnologías y <span>herramientas.</span>
          </h1>

          <p className="technologies-description">
            Conjunto de tecnologías que permiten desarrollar
            aplicaciones web completas, desde la interfaz
            visual hasta la lógica del servidor y la
            gestión de datos.
          </p>

        </div>
      </section>
      {cargando && (
        <p>Cargando tecnologías...</p>
      )}

      {error && (
        <p role="alert">
          No se pudieron cargar las tecnologías: {error}
        </p>
      )}
      {/* SECCIÓN 2: CATEGORÍAS */}
      {categorias.map((categoria, indice) => (
        <section
          key={categoria.nombre}
          className={`technologies-section ${
            indice % 2 !== 0 ? "technologies-section-alt" : ""
          }`}
        >
          <div className="container">

            <div className="technologies-section-header">
              <h2>{categoria.nombre}</h2>
              <p>{categoria.descripcion}</p>
            </div>

            <div className="row g-4">
              {categoria.tecnologias.map((tecnologia) => (
                <div
                  className="col-sm-6 col-lg-4"
                  key={tecnologia.id || tecnologia.nombre}
                >
                  <article className="technology-card">

                  <IconoTecnologia
                    nombre={tecnologia.nombre}
                    iconoUrl={tecnologia.iconoUrl}
                    iniciales={tecnologia.iniciales}
                  />

                    <h3>{tecnologia.nombre}</h3>

                    <p>{tecnologia.descripcion}</p>

                  </article>
                </div>
              ))}
            </div>

          </div>
        </section>
      ))}

      {/* SECCIÓN 3: METODOLOGÍA */}
      <section className="technologies-section">
        <div className="container">

          <div className="technologies-method">

            <p className="technologies-eyebrow">
              DESARROLLO FULLSTACK
            </p>

            <h2>
              Tecnologías que trabajan juntas
            </h2>

            <p>
              Una aplicación web combina diferentes
              herramientas: React permite construir
              la interfaz, Node.js y Express gestionan
              los servicios del servidor, y MySQL
              permite almacenar la información.
            </p>

            <div className="technologies-flow">
              <span>React</span>
              <span className="technologies-arrow">→</span>
              <span>Node.js + Express</span>
              <span className="technologies-arrow">→</span>
              <span>MySQL</span>
            </div>

            <Link
              to="/proyectos"
              className="btn technologies-btn"
            >
              Explorar proyectos
            </Link>

          </div>

        </div>
      </section>

    </main>
  );
}

export default Technologies;
