import React from 'react';
import { Inbox } from 'lucide-react';

export default function EmptyState({ title = 'Sin resultados', description = 'No hay información para mostrar.', action }) {
  return <div className="empty-state"><div className="empty-icon"><Inbox size={24} /></div><h3>{title}</h3><p>{description}</p>{action}</div>;
}
