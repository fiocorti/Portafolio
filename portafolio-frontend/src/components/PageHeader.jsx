import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

// Encabezado de página como banda decorativa. Si recibe `icon`, lo muestra en un
// recuadro con fondo de marca a la izquierda del título.
export default function PageHeader({ eyebrow, title, description, action, backTo, icon: Icon }) {
  return (
    <header className="page-band reveal">
      <div className="page-band-main">
        {Icon && <span className="page-band-icon" aria-hidden="true"><Icon size={30} strokeWidth={1.8} /></span>}
        <div className="page-band-text">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1>{title}</h1>
          {description && <p>{description}</p>}
        </div>
      </div>
      <div className="page-heading-actions">
        {backTo && <Link className="button button-secondary" to={backTo}><ArrowLeft size={16} aria-hidden="true" /> Volver</Link>}
        {action}
      </div>
    </header>
  );
}
