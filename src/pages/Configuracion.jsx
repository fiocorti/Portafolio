import React, { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import useAuth from '../hooks/useAuth';
import { apiConfig } from '../services/api';

export default function Configuracion() {
  const { user, logout } = useAuth(); const [compact, setCompact] = useState(false); const [saved, setSaved] = useState(false);
  useEffect(() => { setCompact(localStorage.getItem('admin-compact-mode') === 'true'); }, []);
  const toggle = event => { setCompact(event.target.checked); localStorage.setItem('admin-compact-mode', String(event.target.checked)); setSaved(true); };
  return <><PageHeader title="Configuración" description="Preferencias básicas de tu espacio administrativo." /><div className="settings-grid"><section className="panel settings-card"><span className="eyebrow">CUENTA ACTIVA</span><div className="settings-profile"><div className="user-large-avatar">{(user?.nombre || user?.name || 'A').charAt(0)}</div><div><h3>{user?.nombre || user?.name || 'Administrador'}</h3><p>{user?.email || 'Correo no disponible'}</p><span className="role-pill">{user?.rol || user?.role || 'Rol no disponible'}</span></div></div><button className="button button-secondary" onClick={logout}>Cerrar sesión</button></section><section className="panel settings-card"><span className="eyebrow">PREFERENCIAS</span><h3>Visualización</h3><label className="switch-row"><span><strong>Vista compacta</strong><small>Reduce espacios en tablas y listados.</small></span><input type="checkbox" checked={compact} onChange={toggle} /></label>{saved && <p className="success-text">Preferencia guardada en este navegador.</p>}<div className="settings-info"><strong>Estado de conexión</strong><span className={`mode-tag ${apiConfig.mocksEnabled ? 'mode-demo' : 'mode-live'}`}>{apiConfig.mocksEnabled ? 'Modo demostración' : 'API configurada'}</span><small>{apiConfig.baseUrl || 'URL relativa al mismo dominio'}</small></div></section></div></>;
}
