
import React from 'react';
import EntityFormPage from '../../components/EntityFormPage';
import EntityPreview from '../../components/EntityPreview';
import proyectosService from '../../services/proyectosService';

function prepararProyecto(values) {
  return {
    nombre: values.titulo.trim(),
    descripcion: values.descripcion.trim(),
    imagen_url: values.imagen || null,
    repositorio_url: values.repositorio || null,
    demo_url: values.demo || null,
    estado: values.estado || 'Borrador',
    tecnologias: (values.tecnologias || []).map(tecnologia => ({
      nombre: tecnologia.nombre,
      categoria: tecnologia.categoria || ''
    }))
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
