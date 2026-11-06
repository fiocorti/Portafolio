import React from 'react';
import { LayoutGrid, List } from 'lucide-react';

export default function ViewToggle({ value, onChange }) {
  return (
    <div className="view-toggle" role="group" aria-label="Cambiar vista del listado">
      <button type="button" aria-pressed={value === 'cards'} onClick={() => onChange('cards')}>
        <LayoutGrid size={16} aria-hidden="true" /><span>Tarjetas</span>
      </button>
      <button type="button" aria-pressed={value === 'table'} onClick={() => onChange('table')}>
        <List size={16} aria-hidden="true" /><span>Tabla</span>
      </button>
    </div>
  );
}
