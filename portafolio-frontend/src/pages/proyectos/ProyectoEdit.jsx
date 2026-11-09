
import React from 'react';
import { useHistory } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import ErrorMessage from '../../components/ErrorMessage';

export default function ProyectoEdit() {
  const history = useHistory();

  return (
    <>
      <PageHeader
        title="Edición de proyectos"
        description="La edición estará disponible cuando el backend incorpore su endpoint."
        backTo="/admin/proyectos"
      />

      <div className="form-stack">
        <ErrorMessage message="El backend todavía no dispone de PUT /api/proyectos/:id. Los proyectos existentes pueden consultarse, pero no modificarse desde este formulario." />

        <button
          type="button"
          className="button button-secondary"
          onClick={() => history.push('/admin/proyectos')}
        >
          Volver a proyectos
        </button>
      </div>
    </>
  );
}
