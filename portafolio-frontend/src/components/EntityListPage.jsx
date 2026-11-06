import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Pencil, Trash2, Plus, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import PageHeader from './PageHeader';
import SearchBar from './SearchBar';
import DataTable from './DataTable';
import ConfirmModal from './ConfirmModal';
import ErrorMessage from './ErrorMessage';
import Toast from './Toast';
import FilterChips from './FilterChips';
import ViewToggle from './ViewToggle';
import EmptyState from './EmptyState';
import LoadingState from './LoadingState';
import sectionIcon from './sectionIcons';

const VIEW_KEY = 'admin-list-view';
const PAGE_SIZE = 8;

function readStoredView() {
  try { return localStorage.getItem(VIEW_KEY) === 'table' ? 'table' : 'cards'; } catch (_) { return 'cards'; }
}
function storeView(view) {
  try { localStorage.setItem(VIEW_KEY, view); } catch (_) { /* almacenamiento no disponible */ }
}

// Listado reutilizable. Si recibe renderCard, ofrece alternar entre tarjetas y tabla.
// Los filtros son chips; el filtro compara estado y rol para que cubra también a usuarios.
export default function EntityListPage({ title, description, service, basePath, entityLabel, columns, getSearchText, filters = [], renderCard, showCreate = true, showView = true, showEdit = true, showDelete = true }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);
  const [view, setView] = useState(() => (renderCard ? readStoredView() : 'table'));

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try { setRows(await service.list()); } catch (e) { setError(e.message); } finally { setLoading(false); }
  }, [service]);
  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => rows.filter(row => {
    const matchesText = (getSearchText ? getSearchText(row) : Object.values(row).join(' ')).toLowerCase().includes(search.toLowerCase());
    const matchesFilter = !filter || [row.estado, row.rol].some(value => String(value || '').toLowerCase() === filter.toLowerCase());
    return matchesText && matchesFilter;
  }), [rows, search, filter, getSearchText]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  useEffect(() => { setPage(1); }, [search, filter]);
  useEffect(() => { if (page > pageCount) setPage(pageCount); }, [page, pageCount]);
  const visibleRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const remove = async () => {
    if (!deleteItem) return;
    setDeleting(true);
    try {
      await service.remove(deleteItem.id);
      setRows(items => items.filter(item => item.id !== deleteItem.id));
      setToast({ type: 'success', message: `${entityLabel} eliminado correctamente.` });
      setDeleteItem(null);
    } catch (e) {
      setToast({ type: 'error', message: e.message });
    } finally {
      setDeleting(false);
    }
  };

  const changeView = next => { setView(next); storeView(next); };
  const showCards = Boolean(renderCard) && view === 'cards';
  const hasActions = showView || showEdit || showDelete;

  const renderActions = row => (
    <div className="table-actions">
      {showView && <Link className="table-icon-button" title="Ver" aria-label="Ver" to={`${basePath}/${row.id}`}><Eye size={16} /></Link>}
      {showEdit && <Link className="table-icon-button" title="Editar" aria-label="Editar" to={`${basePath}/${row.id}/editar`}><Pencil size={16} /></Link>}
      {showDelete && <button type="button" className="table-icon-button danger-text" title="Eliminar" aria-label="Eliminar" onClick={() => setDeleteItem(row)}><Trash2 size={16} /></button>}
    </div>
  );
  const tableColumns = hasActions ? [...columns, { key: 'actions', label: 'Acciones', render: renderActions }] : columns;

  return (
    <>
      <PageHeader
        title={title}
        description={description}
        icon={sectionIcon(basePath)}
        action={showCreate ? <Link className="button button-primary" to={`${basePath}/${basePath.includes('demos') ? 'nueva' : 'nuevo'}`}><Plus size={17} /> Nuevo {entityLabel.toLowerCase()}</Link> : null}
      />
      <section className="panel table-panel">
        <div className="table-toolbar">
          <SearchBar value={search} onChange={setSearch} placeholder={`Buscar ${entityLabel.toLowerCase()}...`} />
          <div className="table-toolbar-actions">
            {renderCard && <ViewToggle value={view} onChange={changeView} />}
            <button type="button" className="button button-secondary button-compact" onClick={load}><RefreshCw size={15} /> Actualizar</button>
          </div>
        </div>
        {filters.length > 0 && (
          <div className="list-filters">
            <FilterChips options={filters} value={filter} onChange={setFilter} label="Filtrar listado" />
          </div>
        )}
        <ErrorMessage message={error} onRetry={load} />

        {showCards ? (
          <div className="cards-area">
            {loading ? <LoadingState label="Cargando información..." /> : !visibleRows.length ? (
              <EmptyState title="No encontramos registros" description="Probá cambiar la búsqueda o agregá un nuevo registro." />
            ) : (
              <div className="entity-grid">
                {visibleRows.map((row, index) => (
                  <React.Fragment key={row.id ?? index}>
                    {renderCard(row, { index, actions: renderActions(row) })}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        ) : (
          <DataTable columns={tableColumns} rows={visibleRows} loading={loading} emptyTitle="No encontramos registros" emptyDescription="Probá cambiar la búsqueda o agregá un nuevo registro." />
        )}

        {!loading && filtered.length > 0 && (
          <div className="pagination-bar">
            <span>Mostrando {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} de {filtered.length}</span>
            <div>
              <button className="pagination-button" disabled={page === 1} onClick={() => setPage(value => Math.max(1, value - 1))} aria-label="Página anterior"><ChevronLeft size={16} /></button>
              <span className="pagination-current">{page} / {pageCount}</span>
              <button className="pagination-button" disabled={page >= pageCount} onClick={() => setPage(value => Math.min(pageCount, value + 1))} aria-label="Página siguiente"><ChevronRight size={16} /></button>
            </div>
          </div>
        )}
      </section>
      <ConfirmModal
        open={!!deleteItem}
        title={`Eliminar ${entityLabel.toLowerCase()}`}
        message={`¿Seguro que querés eliminar “${deleteItem?.titulo || deleteItem?.nombre || ''}”? Esta acción no se puede deshacer.`}
        confirmText="Sí, eliminar"
        danger
        onConfirm={remove}
        onCancel={() => setDeleteItem(null)}
        loading={deleting}
      />
      <Toast toast={toast} onClose={() => setToast(null)} />
    </>
  );
}
