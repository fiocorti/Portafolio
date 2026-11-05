import React from 'react';
import EntityDetailPage from '../../components/EntityDetailPage';
import demosService from '../../services/demosService';
export default function DemoDetail() { return <EntityDetailPage title="Detalle de la demo" service={demosService} basePath="/admin/demos" fields={[{ key: 'tecnologias', label: 'Tecnologías' }, { key: 'url', label: 'URL' }, { key: 'estado', label: 'Estado' }]} />; }
