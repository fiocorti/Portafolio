import React, { useEffect, useState } from 'react';
import { AlertCircle, ImagePlus, Link2 } from 'lucide-react';

// Carga por URL con vista previa 16:9. Verifica la imagen con un precargado para
// mostrar estados claros: vacío, cargando, lista, URL inválida o error.
export default function ImageUploader({ value, onChange, label = 'Imagen de portada' }) {
  const url = String(value || '').trim();
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    if (!url) {
      setStatus('idle');
      return undefined;
    }
    if (!/^https?:\/\//i.test(url)) {
      setStatus('invalid');
      return undefined;
    }
    let active = true;
    const probe = new Image();
    setStatus('loading');
    probe.onload = () => { if (active) setStatus('ok'); };
    probe.onerror = () => { if (active) setStatus('error'); };
    probe.src = url;
    return () => {
      active = false;
      probe.onload = null;
      probe.onerror = null;
    };
  }, [url]);

  const messages = {
    idle: <><ImagePlus size={26} aria-hidden="true" /><span>Pegá una URL para ver la portada</span></>,
    loading: <><span className="spinner" aria-hidden="true" /><span>Cargando vista previa…</span></>,
    invalid: <><AlertCircle size={22} aria-hidden="true" /><span>La URL debe empezar con http:// o https://</span></>,
    error: <><AlertCircle size={22} aria-hidden="true" /><span>No pudimos cargar la imagen. Revisá la URL.</span></>
  };

  return (
    <div className="form-field image-uploader">
      <label htmlFor="imagen">{label}</label>
      <div className={`cover-field is-${status}`}>
        {status === 'ok' && <img src={url} alt="Vista previa de la portada" />}
        {messages[status] && <div className="cover-field-state" aria-live="polite">{messages[status]}</div>}
      </div>
      <div className="input-with-icon">
        <Link2 size={16} aria-hidden="true" />
        <input
          id="imagen"
          name="imagen"
          value={value || ''}
          onChange={event => onChange('imagen', event.target.value)}
          placeholder="https://..."
          aria-invalid={status === 'error' || status === 'invalid'}
        />
      </div>
      <small className="field-help">Pegá una URL pública de imagen (16:9 recomendado). La carga de archivos locales requiere soporte multipart en el backend.</small>
    </div>
  );
}
