import React from 'react';
import { NavLink } from 'react-router-dom';
import { FolderKanban, FlaskConical, Briefcase, Users, MessageSquareText, BarChart3, Settings, X, LogOut, Sparkles } from 'lucide-react';
import useAuth from '../hooks/useAuth';

const links = [
  { to: '/admin', label: 'Estadísticas', icon: BarChart3, exact: true },
  { to: '/admin/proyectos', label: 'Proyectos', icon: FolderKanban },
  { to: '/admin/demos', label: 'Demos', icon: FlaskConical },
  { to: '/admin/servicios', label: 'Servicios', icon: Briefcase },
  { to: '/admin/usuarios', label: 'Usuarios', icon: Users, admin: true },
  { to: '/admin/consultas', label: 'Consultas', icon: MessageSquareText },
  { to: '/admin/configuracion', label: 'Configuración', icon: Settings, admin: true }
];

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const role = String(user?.rol || user?.role || '').toLowerCase();
  const isAdmin = ['administrador', 'admin'].includes(role);
  const visibleLinks = links.filter(link => isAdmin || (!link.admin && ['/admin', '/admin/consultas'].includes(link.to)));
  const name = user?.nombre || user?.name || 'Administrador';
  return (
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`} aria-label="Barra lateral">
      <div className="sidebar-brand">
        <div className="brand-mark" aria-hidden="true"><Sparkles size={20} /></div>
        <div><strong>Portfolio</strong><small>Panel administrativo</small></div>
        <button type="button" className="icon-button sidebar-close" onClick={onClose} aria-label="Cerrar menú"><X size={20} /></button>
      </div>
      <div className="sidebar-caption">Menú</div>
      <nav className="sidebar-nav" aria-label="Navegación principal">
        {visibleLinks.map(({ to, label, icon: Icon, exact }) => (
          <NavLink key={to} to={to} exact={!!exact} onClick={onClose} className="nav-link" activeClassName="nav-link-active">
            <Icon size={19} strokeWidth={1.8} aria-hidden="true" /><span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-user-avatar" aria-hidden="true">{name.charAt(0).toUpperCase()}</div>
        <div className="sidebar-user-info"><strong>{name}</strong><small>{user?.rol || user?.role || 'Administrador'}</small></div>
        <button type="button" className="icon-button logout-button" title="Cerrar sesión" aria-label="Cerrar sesión" onClick={logout}><LogOut size={18} /></button>
      </div>
      <div className="sidebar-footer-deco" aria-hidden="true">Sistema visual v1.0</div>
    </aside>
  );
}
