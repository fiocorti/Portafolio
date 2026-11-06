import React, { useEffect, useState } from 'react';

// Portada 16:9 a partir de una URL. Si no hay imagen, carga con error o aún no
// terminó de cargar, muestra un placeholder de marca con la inicial del registro.
export default function Cover({ src, alt = '', initial = '', className = '', tone = 'indigo' }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [src]);

  const showImage = Boolean(src) && !failed;
  const state = showImage ? (loaded ? 'loaded' : 'loading') : 'placeholder';

  return (
    <div className={`cover tone-${tone} ${className}`.trim()} data-state={state}>
      {showImage ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="cover-placeholder" aria-hidden="true">
          <span>{String(initial || '?').trim().charAt(0).toUpperCase()}</span>
        </span>
      )}
    </div>
  );
}
