
import React from 'react';

import EntityListPage from '../../components/EntityListPage';
import tecnologiasService from '../../services/tecnologiasService';

const columns = [
  {
    key: 'nombre',
    label: 'Tecnología',
    render: row => (
      <div className="table-primary-cell">
        {row.icono_url ? (
          <img
            src={row.icono_url}
            alt={`Logo de ${row.nombre}`}
          />
        ) : (
          <span className="table-placeholder">
            {String(row.nombre || 'T').charAt(0).toUpperCase()}
          </span>
        )}

        <div>
          <strong>{row.nombre}</strong>
          <small>ID: {row.id}</small>
        </div>
      </div>
    )
  },
  {
    key: 'categoria',
    label: 'Categoría'
  },
  {
    key: 'uso',
    label: 'Uso en proyectos',
    render: () => (
      <span className="muted-text">
        Se verifica al eliminar
      </span>
    )
  }
];

export default function TecnologiasList() {
  return (
    <>
      <section
        className="panel"
        style={{
          padding: 16,
          marginBottom: 18
        }}
      >
        <strong>Administración de tecnologías</strong>

        <p
          className="muted-text"
          style={{ margin: '6px 0 0' }}
        >
          Administrá las tecnologías que forman parte del stack
          de tu portfolio.

          Una tecnología asociada a un proyecto no puede eliminarse.
          El servidor controla esta restricción.
        </p>
      </section>

      <EntityListPage
        title="Tecnologías"
        description="Consultá y administrá las tecnologías utilizadas en tus proyectos."
        service={tecnologiasService}
        basePath="/admin/tecnologias"
        entityLabel="Tecnología"
        columns={columns}
        getSearchText={row =>
          `${row.nombre || ''} ${row.categoria || ''}`
        }
        showCreate={true}
        showView={false}
        showEdit={false}
        showDelete={true}
      />
    </>
  );
}
