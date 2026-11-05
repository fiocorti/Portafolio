import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, FlaskConical, Briefcase, Users, MessageSquareText, BarChart3, Settings, X, LogOut, Sparkles } from 'lucide-react';
import useAuth from '../hooks/useAuth';

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/proyectos', label: 'Proyectos', icon: FolderKanban },
  { to: '/admin/demos', label: 'Demos', icon: FlaskConical },
  { to: '/admin/servicios', label: 'Servicios', icon: Briefcase },
  { to: '/admin/usuarios', label: 'Usuarios', icon: Users, admin: true },
  { to: '/admin/consultas', label: 'Consultas', icon: MessageSquareText },
  { to: '/admin/estadisticas', label: 'Estadísticas', icon: BarChart3, admin: true },
  { to: '/admin/configuracion', label: 'Configuración', icon: Settings, admin: true }
];

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const role = String(user?.rol || user?.role || '').toLowerCase();
  const isAdmin = ['administrador', 'admin'].includes(role);
  const visibleLinks = links.filter(link => isAdmin || (!link.admin && ['/admin', '/admin/consultas'].includes(link.to)));
  return (
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
      <div className="sidebar-brand">
        <div className="brand-mark"><Sparkles size={19} /></div>
        <div><strong>PORTFOLIO</strong><small>ADMIN STUDIO</small></div>
        <button className="icon-button sidebar-close" onClick={onClose} aria-label="Cerrar menú"><X size={19} /></button>
      </div>
      <div className="sidebar-caption">MENÚ PRINCIPAL</div>
      <nav className="sidebar-nav">
        {visibleLinks.map(({ to, label, icon: Icon, exact }) => (
          <NavLink key={to} to={to} exact={!!exact} onClick={onClose} className="nav-link" activeClassName="nav-link-active">
            <Icon size={18} strokeWidth={1.8} /><span>{label}</span>
            {location.pathname === to && <i className="nav-active-dot" />}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-user-avatar">{(user?.nombre || user?.name || 'A').charAt(0).toUpperCase()}</div>
        <div className="sidebar-user-info"><strong>{user?.nombre || user?.name || 'Administrador'}</strong><small>{user?.rol || user?.role || 'Administrador'}</small></div>
        <button className="icon-button logout-button" title="Cerrar sesión" onClick={logout}><LogOut size={17} /></button>
      </div>
    </aside>
  );
}
