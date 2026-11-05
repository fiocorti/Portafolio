import React from 'react';
import EntityFormPage from '../../components/EntityFormPage';
import serviciosService from '../../services/serviciosService';
export default function ServicioEdit() { return <EntityFormPage title="Editar servicio" description="Actualizá los datos del servicio." service={serviciosService} basePath="/admin/servicios" kind="servicio" fields={['titulo', 'descripcion', 'icono', 'caracteristicas', 'estado']} />; }
