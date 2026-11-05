import React from 'react';
import EntityFormPage from '../../components/EntityFormPage';
import serviciosService from '../../services/serviciosService';
export default function ServicioCreate() { return <EntityFormPage title="Nuevo servicio" description="Definí el servicio que vas a ofrecer en tu portfolio." service={serviciosService} basePath="/admin/servicios" kind="servicio" fields={['titulo', 'descripcion', 'icono', 'caracteristicas', 'estado']} />; }
