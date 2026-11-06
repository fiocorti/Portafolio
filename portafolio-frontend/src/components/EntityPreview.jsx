import React from 'react';
import EntityCard from './EntityCard';
import { hostOf } from '../utils/format';

// Vista previa en vivo: recibe los valores del formulario tal como están escritos.
// Las tecnologías llegan como texto separado por comas, igual que en el formulario.
export default function EntityPreview({ values, tone = 'indigo' }) {
  const name = String(values.titulo || '').trim() || 'Título del proyecto';
  const description = String(values.descripcion || '').trim() || 'La descripción aparece acá mientras escribís.';
  const tags = String(values.tecnologias || '').split(',').map(item => item.trim()).filter(Boolean);
  const host = hostOf(values.repositorio || values.url || values.demo);

  return (
    <div className="entity-preview">
      <EntityCard
        title={name}
        description={description}
        image={values.imagen}
        initial={name}
        status={values.estado || 'Borrador'}
        tags={tags}
        meta={host || 'Así se verá en el listado'}
        index={0}
        tone={tone}
      />
    </div>
  );
}
