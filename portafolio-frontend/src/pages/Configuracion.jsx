import React, { useEffect, useMemo, useRef, useState } from 'react';
import PageHeader from '../components/PageHeader';
import { Activity, Camera, UserRound, ShieldCheck, LogOut, Wifi, Database, CheckCircle2 } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { apiConfig } from '../services/api';

const PROFILE_KEY = 'admin-profile-settings';

export default function Configuracion() {
  const { user, logout } = useAuth();
  const fileRef = useRef(null);
  const [foto, setFoto] = useState('');

  const nombre = user?.nombre || user?.name || 'Administradora';
  const email = user?.email || 'Correo no disponible';
  const initials = useMemo(
    () => nombre.trim().split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase(),
    [nombre]
  );

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}');
      setFoto(stored.foto || '');
    } catch (_) { /* Se conserva el avatar con iniciales. */ }
  }, []);

  const choosePhoto = event => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      window.alert('Seleccioná un archivo de imagen válido.');
      event.target.value = '';
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      window.alert('La imagen debe pesar menos de 4 MB.');
      event.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const nextPhoto = reader.result;
      setFoto(nextPhoto);
      localStorage.setItem(PROFILE_KEY, JSON.stringify({ foto: nextPhoto }));
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setFoto('');
    localStorage.removeItem(PROFILE_KEY);
    if (fileRef.current) fileRef.current.value = '';
  };

  return <>
    <PageHeader title="Configuración" description="Administrá tu perfil y consultá el estado técnico del sistema." icon={Activity} />
    <div className="settings-page">
      <div className="settings-layout settings-profile-diagnostic-layout">
        <aside className="panel settings-identity settings-feature-card">
          <div className="settings-card-heading">
            <div><span className="eyebrow">PROPIETARIA DEL PORTFOLIO</span><h3>Tu perfil</h3></div>
            <span className="settings-heading-icon"><UserRound size={19} /></span>
          </div>
          <div className="settings-avatar-wrap">
            <div className="settings-avatar">
              {foto ? <img src={foto} alt="Foto de perfil" /> : <span>{initials}</span>}
            </div>
            <button type="button" className="settings-camera-button" aria-label="Cambiar foto de perfil" onClick={() => fileRef.current?.click()}><Camera size={17} /></button>
            <input ref={fileRef} className="settings-file-input" type="file" accept="image/png,image/jpeg,image/webp" onChange={choosePhoto} />
          </div>
          <h3 className="settings-identity-name">{nombre}</h3>
          <p className="settings-identity-email">{email}</p>
          <span className="settings-role"><ShieldCheck size={13} /> Acceso administrador</span>
          <button type="button" className="button button-secondary settings-photo-button" onClick={() => fileRef.current?.click()}><Camera size={16} /> Cambiar fotografía</button>
          {foto && <button type="button" className="button button-ghost settings-remove-photo" onClick={removePhoto}>Quitar fotografía</button>}
          <p className="settings-photo-hint">JPG, PNG o WEBP · Máximo 4 MB</p>
          <div className="settings-identity-divider" />
          <div className="settings-account-note"><span className="settings-online-dot" /><div><strong>Sesión iniciada</strong><small>Estás administrando tu portfolio</small></div></div>
          <button type="button" className="button button-ghost settings-logout" onClick={logout}><LogOut size={16} /> Cerrar sesión</button>
        </aside>

        <section className="panel settings-preferences settings-feature-card settings-diagnostic-card">
          <div className="settings-card-heading">
            <div><span className="eyebrow">DIAGNÓSTICO</span><h3>Estado del sistema</h3><p>Información técnica de la conexión configurada para este panel.</p></div>
            <span className="settings-heading-icon settings-heading-icon-cyan"><Activity size={19} /></span>
          </div>
          <div className="settings-system-grid">
            <div className="settings-system-item">
              <span className="settings-system-symbol"><Wifi size={18} /></span>
              <div><small>Conexión de API</small><strong>{apiConfig.baseUrl ? 'URL configurada' : 'Mismo dominio'}</strong><span>{apiConfig.baseUrl || 'URL relativa al mismo dominio'}</span></div>
              <CheckCircle2 className="settings-system-check" size={19} />
            </div>
            <div className="settings-system-item">
              <span className="settings-system-symbol settings-system-symbol-cyan"><Database size={18} /></span>
              <div><small>Entorno de trabajo</small><strong>{apiConfig.mocksEnabled ? 'Modo demostración' : 'API configurada'}</strong><span>{apiConfig.mocksEnabled ? 'Se utilizan datos de prueba' : 'El panel está configurado para usar la API'}</span></div>
              <span className={`mode-tag ${apiConfig.mocksEnabled ? 'mode-demo' : 'mode-live'}`}>{apiConfig.mocksEnabled ? 'DEMO' : 'API'}</span>
            </div>
          </div>
          <p className="settings-system-disclaimer">Estos indicadores muestran la configuración del entorno; no representan una prueba en tiempo real de disponibilidad del servidor.</p>
        </section>
      </div>
    </div>
  </>;
}
