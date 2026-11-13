import React from 'react';
import { Link } from 'react-router-dom';
import Cover from './Cover';
import StatusBadge from './StatusBadge';

const MAX_TAGS = 3;

// Tarjeta visual de un registro. variant="media" usa portada 16:9 con título sobre la imagen;
// variant="icon" usa un glifo de marca (para servicios, que no tienen imagen).
// Si recibe `to`, toda la tarjeta enlaza al detalle mediante un enlace superpuesto;
// las acciones quedan por encima para que sigan siendo clicables.
export default function EntityCard({
  title, description, to, image, initial, status, tags = [], meta = '',
  actions = null, variant = 'media', icon: Icon, index = 0, tone = 'indigo'
}) {
  const name = title || 'Sin título';
  const shownTags = tags.slice(0, MAX_TAGS);
  const extra = tags.length - shownTags.length;
  const heading = <h3 className="entity-card-title">{name}</h3>;

  return (
    <article className={`entity-card entity-card-${variant} tone-${tone} reveal`} style={{ '--i': index }}>
      {to && <Link to={to} className="entity-card-hit" aria-label={`Ver ${name}`} />}

      {variant === 'media' ? (
        <div className="entity-card-cover">
          <Cover src={image} alt="" initial={initial || name} tone={tone} />
          <div className="entity-card-overlay" aria-hidden="true" />
          {status && <div className="entity-card-status"><StatusBadge status={status} /></div>}
          <div className="entity-card-heading">{heading}</div>
        </div>
      ) : (
        <div className="entity-card-top">
          <span className={`entity-card-glyph tone-${tone}`} aria-hidden="true">
            {Icon ? <Icon size={22} strokeWidth={1.8} /> : String(initial || name).charAt(0).toUpperCase()}
          </span>
          {status && <StatusBadge status={status} />}
        </div>
      )}

      <div className="entity-card-body">
        {variant !== 'media' && heading}
        <p className="entity-card-desc">{description || 'Sin descripción.'}</p>
        {shownTags.length > 0 && (
          <div className="tag-list">
            {shownTags.map(tag => <span key={tag} className="tech-chip">{tag}</span>)}
            {extra > 0 && <span className="tech-chip tech-chip-more">+{extra}</span>}
          </div>
        )}
      </div>

      <footer className="entity-card-footer">
        <span className="entity-card-meta">{meta}</span>
        {actions && <div className="entity-card-actions">{actions}</div>}
      </footer>
    </article>
  );
}
