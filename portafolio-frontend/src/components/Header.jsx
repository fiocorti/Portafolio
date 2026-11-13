import React from 'react';
import { ChevronRight, Menu } from 'lucide-react';
import useAuth from '../hooks/useAuth';

export default function Header({ title, onMenu, menuOpen = false }) {
  const { user } = useAuth();
  const name = user?.nombre || user?.name || 'Administrador';
  const today = new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button type="button" className="icon-button mobile-menu-button" onClick={onMenu} aria-label="Abrir menú" aria-expanded={menuOpen}><Menu size={22} /></button>
        <p className="topbar-title"><span>Panel</span><ChevronRight size={14} aria-hidden="true" /><span className="topbar-current">{title}</span></p>
      </div>
      <div className="topbar-actions">
        <span className="topbar-date">{today}</span>
        <div className="topbar-avatar" title={name} aria-label={`Sesión de ${name}`}>{name.charAt(0).toUpperCase()}</div>
      </div>
    </header>
  );
}
