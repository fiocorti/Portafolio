
import React from 'react';
import EntityListPage from '../../components/EntityListPage';
import ServiceCard from '../../components/ServiceCard';
import serviciosService from '../../services/serviciosService';
import StatusBadge from '../../components/StatusBadge';

// El backend devuelve las características como texto.
// Las convertimos a una lista para mostrarlas en el frontend.
const getCaracteristicas = row => {
  const value = row.caracteristicas;

  if (Array.isArray(value)) return value;

  if (typeof value === 'string' && value.trim()) {
    return value
      .split(/\r?\n/)
      .map(item => item.trim())
      .filter(Boolean);
  }

  return [];
};

const columns = [
  {
    key: 'titulo',
    label: 'Servicio',
    render: row => (
      <div className="table-primary-cell">
        <span className="table-placeholder">
          {String(row.titulo || row.nombre || 'S').charAt(0).toUpperCase()}
        </span>
        <div>
          <strong>{row.titulo || row.nombre}</strong>
          <small>{row.descripcion}</small>
        </div>
      </div>
    )
  },
  {
    key: 'caracteristicas',
    label: 'Características',
    render: row => (
      <span>{getCaracteristicas(row).length} elementos</span>
    )
  },
  {
    key: 'estado',
    label: 'Estado',
    render: row => <StatusBadge status={row.estado} />
  }
];

const renderCard = (row, { index, actions }) => (
  <ServiceCard
    title={row.titulo || row.nombre}
    description={row.descripcion}
    to={`/admin/servicios/${row.id || row.id_servicio}`}
    icono={row.icono || row.icono_url}
    estado={row.estado}
    features={getCaracteristicas(row)}
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
      getSearchText={row =>
        `${row.titulo || row.nombre || ''} ${row.descripcion || ''} ${getCaracteristicas(row).join(' ')}`
      }
      filters={['Publicado', 'Borrador']}
    />
  );
}
