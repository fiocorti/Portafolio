import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Reply } from 'lucide-react';
import EntityListPage from '../../components/EntityListPage';
import consultasService from '../../services/consultasService';
import StatusBadge from '../../components/StatusBadge';

const columns = [
  {
    key: 'nombre',
    label: 'Remitente',
    render: row => (
      <div className="table-primary-cell">
        <span className="user-table-avatar">
          {(row.nombre || 'C').charAt(0).toUpperCase()}
        </span>
        <div>
          <strong>{row.nombre || 'Sin nombre'}</strong>
          <small>{row.email}</small>
        </div>
      </div>
    )
  },
  {
    key: 'asunto',
    label: 'Asunto'
  },
  {
    key: 'fecha',
    label: 'Fecha',
    render: row =>
      row.fecha
        ? new Date(row.fecha).toLocaleDateString('es-AR')
        : '—'
  },
  {
    key: 'estado',
    label: 'Estado',
    render: row => <StatusBadge status={row.estado} />
  },
  {
    key: 'detail',
    label: 'Ver',
    render: row => (
      <div className="table-actions">
        <Link
          className="table-icon-button"
          to={`/admin/consultas/${row.id}`}
          title="Ver consulta"
        >
          <Eye size={16} />
        </Link>

        {row.estado !== 'Respondida' && (
          <Link
            className="table-icon-button"
            to={`/admin/consultas/${row.id}/responder`}
            title="Responder"
          >
            <Reply size={16} />
          </Link>
        )}
      </div>
    )
  }
];

export default function ConsultasList() {
  return (
    <EntityListPage
      title="Consultas"
      description="Leé y gestioná los mensajes enviados desde el formulario público."
      service={consultasService}
      basePath="/admin/consultas"
      entityLabel="Consulta"
      columns={columns}
      getSearchText={row =>
        `${row.nombre} ${row.email} ${row.asunto} ${row.mensaje}`
      }
      filters={['Pendiente', 'Respondida']}
      showCreate={false}
      showView={false}
      showEdit={false}
      showDelete={false}
    />
  );
}