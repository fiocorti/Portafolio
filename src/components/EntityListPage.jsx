import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Pencil, Trash2, Plus, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import PageHeader from './PageHeader';
import SearchBar from './SearchBar';
import DataTable from './DataTable';
import StatusBadge from './StatusBadge';
import ConfirmModal from './ConfirmModal';
import ErrorMessage from './ErrorMessage';
import Toast from './Toast';

export default function EntityListPage({ title, description, service, basePath, entityLabel, columns, getSearchText, filters = [], showCreate = true, showView = true, showEdit = true, showDelete = true }) {
  const [rows, setRows] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const [search, setSearch] = useState(''); const [filter, setFilter] = useState(''); const [page, setPage] = useState(1); const pageSize = 8; const [deleteItem, setDeleteItem] = useState(null); const [deleting, setDeleting] = useState(false); const [toast, setToast] = useState(null);
  const load = useCallback(async () => { setLoading(true); setError(''); try { setRows(await service.list()); } catch (e) { setError(e.message); } finally { setLoading(false); } }, [service]);
  useEffect(() => { load(); }, [load]);
  const filtered = useMemo(() => rows.filter(row => {
    const matchesText = (getSearchText ? getSearchText(row) : Object.values(row).join(' ')).toLowerCase().includes(search.toLowerCase());
    const matchesFilter = !filter || String(row.estado || row.rol || '').toLowerCase() === filter.toLowerCase();
    return matchesText && matchesFilter;
  }), [rows, search, filter, getSearchText]);
  useEffect(() => { setPage(1); }, [search, filter]);
  useEffect(() => { if (page > pageCount) setPage(pageCount); }, [page, pageCount]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visibleRows = filtered.slice((page - 1) * pageSize, page * pageSize);
  const remove = async () => { if (!deleteItem) return; setDeleting(true); try { await service.remove(deleteItem.id); setRows(items => items.filter(item => item.id !== deleteItem.id)); setToast({ type: 'success', message: `${entityLabel} eliminado correctamente.` }); setDeleteItem(null); } catch (e) { setToast({ type: 'error', message: e.message }); } finally { setDeleting(false); } };
  const actionColumn = { key: 'actions', label: 'Acciones', render: row => <div className="table-actions">{showView && <Link className="table-icon-button" title="Ver" to={`${basePath}/${row.id}`}><Eye size={16} /></Link>}{showEdit && <Link className="table-icon-button" title="Editar" to={`${basePath}/${row.id}/editar`}><Pencil size={16} /></Link>}{showDelete && <button className="table-icon-button danger-text" title="Eliminar" onClick={() => setDeleteItem(row)}><Trash2 size={16} /></button>}</div> };
  const visibleColumns = [...columns, ...(showView || showEdit || showDelete ? [actionColumn] : [])];
  return <>
    <PageHeader eyebrow="GESTIÓN DE CONTENIDO" title={title} description={description} action={showCreate ? <Link className="button button-primary" to={`${basePath}/${basePath.includes('demos') ? 'nueva' : 'nuevo'}`}><Plus size={17} /> Nuevo {entityLabel.toLowerCase()}</Link> : null} />
    <section className="panel table-panel"><div className="table-toolbar"><SearchBar value={search} onChange={setSearch} placeholder={`Buscar ${entityLabel.toLowerCase()}...`} />{filters.length > 0 && <select className="toolbar-select" value={filter} onChange={e => setFilter(e.target.value)}><option value="">Todos los filtros</option>{filters.map(f => <option key={f} value={f}>{f}</option>)}</select>}<button className="button button-secondary button-compact" onClick={load}><RefreshCw size={15} /> Actualizar</button></div><ErrorMessage message={error} onRetry={load} /><DataTable columns={visibleColumns} rows={visibleRows} loading={loading} emptyTitle="No encontramos registros" emptyDescription="Probá cambiar la búsqueda o agregá un nuevo registro." />{!loading && filtered.length > 0 && <div className="pagination-bar"><span>Mostrando {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} de {filtered.length}</span><div><button className="pagination-button" disabled={page === 1} onClick={() => setPage(value => Math.max(1, value - 1))} aria-label="Página anterior"><ChevronLeft size={16} /></button><span className="pagination-current">{page} / {pageCount}</span><button className="pagination-button" disabled={page >= pageCount} onClick={() => setPage(value => Math.min(pageCount, value + 1))} aria-label="Página siguiente"><ChevronRight size={16} /></button></div></div>}</section>
    <ConfirmModal open={!!deleteItem} title={`Eliminar ${entityLabel.toLowerCase()}`} message={`¿Seguro que querés eliminar “${deleteItem?.titulo || deleteItem?.nombre || ''}”? Esta acción no se puede deshacer.`} confirmText="Sí, eliminar" danger onConfirm={remove} onCancel={() => setDeleteItem(null)} loading={deleting} />
    <Toast toast={toast} onClose={() => setToast(null)} />
  </>;
}
