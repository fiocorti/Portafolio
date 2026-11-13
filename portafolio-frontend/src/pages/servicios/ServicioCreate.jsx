
import React from 'react';
import EntityFormPage from '../../components/EntityFormPage';
import serviciosService from '../../services/serviciosService';

function transformarServicio(values) {
  return {
    nombre: String(values.titulo || '').trim(),
    descripcion: String(values.descripcion || '').trim(),
    icono_url: values.icono || null,
    caracteristicas: String(values.caracteristicas || '')
      .split(/\r?\n/)
      .map(item => item.trim())
      .filter(Boolean)
      .join('\n'),
    estado: values.estado || 'Borrador'
  };
}

export default function ServicioCreate() {
  return (
    <EntityFormPage
      title="Nuevo servicio"
      description="Definí el servicio que vas a ofrecer en tu portfolio."
      service={serviciosService}
      basePath="/admin/servicios"
      kind="servicio"
      fields={[
        'titulo',
        'descripcion',
        'icono',
        'caracteristicas',
        'estado'
      ]}
      transformOut={transformarServicio}
    />
  );
}
