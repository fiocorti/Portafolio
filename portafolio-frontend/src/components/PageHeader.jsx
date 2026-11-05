import React from 'react';
import { Link } from 'react-router-dom';

export default function PageHeader({ eyebrow, title, description, action, backTo }) {
  return <div className="page-heading">
    <div>{eyebrow && <div className="eyebrow">{eyebrow}</div>}<h2>{title}</h2>{description && <p>{description}</p>}</div>
    <div className="page-heading-actions">{backTo && <Link className="button button-secondary" to={backTo}>Volver</Link>}{action}</div>
  </div>;
}
