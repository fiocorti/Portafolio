import React from 'react';
import EntityListPage from '../../components/EntityListPage';
import serviciosService from '../../services/serviciosService';
import StatusBadge from '../../components/StatusBadge';
const columns = [
  { key: 'titulo', label: 'Servicio', render: row => <div className="table-primary-cell"><span className="table-placeholder"><BriefcaseIcon /></span><div><strong>{row.titulo}</strong><small>{row.descripcion}</small></div></div> },
  { key: 'caracteristicas', label: 'Características', render: row => <span>{(row.caracteristicas || []).length} elementos</span> },
  { key: 'estado', label: 'Estado', render: row => <StatusBadge status={row.estado} /> }
];
function BriefcaseIcon() { return <span aria-hidden="true">S</span>; }
export default function ServiciosList() { return <EntityListPage title="Servicios" description="Gestioná los servicios profesionales ofrecidos en tu portfolio." service={serviciosService} basePath="/admin/servicios" entityLabel="Servicio" columns={columns} getSearchText={row => `${row.titulo} ${row.descripcion}`} filters={['Publicado', 'Borrador']} />; }
