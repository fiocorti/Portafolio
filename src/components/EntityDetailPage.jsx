import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Pencil, ExternalLink } from 'lucide-react';
import PageHeader from './PageHeader';
import LoadingState from './LoadingState';
import ErrorMessage from './ErrorMessage';
import StatusBadge from './StatusBadge';

export default function EntityDetailPage({ title, service, basePath, fields }) {
  const { id } = useParams(); const [item, setItem] = useState(null); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  useEffect(() => { service.get(id).then(setItem).catch(e => setError(e.message)).finally(() => setLoading(false)); }, [service, id]);
  return <><PageHeader eyebrow="DETALLE DEL REGISTRO" title={title} backTo={basePath} action={<Link className="button button-primary" to={`${basePath}/${id}/editar`}><Pencil size={16} /> Editar</Link>} />{loading ? <LoadingState /> : error ? <ErrorMessage message={error} /> : item && <article className="panel detail-panel">{item.imagen && <img className="detail-cover" src={item.imagen} alt={item.titulo || title} />}{item.estado && <StatusBadge status={item.estado} />}<h3>{item.titulo || item.nombre}</h3><p className="detail-description">{item.descripcion || 'Sin descripción.'}</p><div className="detail-grid">{fields.map(field => <div key={field.key} className="detail-item"><span>{field.label}</span><strong>{Array.isArray(item[field.key]) ? item[field.key].join(', ') : (item[field.key] || '—')}</strong></div>)}</div>{(item.repositorio || item.url || item.demo) && <div className="detail-links">{[item.repositorio, item.url, item.demo].filter(Boolean).map((url, i) => <a href={url} target="_blank" rel="noreferrer" key={url}>Abrir enlace {i + 1} <ExternalLink size={14} /></a>)}</div>}</article>}</>;
}
