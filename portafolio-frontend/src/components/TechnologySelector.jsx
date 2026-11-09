
import React, { useEffect, useMemo, useState } from 'react';
import tecnologiasService from '../services/tecnologiasService';

export default function TechnologySelector({ value = [], onChange }) {
  const [catalogo, setCatalogo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [categoriasAbiertas, setCategoriasAbiertas] = useState({});

  useEffect(() => {
    let activo = true;

    tecnologiasService.list()
      .then(data => {
        if (activo) {
          const tecnologias = Array.isArray(data) ? data : [];
          setCatalogo(tecnologias);

          // Abrir inicialmente la primera categoría.
          const primeraCategoria = tecnologias[0]?.categoria || 'Sin categoría';

          setCategoriasAbiertas({
            [primeraCategoria]: true
          });
        }
      })
      .catch(err => {
        if (activo) {
          setError(err.message || 'No se pudo cargar el catálogo.');
        }
      })
      .finally(() => {
        if (activo) setLoading(false);
      });

    return () => {
      activo = false;
    };
  }, []);

  const actuales = Array.isArray(value) ? value : [];

  const seleccionadas = useMemo(() => {
    return new Set(
      actuales.map(item =>
        typeof item === 'string'
          ? item.toLowerCase()
          : String(item.nombre || '').toLowerCase()
      )
    );
  }, [actuales]);

  const categorias = useMemo(() => {
    const resultado = {};

    catalogo.forEach(tecnologia => {
      const categoria = tecnologia.categoria || 'Sin categoría';

      if (!resultado[categoria]) {
        resultado[categoria] = [];
      }

      resultado[categoria].push(tecnologia);
    });

    return resultado;
  }, [catalogo]);

  const categoriasFiltradas = useMemo(() => {
    const resultado = {};
    const termino = busqueda.trim().toLowerCase();

    Object.entries(categorias).forEach(([categoria, tecnologias]) => {
      const coincidencias = tecnologias.filter(tecnologia =>
        String(tecnologia.nombre || '')
          .toLowerCase()
          .includes(termino)
      );

      if (coincidencias.length > 0) {
        resultado[categoria] = coincidencias;
      }
    });

    return resultado;
  }, [categorias, busqueda]);

  const cambiarSeleccion = (tecnologia, checked) => {
    const nombre = String(tecnologia.nombre || '').toLowerCase();

    let siguientes;

    if (checked) {
      siguientes = [
        ...actuales.filter(item => {
          const itemNombre = typeof item === 'string'
            ? item.toLowerCase()
            : String(item.nombre || '').toLowerCase();

          return itemNombre !== nombre;
        }),
        {
          id_tecnologia: tecnologia.id_tecnologia || tecnologia.id,
          nombre: tecnologia.nombre,
          categoria: tecnologia.categoria || ''
        }
      ];
    } else {
      siguientes = actuales.filter(item => {
        const itemNombre = typeof item === 'string'
          ? item.toLowerCase()
          : String(item.nombre || '').toLowerCase();

        return itemNombre !== nombre;
      });
    }

    onChange('tecnologias', siguientes);
  };

  const quitarSeleccion = nombre => {
    const siguientes = actuales.filter(item => {
      const itemNombre = typeof item === 'string'
        ? item
        : item.nombre;

      return String(itemNombre || '').toLowerCase() !== nombre.toLowerCase();
    });

    onChange('tecnologias', siguientes);
  };

  const alternarCategoria = categoria => {
    setCategoriasAbiertas(actuales => ({
      ...actuales,
      [categoria]: !actuales[categoria]
    }));
  };

  if (loading) {
    return (
      <div className="form-field">
        <label>Tecnologías del proyecto</label>
        <p className="field-help">Cargando tecnologías...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="form-field">
        <label>Tecnologías del proyecto</label>
        <p className="field-error">{error}</p>
      </div>
    );
  }

  if (catalogo.length === 0) {
    return (
      <div className="form-field">
        <label>Tecnologías del proyecto</label>
        <p className="field-help">
          Todavía no hay tecnologías cargadas en el catálogo.
          Primero agregá tecnologías desde la sección Tecnologías.
        </p>
      </div>
    );
  }

  return (
    <div className="form-field technology-selector">
      <div className="technology-selector-heading">
        <div>
          <label>Tecnologías del proyecto</label>
          <p className="field-help">
            Buscá y seleccioná las tecnologías utilizadas.
          </p>
        </div>

        <span className="technology-count">
          {seleccionadas.size} seleccionada(s)
        </span>
      </div>

      {/* Tecnologías seleccionadas */}
      <div className="technology-selected-box">
        <div className="technology-selected-title">
          <span>Seleccionadas</span>
          <span>{seleccionadas.size}</span>
        </div>

        {actuales.length > 0 ? (
          <div className="technology-tags">
            {actuales.map(item => {
              const nombre = typeof item === 'string'
                ? item
                : item.nombre;

              return (
                <span
                  className="technology-tag"
                  key={String(nombre).toLowerCase()}
                >
                  {nombre}

                  <button
                    type="button"
                    aria-label={`Quitar ${nombre}`}
                    onClick={() => quitarSeleccion(nombre)}
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        ) : (
          <p className="technology-empty">
            Todavía no seleccionaste ninguna tecnología.
          </p>
        )}
      </div>

      {/* Buscador */}
      <div className="technology-search">
        <span className="technology-search-icon">⌕</span>

        <input
          type="text"
          value={busqueda}
          onChange={event => setBusqueda(event.target.value)}
          placeholder="Buscar tecnología..."
          aria-label="Buscar tecnología"
        />

        {busqueda && (
          <button
            type="button"
            onClick={() => setBusqueda('')}
            aria-label="Limpiar búsqueda"
          >
            ×
          </button>
        )}
      </div>

      {/* Categorías y opciones */}
      <div className="technology-categories-container">
        {Object.entries(categoriasFiltradas).length > 0 ? (
          Object.entries(categoriasFiltradas).map(
            ([categoria, tecnologias]) => {
              const abierta = busqueda.trim()
                ? true
                : !!categoriasAbiertas[categoria];

              const cantidadSeleccionada = tecnologias.filter(
                tecnologia =>
                  seleccionadas.has(
                    String(tecnologia.nombre || '').toLowerCase()
                  )
              ).length;

              return (
                <section
                  className="technology-category"
                  key={categoria}
                >
                  <button
                    type="button"
                    className="technology-category-header"
                    onClick={() => alternarCategoria(categoria)}
                    aria-expanded={abierta}
                  >
                    <span className="technology-category-name">
                      <span className="technology-category-arrow">
                        {abierta ? '−' : '+'}
                      </span>
                      {categoria}
                    </span>

                    <span className="technology-category-info">
                      {cantidadSeleccionada > 0 && (
                        <span className="technology-category-selected">
                          {cantidadSeleccionada} elegida(s)
                        </span>
                      )}
                      {tecnologias.length}
                    </span>
                  </button>

                  {abierta && (
                    <div className="technology-options-grid">
                      {tecnologias.map(tecnologia => {
                        const nombre = String(
                          tecnologia.nombre || ''
                        ).toLowerCase();

                        const checked = seleccionadas.has(nombre);

                        return (
                          <label
                            key={
                              tecnologia.id ||
                              tecnologia.id_tecnologia ||
                              tecnologia.nombre
                            }
                            className={`technology-option ${
                              checked ? 'selected' : ''
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={event =>
                                cambiarSeleccion(
                                  tecnologia,
                                  event.target.checked
                                )
                              }
                            />

                            <span className="technology-option-check">
                              {checked ? '✓' : ''}
                            </span>

                            <span className="technology-option-name">
                              {tecnologia.nombre}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </section>
              );
            }
          )
        ) : (
          <div className="technology-no-results">
            No encontramos tecnologías con "{busqueda}".
          </div>
        )}
      </div>
    </div>
  );
}
