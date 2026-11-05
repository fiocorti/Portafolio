import React from 'react';
import EntityDetailPage from '../../components/EntityDetailPage';
import serviciosService from '../../services/serviciosService';
export default function ServicioDetail() { return <EntityDetailPage title="Detalle del servicio" service={serviciosService} basePath="/admin/servicios" fields={[{ key: 'icono', label: 'Icono' }, { key: 'caracteristicas', label: 'Características' }, { key: 'estado', label: 'Estado' }]} />; }
