
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Code2,
  ChevronDown,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  FolderKanban,
  CheckCircle2,
  CircleMinus,
  Layers3
} from 'lucide-react';

import PageHeader from '../../components/PageHeader';
import SearchBar from '../../components/SearchBar';
import ConfirmModal from '../../components/ConfirmModal';
import ErrorMessage from '../../components/ErrorMessage';
import Toast from '../../components/Toast';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';

import tecnologiasService from '../../services/tecnologiasService';
import proyectosService from '../../services/proyectosService';

// Normaliza nombres para comparar tecnologías sin importar
// mayúsculas, espacios o si vienen como objetos.
function normalizarNombre(valor) {
  return String(valor || '').trim().toLocaleLowerCase();
}

function obtenerTecnologiasDelProyecto(proyecto) {
  const tecnologias = proyecto?.tecnologias;

  if (Array.isArray(tecnologias)) {
    return tecnologias
      .map(tecnologia => {
        if (typeof tecnologia === 'string') return tecnologia;

        return (
          tecnologia?.nombre ||
          tecnologia?.name ||
          tecnologia?.tecnologia ||
          ''
        );
      })
      .filter(Boolean);
  }

  if (typeof tecnologias === 'string') {
    return tecnologias.split(',').map(nombre => nombre.trim()).filter(Boolean);
  }

  return [];
}

