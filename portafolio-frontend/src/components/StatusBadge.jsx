import React from 'react';

export default function StatusBadge({ status }) {
  const value = String(status || 'sin estado').toLowerCase();
  const tone = ['publicado', 'activo', 'respondida', 'respondido'].includes(value) ? 'success' : ['borrador', 'pendiente', 'en revisión'].includes(value) ? 'warning' : ['inactivo', 'suspendido', 'archivado'].includes(value) ? 'muted' : 'info';
  return <span className={`status-badge status-${tone}`}><i />{status || 'Sin estado'}</span>;
}
