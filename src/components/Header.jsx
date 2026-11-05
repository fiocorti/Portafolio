import React from 'react';
import { Menu } from 'lucide-react';
import useAuth from '../hooks/useAuth';

export default function Header({ title, onMenu }) {
  const { user } = useAuth();
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="icon-button mobile-menu-button" onClick={onMenu} aria-label="Abrir menú"><Menu size={21} /></button>
        <div><div className="topbar-kicker">PANEL DE CONTROL <span>/</span> {title.toUpperCase()}</div><h1>{title}</h1></div>
      </div>
      <div className="topbar-actions">
        <span className="topbar-date">Espacio de administración</span>
        <div className="topbar-avatar" title={user?.nombre || user?.name || 'Administrador'}>{(user?.nombre || user?.name || 'A').charAt(0).toUpperCase()}</div>
      </div>
    </header>
  );
}
