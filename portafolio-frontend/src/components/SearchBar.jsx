import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Buscar...', className = '' }) {
  return <label className={`search-field ${className}`}><Search size={17} /><input value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} /><button type="button" aria-label="Limpiar búsqueda" onClick={() => onChange('')} className={!value ? 'visually-hidden' : ''}><X size={15} /></button></label>;
}
