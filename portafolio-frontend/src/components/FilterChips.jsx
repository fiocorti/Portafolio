import React from 'react';

// Filtros como chips. El valor vacío equivale a "Todos".
export default function FilterChips({ options, value, onChange, label = 'Filtrar' }) {
  const chip = (option, text) => {
    const active = value === option;
    return (
      <button
        key={option || 'all'}
        type="button"
        className={`filter-chip${active ? ' is-active' : ''}`}
        aria-pressed={active}
        onClick={() => onChange(option)}
      >
        {text}
      </button>
    );
  };
  return (
    <div className="filter-chips" role="group" aria-label={label}>
      {chip('', 'Todos')}
      {options.map(option => chip(option, option))}
    </div>
  );
}
