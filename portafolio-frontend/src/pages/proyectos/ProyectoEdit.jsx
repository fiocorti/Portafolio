import React from 'react';
import EntityFormPage from '../../components/EntityFormPage';
import EntityPreview from '../../components/EntityPreview';
import proyectosService from '../../services/proyectosService';

function prepararProyecto(values) {
  return {
    nombre: (values.titulo || '').trim(),
    descripcion: (values.descripcion || '').trim(),
    imagen_url: values.imagen || null,
    repositorio_url: values.repositorio || null,
    demo_url: values.demo || null,
    estado: values.estado || 'Borrador',
    tecnologias: (values.tecnologias || []).map(tecnologia => ({
      nombre: typeof tecnologia === 'string'
        ? tecnologia
        : tecnologia.nombre,
      categoria: typeof tecnologia === 'string'
        ? ''
        : tecnologia.categoria || ''
    }))
  };
}

function cargarProyecto(proyecto) {
  return {
    titulo: proyecto.titulo || proyecto.nombre || '',
    descripcion: proyecto.descripcion || '',
    imagen: proyecto.imagen || proyecto.imagen_url || '',
    repositorio: proyecto.repositorio || proyecto.repositorio_url || '',
    demo: proyecto.demo || proyecto.demo_url || '',
    estado: proyecto.estado || 'Borrador',
    tecnologias: proyecto.tecnologias || []
  };
}

export default function ProyectoEdit() {
  return (
    <EntityFormPage
      title="Editar proyecto"
      description="Modificá los datos del proyecto seleccionado."
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
      transformIn={cargarProyecto}
      transformOut={prepararProyecto}
      renderPreview={values => (
        <EntityPreview values={values} />
      )}
    />
  );
}