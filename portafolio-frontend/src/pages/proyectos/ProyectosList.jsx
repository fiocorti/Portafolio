import React from 'react';
import EntityListPage from '../../components/EntityListPage';
import EntityCard from '../../components/EntityCard';
import proyectosService from '../../services/proyectosService';
import StatusBadge from '../../components/StatusBadge';
import { formatDate } from '../../utils/format';

const columns = [
  { key: 'titulo', label: 'Proyecto', render: row => <div className="table-primary-cell">{row.imagen ? <img src={row.imagen} alt="" /> : <span className="table-placeholder">P</span>}<div><strong>{row.titulo}</strong><small>{row.descripcion}</small></div></div> },
  { key: 'tecnologias', label: 'Tecnologías', render: row => <div className="tag-list">{(row.tecnologias || []).slice(0, 3).map(tag => <span key={tag} className="mini-tag">{tag}</span>)}</div> },
  { key: 'estado', label: 'Estado', render: row => <StatusBadge status={row.estado} /> },
  { key: 'fecha', label: 'Fecha' }
];

const renderCard = (row, { index, actions }) => (
  <EntityCard
    title={row.titulo}
    description={row.descripcion}
    to={`/admin/proyectos/${row.id}`}
    image={row.imagen}
    initial={row.titulo}
    status={row.estado}
    tags={row.tecnologias || []}
    meta={formatDate(row.fecha)}
    actions={actions}
    index={index}
  />
);

export default function ProyectosList() {
  return (
    <EntityListPage
      title="Proyectos"
      description="Administrá los trabajos que se muestran en tu portfolio."
      service={proyectosService}
      basePath="/admin/proyectos"
      entityLabel="Proyecto"
      columns={columns}
      renderCard={renderCard}
      getSearchText={row => `${row.titulo} ${row.descripcion} ${(row.tecnologias || []).join(' ')}`}
      filters={['Publicado', 'Borrador']}
    />
  );
}
