
import React from 'react';
import EntityFormPage from '../../components/EntityFormPage';
import EntityPreview from '../../components/EntityPreview';
import proyectosService from '../../services/proyectosService';

function prepararProyecto(values) {
  return {
    nombre: (values.titulo || '').trim(),
    descripcion: (values.descripcion || '').trim(),
    imagen: values.imagen || null,
    repositorio_url: values.repositorio || '',
    demo_url: values.demo || '',
    estado: values.estado || 'Borrador',

    tecnologias_ids: (values.tecnologias || [])
      .map(tecnologia => {
        if (typeof tecnologia === 'object' && tecnologia !== null) {
          return tecnologia.id_tecnologia || tecnologia.id;
        }

        return null;
      })
      .filter(Boolean)
  };
}

export default function ProyectoCreate() {
  return (
    <EntityFormPage
      title="Nuevo proyecto"
      description="Completá los datos para incorporar un proyecto al portfolio."
      service={proyectosService}
      basePath="/admin/proyectos"
      kind="proyecto"
      fields={[
        'titulo',
        'descripcion',
        'imagen',
        'tecnologias',
        'repositorio',
        'demo',
        'estado'
      ]}
      transformOut={prepararProyecto}
      renderPreview={values => (
        <EntityPreview values={values} />
      )}
    />
  );
}
