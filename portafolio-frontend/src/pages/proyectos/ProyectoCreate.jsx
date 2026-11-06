import React from 'react';
import EntityFormPage from '../../components/EntityFormPage';
import EntityPreview from '../../components/EntityPreview';
import proyectosService from '../../services/proyectosService';

export default function ProyectoCreate() {
  return (
    <EntityFormPage
      title="Nuevo proyecto"
      description="Completá los datos para incorporar un proyecto al portfolio."
      service={proyectosService}
      basePath="/admin/proyectos"
      kind="proyecto"
      fields={['titulo', 'descripcion', 'imagen', 'tecnologias', 'repositorio', 'demo', 'estado']}
      renderPreview={values => <EntityPreview values={values} />}
    />
  );
}
