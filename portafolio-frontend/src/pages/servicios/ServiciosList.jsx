import React from 'react';
import EntityListPage from '../../components/EntityListPage';
import ServiceCard from '../../components/ServiceCard';
import serviciosService from '../../services/serviciosService';
import StatusBadge from '../../components/StatusBadge';

const columns = [
  { key: 'titulo', label: 'Servicio', render: row => <div className="table-primary-cell"><span className="table-placeholder">{String(row.titulo || 'S').charAt(0).toUpperCase()}</span><div><strong>{row.titulo}</strong><small>{row.descripcion}</small></div></div> },
  { key: 'caracteristicas', label: 'Características', render: row => <span>{(row.caracteristicas || []).length} elementos</span> },
  { key: 'estado', label: 'Estado', render: row => <StatusBadge status={row.estado} /> }
];

const renderCard = (row, { index, actions }) => (
  <ServiceCard
    title={row.titulo}
    description={row.descripcion}
    to={`/admin/servicios/${row.id}`}
    icono={row.icono}
    estado={row.estado}
    features={Array.isArray(row.caracteristicas) ? row.caracteristicas : []}
    actions={actions}
    index={index}
  />
);

export default function ServiciosList() {
  return (
    <EntityListPage
      title="Servicios"
      description="Gestioná los servicios profesionales ofrecidos en tu portfolio."
      service={serviciosService}
      basePath="/admin/servicios"
      entityLabel="Servicio"
      columns={columns}
      renderCard={renderCard}
      getSearchText={row => `${row.titulo} ${row.descripcion} ${(row.caracteristicas || []).join(' ')}`}
      filters={['Publicado', 'Borrador']}
    />
  );
}
