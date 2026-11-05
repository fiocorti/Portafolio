import React, { useEffect, useState } from 'react';
import { ImagePlus, Link2 } from 'lucide-react';

export default function ImageUploader({ value, onChange, label = 'Imagen de portada' }) {
  const [preview, setPreview] = useState(value || '');
  useEffect(() => { setPreview(value || ''); }, [value]);
  return <div className="form-field image-uploader"><label>{label}</label><div className="image-preview">{preview ? <img src={preview} alt="Vista previa" onError={() => setPreview('')} /> : <div><ImagePlus size={28} /><span>Vista previa de imagen</span></div>}</div><label className="input-with-icon"><Link2 size={16} /><input value={value || ''} onChange={event => { onChange('imagen', event.target.value); setPreview(event.target.value); }} placeholder="https://..." /></label><small className="field-help">Pegá una URL pública de imagen. La carga de archivos locales requiere soporte multipart en el backend.</small></div>;
}
