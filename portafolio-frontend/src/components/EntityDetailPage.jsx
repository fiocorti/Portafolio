import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ExternalLink, Pencil } from 'lucide-react';
import PageHeader from './PageHeader';
import Cover from './Cover';
import StatusBadge from './StatusBadge';
import LoadingState from './LoadingState';
import ErrorMessage from './ErrorMessage';
import sectionIcon, { sectionTone } from './sectionIcons';

const LINKS = [
  { key: 'repositorio', label: 'Ver repositorio' },
  { key: 'demo', label: 'Ver demo' },
  { key: 'url', label: 'Abrir demo' }
];

function renderValue(value) {
  if (Array.isArray(value)) {
    if (!value.length) return '—';
    return <span className="tag-list">{value.map((item, index) => <span key={`${item}-${index}`} className="tech-chip">{item}</span>)}</span>;
  }
  return value || '—';
}

// Detalle: hero con título y estado, y dos tarjetas: descripción y lista de datos.
// Sin imagen, el hero usa el tono de la sección y su ícono de marca.
export default function EntityDetailPage({ title, service, basePath, fields }) {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    service.get(id).then(setItem).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, [service, id]);

  const name = item ? (item.titulo || item.nombre || title) : title;
  const links = item ? LINKS.filter(link => item[link.key]) : [];
  const Icon = sectionIcon(basePath);
  const tone = sectionTone(basePath);

  return (
    <>
      <PageHeader
        title={title}
        backTo={basePath}
        icon={Icon}
        action={<Link className="button button-primary" to={`${basePath}/${id}/editar`}><Pencil size={16} aria-hidden="true" /> Editar</Link>}
      />
      {loading ? <LoadingState /> : error ? <ErrorMessage message={error} /> : item && (
        <article className="detail-stack">
          <header className="detail-hero reveal">
            <Cover src={item.imagen} alt="" initial={name} tone={tone} />
            <div className="detail-hero-overlay" aria-hidden="true" />
            {Icon && <span className="detail-hero-glyph" aria-hidden="true"><Icon size={40} strokeWidth={1.5} /></span>}
            <div className="detail-hero-content">
              {item.estado && <StatusBadge status={item.estado} />}
              <h2 className="detail-hero-title">{name}</h2>
            </div>
          </header>

          <div className="detail-cards">
            <section className="panel detail-card section-indigo reveal" style={{ '--i': 1 }} aria-label="Descripción">
              <span className="card-eyebrow">Descripción</span>
              <p className="detail-lead">{item.descripcion || 'Sin descripción.'}</p>
              {links.length > 0 && (
                <div className="detail-links">
                  {links.map((link, index) => (
                    <a key={link.key} className={`button ${index === 0 ? 'button-primary' : 'button-secondary'}`} href={item[link.key]} target="_blank" rel="noreferrer">
                      {link.label} <ExternalLink size={15} aria-hidden="true" />
                    </a>
                  ))}
                </div>
              )}
            </section>

            <section className="panel detail-card section-cyan reveal" style={{ '--i': 2 }} aria-label="Información">
              <span className="card-eyebrow">Información</span>
              <dl className="detail-list">
                {fields.map(field => (
                  <div key={field.key} className="detail-row">
                    <dt>{field.label}</dt>
                    <dd>{renderValue(item[field.key])}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>
        </article>
      )}
    </>
  );
}
