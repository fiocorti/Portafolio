import React from 'react';
import EntityListPage from '../../components/EntityListPage';
import demosService from '../../services/demosService';
import StatusBadge from '../../components/StatusBadge';
const columns = [
  { key: 'titulo', label: 'Demostración', render: row => <div className="table-primary-cell">{row.imagen ? <img src={row.imagen} alt="" /> : <span className="table-placeholder">D</span>}<div><strong>{row.titulo}</strong><small>{row.descripcion}</small></div></div> },
  { key: 'tecnologias', label: 'Tecnologías', render: row => <div className="tag-list">{(row.tecnologias || []).slice(0, 3).map(tag => <span key={tag} className="mini-tag">{tag}</span>)}</div> },
  { key: 'estado', label: 'Estado', render: row => <StatusBadge status={row.estado} /> }
];
export default function DemosList() { return <EntityListPage title="Demos" description="Administrá las demostraciones interactivas del portfolio." service={demosService} basePath="/admin/demos" entityLabel="Demo" columns={columns} getSearchText={row => `${row.titulo} ${row.descripcion} ${(row.tecnologias || []).join(' ')}`} filters={['Publicado', 'Borrador']} />; }
