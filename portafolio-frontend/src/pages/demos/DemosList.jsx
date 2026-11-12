import React from 'react';
import EntityListPage from '../../components/EntityListPage';
import EntityCard from '../../components/EntityCard';
import demosService from '../../services/demosService';
import StatusBadge from '../../components/StatusBadge';
import { hostOf } from '../../utils/format';

const columns = [
  {
    key: 'titulo',
    label: 'Proyecto',
    render: row => (
      <div className="table-primary-cell">
        {row.imagen ? (
          <img src={row.imagen} alt="" />
        ) : (
          <span className="table-placeholder">D</span>
        )}

        <div>
          <strong>{row.titulo || row.nombre}</strong>
          <small>{row.descripcion || 'Sin descripción'}</small>
        </div>
      </div>
    )
  },
  {
    key: 'tecnologias',
    label: 'Tecnologías',
    render: row => (
      <div className="tag-list">
        {(row.tecnologias || []).slice(0, 3).map((tag, index) => (
          <span className="mini-tag" key={`${tag}-${index}`}>
            {typeof tag === 'string' ? tag : tag.nombre}
          </span>
        ))}
      </div>
    )
  },
  {
    key: 'url',
    label: 'Dirección de demo',
    render: row => (
      <a
        href={row.demo_url || row.url}
        target="_blank"
        rel="noreferrer"
      >
        Abrir demo
      </a>
    )
  },
  {
    key: 'estado',
    label: 'Estado',
    render: row => <StatusBadge status={row.estado} />
  }
];

const renderCard = (row, { index, actions }) => (
  <EntityCard
    title={row.titulo || row.nombre}
    description={row.descripcion}
    to={`/admin/demos/${row.id}`}
    tone="cyan"
    image={row.imagen}
    initial={row.titulo || row.nombre}
    status={row.estado}
    tags={row.tecnologias || []}
    meta={hostOf(row.demo_url || row.url)}
    actions={actions}
    index={index}
  />
);

export default function DemosList() {
  return (
    <EntityListPage
      title="Demos"
      description="Consultá las demostraciones asociadas a tus proyectos. Para agregar o cambiar una demo, editá el proyecto correspondiente."
      service={demosService}
      basePath="/admin/demos"
      entityLabel="Demo"
      columns={columns}
      renderCard={renderCard}
      getSearchText={row => (
        `${row.titulo || ''} ${row.nombre || ''} ${row.descripcion || ''} ${(row.tecnologias || []).join(' ')}`
      )}
      showCreate={false}
      showView={true}
      showEdit={false}
      showDelete={false}
    />
  );
}