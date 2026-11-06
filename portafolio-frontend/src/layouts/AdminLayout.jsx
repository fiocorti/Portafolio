import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const titles = [
  ['/admin/proyectos', 'Proyectos'], ['/admin/demos', 'Demos'], ['/admin/servicios', 'Servicios'],
  ['/admin/usuarios', 'Usuarios'], ['/admin/consultas', 'Consultas'], ['/admin/configuracion', 'Configuración']
];

export default function AdminLayout({ children }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const title = location.pathname === '/admin' ? 'Estadísticas' : (titles.find(([path]) => location.pathname.startsWith(path)) || [null, 'Administración'])[1];

  useEffect(() => {
    try { document.body.classList.toggle('compact-mode', localStorage.getItem('admin-compact-mode') === 'true'); } catch (_) { /* almacenamiento no disponible */ }
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = event => { if (event.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div className="admin-shell">
      <div className="ambient" aria-hidden="true">
        <span className="blob blob-indigo" />
        <span className="blob blob-cyan" />
        <span className="blob blob-slate" />
        <span className="blob blob-slate-cyan" />
      </div>
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="admin-main">
        <Header title={title} onMenu={() => setOpen(true)} menuOpen={open} />
        <main className="page-content">{children}</main>
        <footer className="app-footer">Portfolio personal — Panel administrativo</footer>
      </div>
      {open && <button type="button" className="sidebar-backdrop" aria-label="Cerrar menú" onClick={() => setOpen(false)} />}
    </div>
  );
}
