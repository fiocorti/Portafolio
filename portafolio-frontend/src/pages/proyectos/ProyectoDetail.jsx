import React from 'react';
import EntityDetailPage from '../../components/EntityDetailPage';
import proyectosService from '../../services/proyectosService';
export default function ProyectoDetail() { return <EntityDetailPage title="Detalle del proyecto" service={proyectosService} basePath="/admin/proyectos" fields={[{ key: 'tecnologias', label: 'Tecnologías' }, { key: 'fecha', label: 'Fecha' }, { key: 'estado', label: 'Estado' }]} />; }