export default function TecnologiasList() {
  const [tecnologias, setTecnologias] = useState([]);
  const [tecnologiasEnUso, setTecnologiasEnUso] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState({});
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const [
        tecnologiasData,
        proyectosData,
        tecnologiasEnUsoData
      ] = await Promise.all([
        tecnologiasService.list(),
        proyectosService.list(),
        tecnologiasService.listEnUso()
      ]);

      setTecnologias(
        Array.isArray(tecnologiasData) ? tecnologiasData : []
      );

      setProyectos(
        Array.isArray(proyectosData) ? proyectosData : []
      );

      setTecnologiasEnUso(
        Array.isArray(tecnologiasEnUsoData)
          ? tecnologiasEnUsoData
          : []
      );
    } catch (e) {
      setError(
        e?.message ||
        'No se pudieron cargar las tecnologías y sus proyectos.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Cuenta cuántos proyectos utilizan cada tecnología.
  const usoTecnologias = useMemo(() => {
    const cantidades = {};

    proyectos.forEach(proyecto => {
      const nombres = obtenerTecnologiasDelProyecto(proyecto);

      // Evita contar dos veces la misma tecnología
      // dentro de un mismo proyecto.
      const nombresUnicos = new Set(
        nombres.map(normalizarNombre).filter(Boolean)
      );

      nombresUnicos.forEach(nombre => {
        cantidades[nombre] = (cantidades[nombre] || 0) + 1;
      });
    });

    return cantidades;
  }, [proyectos]);

  // El estado En uso / Sin uso proviene del endpoint del backend.
  const tecnologiasConUso = useMemo(() => {
    const idsEnUso = new Set(
      tecnologiasEnUso.map(tecnologia => String(tecnologia.id))
    );

    return tecnologias.map(tecnologia => {
      const nombreNormalizado = normalizarNombre(tecnologia.nombre);
      const cantidadProyectos = usoTecnologias[nombreNormalizado] || 0;

      return {
        ...tecnologia,
        cantidadProyectos,
        enUso: idsEnUso.has(String(tecnologia.id))
      };
    });
  }, [tecnologias, tecnologiasEnUso, usoTecnologias]);

  // Estadísticas generales.
  const estadisticas = useMemo(() => {
    const enUso = tecnologiasConUso.filter(item => item.enUso).length;

    return {
      total: tecnologiasConUso.length,
      enUso,
      sinUso: tecnologiasConUso.length - enUso
    };
  }, [tecnologiasConUso]);

  // Agrupa las tecnologías por categoría.
  const categorias = useMemo(() => {
    const resultado = {};

    tecnologiasConUso.forEach(tecnologia => {
      const nombreCategoria = tecnologia.categoria || 'Sin categoría';

      if (!resultado[nombreCategoria]) {
        resultado[nombreCategoria] = [];
      }

      resultado[nombreCategoria].push(tecnologia);
    });

    return Object.entries(resultado)
      .map(([nombre, items]) => ({
        nombre,
        items: items
          .filter(tecnologia =>
            `${tecnologia.nombre} ${nombre}`
              .toLowerCase()
              .includes(search.toLowerCase().trim())
          )
          .sort((a, b) =>
            (a.nombre || '').localeCompare(b.nombre || '')
          )
      }))
      .filter(categoria => categoria.items.length > 0)
      .sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [tecnologiasConUso, search]);

  const toggleCategoria = nombre => {
    setExpanded(current => ({
      ...current,
      [nombre]: !current[nombre]
    }));
  };

  const eliminar = async () => {
    if (!deleteItem) return;

    setDeleting(true);

    try {
      await tecnologiasService.remove(deleteItem.id);

      setTecnologias(current =>
        current.filter(item => item.id !== deleteItem.id)
      );

      setTecnologiasEnUso(current =>
        current.filter(item => item.id !== deleteItem.id)
      );

      setToast({
        type: 'success',
        message: 'Tecnología eliminada correctamente.'
      });

      setDeleteItem(null);
    } catch (e) {
      setToast({
        type: 'error',
        message: e.message || 'No se pudo eliminar la tecnología.'
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Tecnologías"
        description="Organizá tu catálogo y consultá qué tecnologías utilizan tus proyectos."
        icon={Code2}
        action={
          <Link
            className="button button-primary"
            to="/admin/tecnologias/nuevo"
          >
            <Plus size={17} />
            Nueva tecnología
          </Link>
        }
      />

      <section className="technology-overview">
        <article className="technology-stat technology-stat-total">
          <div className="technology-stat-icon">
            <Layers3 size={21} />
          </div>
          <div>
            <span>Total de tecnologías</span>
            <strong>{estadisticas.total}</strong>
            <small>Registradas en el catálogo</small>
          </div>
        </article>

        <article className="technology-stat technology-stat-used">
          <div className="technology-stat-icon">
            <CheckCircle2 size={21} />
          </div>
          <div>
            <span>En uso</span>
            <strong>{estadisticas.enUso}</strong>
            <small>Asociadas a proyectos</small>
          </div>
        </article>

        <article className="technology-stat technology-stat-unused">
          <div className="technology-stat-icon">
            <CircleMinus size={21} />
          </div>
          <div>
            <span>Sin uso</span>
            <strong>{estadisticas.sinUso}</strong>
            <small>Sin proyectos asociados</small>
          </div>
        </article>
      </section>

      <section className="panel table-panel technology-panel">
        <div className="technology-panel-heading">
          <div>
            <h3>Catálogo de tecnologías</h3>
            <p>
              Explorá las categorías y revisá dónde se utiliza cada tecnología.
            </p>
          </div>

          <button
            type="button"
            className="button button-secondary button-compact"
            onClick={load}
            disabled={loading}
          >
            <RefreshCw size={15} />
            Actualizar
          </button>
        </div>

        <div className="table-toolbar">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Buscar tecnología o categoría..."
          />
        </div>

        <ErrorMessage message={error} onRetry={load} />

        {loading ? (
          <LoadingState label="Cargando tecnologías y proyectos..." />
        ) : categorias.length === 0 ? (
          <EmptyState
            title="No encontramos tecnologías"
            description="Agregá una tecnología o modificá la búsqueda."
          />
        ) : (
          <div className="technology-categories">
            {categorias.map((categoria, index) => {
              const abierto = Boolean(expanded[categoria.nombre]);
              const cantidadEnUso = categoria.items.filter(
                item => item.enUso
              ).length;

              const tono = index % 5;

              return (
                <section
                  className={`technology-category technology-tone-${tono} ${
                    abierto ? 'is-expanded' : ''
                  }`}
                  key={categoria.nombre}
                >
                  <button
                    type="button"
                    className="technology-category-header"
                    onClick={() => toggleCategoria(categoria.nombre)}
                    aria-expanded={abierto}
                  >
                    <span className="technology-category-icon">
                      <Code2 size={23} />
                    </span>

                    <span className="technology-category-info">
                      <strong>{categoria.nombre}</strong>
                      <small>
                        {categoria.items.length}{' '}
                        {categoria.items.length === 1
                          ? 'tecnología registrada'
                          : 'tecnologías registradas'}
                      </small>
                    </span>

                    <span className="technology-category-summary">
                      <span className="technology-category-used">
                        {cantidadEnUso} en uso
                      </span>
                      <span className="technology-category-divider" />
                      <span>
                        {categoria.items.length - cantidadEnUso} sin uso
                      </span>
                    </span>

                    <span className="technology-chevron">
                      {abierto
                        ? <ChevronDown size={20} />
                        : <ChevronRight size={20} />}
                    </span>
                  </button>

                  {abierto && (
                    <div className="technology-category-content">
                      <div className="technology-category-label">
                        <span className="technology-category-label-line" />
                        <span>
                          TECNOLOGÍAS DE {categoria.nombre.toUpperCase()}
                        </span>
                      </div>

                      <div className="technology-items">
                        {categoria.items.map(tecnologia => (
                          <article
                            className="technology-row"
                            key={tecnologia.id}
                          >
                            <div className="technology-row-info">
                              <span className="technology-letter">
                                {tecnologia.nombre
                                  ?.charAt(0)
                                  .toUpperCase()}
                              </span>

                              <div className="technology-name">
                                <strong>{tecnologia.nombre}</strong>
                                <small>
                                  Pertenece a {categoria.nombre}
                                </small>
                              </div>
                            </div>

                            <div className="technology-usage">
                              <span
                                className={`technology-status ${
                                  tecnologia.enUso
                                    ? 'technology-status-used'
                                    : 'technology-status-unused'
                                }`}
                              >
                                {tecnologia.enUso ? (
                                  <CheckCircle2 size={14} />
                                ) : (
                                  <CircleMinus size={14} />
                                )}

                                {tecnologia.enUso ? 'En uso' : 'Sin uso'}
                              </span>

                              <span className="technology-project-count">
                                <FolderKanban size={15} />
                                {tecnologia.cantidadProyectos}{' '}
                                {tecnologia.cantidadProyectos === 1
                                  ? 'proyecto'
                                  : 'proyectos'}
                              </span>
                            </div>

                            <div className="table-actions">
                              <Link
                                className="table-icon-button"
                                title="Editar"
                                aria-label={`Editar ${tecnologia.nombre}`}
                                to={`/admin/tecnologias/${tecnologia.id}/editar`}
                              >
                                <Pencil size={16} />
                              </Link>

                              <button
                                type="button"
                                className="table-icon-button danger-text"
                                title="Eliminar"
                                aria-label={`Eliminar ${tecnologia.nombre}`}
                                onClick={() => setDeleteItem(tecnologia)}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </article>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}

        {!loading && !error && tecnologias.length > 0 && (
          <div className="technology-footer">
            <span>
              <Code2 size={15} />
              {categorias.length} categorías encontradas
            </span>
            <span>
              {tecnologiasConUso.length} tecnologías en total
            </span>
          </div>
        )}
      </section>

      <ConfirmModal
        open={Boolean(deleteItem)}
        title="Eliminar tecnología"
        message={`¿Seguro que querés eliminar "${deleteItem?.nombre || ''}"?`}
        confirmText="Sí, eliminar"
        danger
        onConfirm={eliminar}
        onCancel={() => setDeleteItem(null)}
        loading={deleting}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />

      <style>{`
        .technology-overview {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 22px;
        }

        .technology-stat {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 21px;
          border: 1px solid var(--border-color, #e9e6f0);
          border-radius: 16px;
          background: var(--surface, #fff);
          min-width: 0;
        }

        .technology-stat-icon {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          flex-shrink: 0;
        }

        .technology-stat > div:last-child {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .technology-stat span {
          color: var(--text-muted, #777386);
          font-size: 12px;
          font-weight: 600;
        }

        .technology-stat strong {
          font-size: 27px;
          line-height: 1.2;
          color: var(--text-primary, #292638);
        }

        .technology-stat small {
          color: var(--text-muted, #918da0);
          font-size: 11px;
        }

        .technology-stat-total .technology-stat-icon {
          color: #7663b5;
          background: #f0edfa;
        }

        .technology-stat-used .technology-stat-icon {
          color: #27866a;
          background: #e7f5ee;
        }

        .technology-stat-unused .technology-stat-icon {
          color: #b17b38;
          background: #fbf1e2;
        }

        .technology-panel {
          overflow: hidden;
        }

        .technology-panel-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          padding: 22px 22px 8px;
        }

        .technology-panel-heading h3 {
          margin: 0;
          font-size: 17px;
          color: var(--text-primary, #292638);
        }

        .technology-panel-heading p {
          margin: 5px 0 0;
          color: var(--text-muted, #858195);
          font-size: 12px;
        }

        .technology-panel .table-toolbar {
          padding: 14px 22px;
        }

        .technology-categories {
          display: flex;
          flex-direction: column;
          gap: 13px;
          padding: 8px 22px 20px;
        }

        .technology-category {
          --category-color: #7663b5;
          --category-light: #f1eefb;
          --category-border: #e5def7;
          border: 1px solid var(--category-border);
          border-radius: 15px;
          overflow: hidden;
          background: var(--surface, #fff);
          transition: border-color .2s, box-shadow .2s;
        }

        .technology-category:hover {
          box-shadow: 0 5px 18px rgba(48, 38, 83, .055);
        }

        .technology-tone-0 {
          --category-color: #7663b5;
          --category-light: #f1eefb;
          --category-border: #e5def7;
        }

        .technology-tone-1 {
          --category-color: #338b83;
          --category-light: #eaf6f3;
          --category-border: #d6ece7;
        }

        .technology-tone-2 {
          --category-color: #bd8746;
          --category-light: #fbf3e8;
          --category-border: #f0e3d0;
        }

        .technology-tone-3 {
          --category-color: #547eaa;
          --category-light: #edf3f9;
          --category-border: #dce7f1;
        }

        .technology-tone-4 {
          --category-color: #a66d91;
          --category-light: #f8edf4;
          --category-border: #efdeea;
        }

        .technology-category-header {
          width: 100%;
          min-height: 82px;
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 16px 19px;
          border: 0;
          background: transparent;
          color: inherit;
          text-align: left;
          cursor: pointer;
        }

        .technology-category-header:hover {
          background: var(--category-light);
        }

        .technology-category-icon {
          width: 47px;
          height: 47px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: var(--category-light);
          color: var(--category-color);
          flex-shrink: 0;
        }

        .technology-category-info {
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 5px;
          min-width: 0;
        }

        .technology-category-info strong {
          color: var(--text-primary, #292638);
          font-size: 15px;
          font-weight: 700;
        }

        .technology-category-info small {
          color: var(--text-muted, #858195);
          font-size: 12px;
        }

        .technology-category-summary {
          display: flex;
          align-items: center;
          gap: 9px;
          color: var(--text-muted, #858195);
          font-size: 11px;
          white-space: nowrap;
        }

        .technology-category-used {
          color: #27866a;
          font-weight: 700;
        }

        .technology-category-divider {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: #c6c2d0;
        }

        .technology-chevron {
          color: var(--category-color);
          display: grid;
          place-items: center;
        }

        .technology-category-content {
          padding: 0 19px 17px;
          background: #fbfaff;
          border-top: 1px solid var(--category-border);
        }

        .technology-category-label {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 16px 2px 11px;
          color: var(--category-color);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .9px;
        }

        .technology-category-label-line {
          width: 19px;
          height: 2px;
          border-radius: 3px;
          background: var(--category-color);
        }

        .technology-items {
          padding: 0 13px;
          border: 1px solid var(--category-border);
          border-radius: 12px;
          background: var(--surface, #fff);
        }

        .technology-row {
          min-height: 72px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          padding: 12px 3px;
          border-bottom: 1px solid var(--border-color, #eeeef2);
        }

        .technology-row:last-child {
          border-bottom: 0;
        }

        .technology-row-info {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 150px;
        }

        .technology-letter {
          width: 39px;
          height: 39px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 11px;
          background: var(--category-light);
          color: var(--category-color);
          font-size: 16px;
          font-weight: 800;
        }

        .technology-name {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .technology-name strong {
          color: var(--text-primary, #292638);
          font-size: 13px;
        }

        .technology-name small {
          color: var(--text-muted, #9995a5);
          font-size: 11px;
        }

        .technology-usage {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 17px;
          flex: 1;
        }

        .technology-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          white-space: nowrap;
        }

        .technology-status-used {
          color: #267b60;
          background: #e9f6ef;
        }

        .technology-status-unused {
          color: #a27639;
          background: #fbf2e5;
        }

        .technology-project-count {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--text-muted, #858195);
          font-size: 11px;
          white-space: nowrap;
        }

        .technology-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          padding: 13px 22px;
          border-top: 1px solid var(--border-color, #eeeef2);
          color: var(--text-muted, #858195);
          font-size: 11px;
        }

        .technology-footer span:first-child {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        @media (max-width: 900px) {
          .technology-overview {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .technology-stat:last-child {
            grid-column: 1 / -1;
          }

          .technology-usage {
            gap: 9px;
          }
        }

        @media (max-width: 650px) {
          .technology-overview {
            grid-template-columns: 1fr;
          }

          .technology-stat:last-child {
            grid-column: auto;
          }

          .technology-panel-heading {
            align-items: flex-start;
            padding: 18px 14px 8px;
          }

          .technology-panel .table-toolbar {
            padding: 12px 14px;
          }

          .technology-categories {
            padding: 8px 14px 16px;
          }

          .technology-category-header {
            gap: 10px;
            padding: 13px;
          }

          .technology-category-summary {
            display: none;
          }

          .technology-category-content {
            padding: 0 11px 13px;
          }

          .technology-items {
            padding: 0 9px;
          }

          .technology-row {
            flex-wrap: wrap;
            gap: 10px;
          }

          .technology-usage {
            justify-content: flex-start;
            flex-wrap: wrap;
            padding-left: 50px;
          }

          .technology-row .table-actions {
            margin-left: auto;
          }

          .technology-footer {
            padding: 12px 14px;
            flex-wrap: wrap;
          }
        }
      `}</style>
    </>
  );
}
