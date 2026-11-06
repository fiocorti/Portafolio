import React from 'react';
import EntityListPage from '../../components/EntityListPage';
import EntityCard from '../../components/EntityCard';
import demosService from '../../services/demosService';
import StatusBadge from '../../components/StatusBadge';
import { hostOf } from '../../utils/format';

const columns = [
  { key: 'titulo', label: 'Demostración', render: row => <div className="table-primary-cell">{row.imagen ? <img src={row.imagen} alt="" /> : <span className="table-placeholder">D</span>}<div><strong>{row.titulo}</strong><small>{row.descripcion}</small></div></div> },
  { key: 'tecnologias', label: 'Tecnologías', render: row => <div className="tag-list">{(row.tecnologias || []).slice(0, 3).map(tag => <span key={tag} className="mini-tag">{tag}</span>)}</div> },
  { key: 'estado', label: 'Estado', render: row => <StatusBadge status={row.estado} /> }
];

const renderCard = (row, { index, actions }) => (
  <EntityCard
    title={row.titulo}
    description={row.descripcion}
    to={`/admin/demos/${row.id}`}
    tone="cyan"
    image={row.imagen}
    initial={row.titulo}
    status={row.estado}
    tags={row.tecnologias || []}
    meta={hostOf(row.url)}
    actions={actions}
    index={index}
  />
);

export default function DemosList() {
  return (
    <EntityListPage
      title="Demos"
      description="Administrá las demostraciones interactivas del portfolio."
      service={demosService}
      basePath="/admin/demos"
      entityLabel="Demo"
      columns={columns}
      renderCard={renderCard}
      getSearchText={row => `${row.titulo} ${row.descripcion} ${(row.tecnologias || []).join(' ')}`}
      filters={['Publicado', 'Borrador']}
    />
  );
}
