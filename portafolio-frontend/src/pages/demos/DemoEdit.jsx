import React from 'react';
import EntityFormPage from '../../components/EntityFormPage';
import demosService from '../../services/demosService';
export default function DemoEdit() { return <EntityFormPage title="Editar demo" description="Modificá los datos de esta demostración." service={demosService} basePath="/admin/demos" kind="demo" fields={['titulo', 'descripcion', 'imagen', 'tecnologias', 'url', 'estado']} />; }
