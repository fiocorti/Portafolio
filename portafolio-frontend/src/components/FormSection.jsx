import React from 'react';

const TINTS = ['tint-indigo', 'tint-cyan', 'tint-slate'];

// Agrupa campos de un formulario en una tarjeta con título e ícono.
// accent: indigo | cyan | slate (color de la franja superior y del ícono).
export default function FormSection({ title, icon: Icon, accent = 'indigo', index = 0, children }) {
  return (
    <section className={`form-section reveal ${TINTS[index % TINTS.length]} section-${accent}`} style={{ '--i': index }} aria-label={title}>
      <header className="form-section-head">
        {Icon && <span className={`form-section-icon accent-${accent}`} aria-hidden="true"><Icon size={17} /></span>}
        <h2>{title}</h2>
      </header>
      {children}
    </section>
  );
}
