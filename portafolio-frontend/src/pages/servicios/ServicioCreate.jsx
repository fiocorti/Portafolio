
import React from 'react';
import EntityFormPage from '../../components/EntityFormPage';
import serviciosService from '../../services/serviciosService';

export default function ServicioCreate() {
  const transformarServicio = values => ({
    nombre: values.titulo,
    descripcion: values.descripcion,
    icono_url: values.icono || null,
    caracteristicas: values.caracteristicas
      .split('\n')
      .map(item => item.trim())
      .filter(Boolean)
      .join('\n'),
    estado: values.estado || 'Borrador'
  });

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
