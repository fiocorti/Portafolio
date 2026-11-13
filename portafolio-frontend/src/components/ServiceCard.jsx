import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import StatusBadge from './StatusBadge';
import serviceIcon from './serviceIcons';

const PREVIEW_COUNT = 3;

// Tarjeta de servicio: ícono de marca en superficie oscura, descripción y las primeras características
// con check. El resto se resume en "+n más". Toda la tarjeta enlaza al detalle.
export default function ServiceCard({ title, description, to, icono, estado, features = [], actions = null, index = 0 }) {
  const Icon = serviceIcon(icono);
  const name = title || 'Sin título';
  const preview = features.slice(0, PREVIEW_COUNT);
  const extra = features.length - preview.length;

  return (
    <article className="entity-card svc-card reveal" style={{ '--i': index }}>
      {to && <Link to={to} className="entity-card-hit" aria-label={`Ver ${name}`} />}
      <div className="svc-card-top">
        <span className="svc-card-icon" aria-hidden="true"><Icon size={24} strokeWidth={1.7} /></span>
        {estado && <StatusBadge status={estado} />}
      </div>
      <div className="svc-card-body">
        <h3 className="svc-card-title">{name}</h3>
        <p className="svc-card-desc">{description || 'Sin descripción.'}</p>
        {preview.length > 0 && (
          <ul className="svc-card-list">
            {preview.map(feature => <li key={feature}><CheckCircle2 size={15} aria-hidden="true" /><span>{feature}</span></li>)}
            {extra > 0 && <li className="svc-card-more">+{extra} más</li>}
          </ul>
        )}
      </div>
      <footer className="entity-card-footer">
        <span className="entity-card-meta">{features.length} {features.length === 1 ? 'característica' : 'características'}</span>
        {actions && <div className="entity-card-actions">{actions}</div>}
      </footer>
    </article>
  );
}
