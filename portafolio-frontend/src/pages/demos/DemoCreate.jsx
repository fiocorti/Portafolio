import React from 'react';
import EntityFormPage from '../../components/EntityFormPage';
import EntityPreview from '../../components/EntityPreview';
import demosService from '../../services/demosService';

export default function DemoCreate() {
  return (
    <EntityFormPage
      title="Nueva demo"
      description="Agregá una demostración para que pueda consultarse desde el portfolio."
      service={demosService}
      basePath="/admin/demos"
      kind="demo"
      fields={['titulo', 'descripcion', 'imagen', 'tecnologias', 'url', 'estado']}
      renderPreview={values => <EntityPreview values={values} tone="cyan" />}
    />
  );
}
