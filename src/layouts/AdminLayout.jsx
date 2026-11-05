import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const titles = [
  ['/admin/proyectos', 'Proyectos'], ['/admin/demos', 'Demos'], ['/admin/servicios', 'Servicios'],
  ['/admin/usuarios', 'Usuarios'], ['/admin/consultas', 'Consultas'], ['/admin/estadisticas', 'Estadísticas'],
  ['/admin/configuracion', 'Configuración']
];

export default function AdminLayout({ children }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const title = location.pathname === '/admin' ? 'Dashboard' : (titles.find(([path]) => location.pathname.startsWith(path)) || [null, 'Administración'])[1];
  return (
    <div className="admin-shell">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="admin-main">
        <Header title={title} onMenu={() => setOpen(true)} />
        <main className="page-content">{children}</main>
        <footer className="app-footer">Portfolio personal <span>·</span> Panel administrativo</footer>
      </div>
      {open && <button className="sidebar-backdrop" aria-label="Cerrar menú" onClick={() => setOpen(false)} />}
    </div>
  );
}
