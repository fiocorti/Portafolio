
import React, { useEffect, useState } from 'react';
import { AlertCircle, ImagePlus } from 'lucide-react';

export default function ImageUploader({
  value,
  onChange,
  label = 'Imagen de portada'
}) {
  const [preview, setPreview] = useState('');

  useEffect(() => {
    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setPreview(url);

      return () => URL.revokeObjectURL(url);
    }

    setPreview(typeof value === 'string' ? value : '');
  }, [value]);

  const handleFile = event => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Seleccioná un archivo de imagen válido.');
      event.target.value = '';
      return;
    }

    onChange('imagen', file);
  };

  return (
    <div className="form-field image-uploader">
      <label htmlFor="imagen">{label}</label>

      <div className="cover-field">
        {preview ? (
          <img src={preview} alt="Vista previa de portada" />
        ) : (
          <div className="cover-field-state">
            <ImagePlus size={26} />
            <span>Seleccioná una imagen para el proyecto</span>
          </div>
        )}
      </div>

      <input
        id="imagen"
        name="imagen"
        type="file"
        accept="image/*"
        onChange={handleFile}
      />

      <small className="field-help">
        Seleccioná una imagen desde tu computadora.
        Formatos de imagen compatibles.
      </small>
    </div>
  );
}
