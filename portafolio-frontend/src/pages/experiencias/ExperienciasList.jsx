
import React from 'react';

import EntityListPage from '../../components/EntityListPage';
import StatusBadge from '../../components/StatusBadge';

import experienciasService from '../../services/experienciasService';

function formatDate(value) {
  if (!value) return 'Actualidad';

  const dateOnly = String(value).slice(0, 10);
  const parts = dateOnly.split('-');

  if (parts.length !== 3) return dateOnly;

  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

const columns = [
  {
    key: 'titulo',
    label: 'Experiencia',
    render: row => (
      <div className="table-primary-cell">
        <span className="table-placeholder">
          {String(row.titulo || 'E').charAt(0).toUpperCase()}
        </span>

        <div>
          <strong>{row.titulo}</strong>
          <small>{row.descripcion || 'Sin descripción'}</small>
        </div>
      </div>
    )
  },

  {
    key: 'categoria',
    label: 'Categoría'
  },

  {
    key: 'periodo',
    label: 'Período',
    render: row => (
      <span>
        {formatDate(row.fecha_inicio)} – {formatDate(row.fecha_fin)}
      </span>
    )
  },

  {
    key: 'estado',
    label: 'Estado',
    render: row => <StatusBadge status={row.estado} />
  }
];

export default function ExperienciasList() {
  return (
    <EntityListPage
      title="Experiencia"
      description="Gestioná tu trayectoria profesional, académica y de aprendizaje."
      service={experienciasService}
      basePath="/admin/experiencias"
      entityLabel="Experiencia"
      columns={columns}
      getSearchText={row =>
        `${row.titulo || ''} ${row.categoria || ''} ${row.descripcion || ''} ${row.estado || ''}`
      }
      showCreate={true}
      showView={false}
      showEdit={false}
      showDelete={false}
    />
  );
}
