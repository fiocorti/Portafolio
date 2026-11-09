import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Code2, Save } from 'lucide-react';

import PageHeader from '../../components/PageHeader';
import FormField from '../../components/FormField';
import ErrorMessage from '../../components/ErrorMessage';
import Toast from '../../components/Toast';

import tecnologiasService from '../../services/tecnologiasService';

const BASE_PATH = '/admin/tecnologias';

const CATEGORIAS = [
  { value: 'Frontend', label: 'Frontend' },
  { value: 'Backend', label: 'Backend' },
  { value: 'Herramientas', label: 'Herramientas' },
  { value: 'Base de Datos', label: 'Base de Datos' }
];

export default function TecnologiaCreate() {
  const history = useHistory();

  const [values, setValues] = useState({
    nombre: '',
    categoria: 'Frontend'
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [toast, setToast] = useState(null);

  const change = (name, value) => {
    setValues(current => ({
      ...current,
      [name]: value
    }));

    setFieldErrors(current => ({
      ...current,
      [name]: ''
    }));

    setError('');
  };

  const submit = async event => {
    event.preventDefault();

    const errors = {};

    if (!values.nombre.trim()) {
      errors.nombre = 'Ingresá el nombre de la tecnología.';
    }

    if (!values.categoria) {
      errors.categoria = 'Seleccioná una categoría.';
    }

    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }

    setSaving(true);
    setError('');

    try {
      await tecnologiasService.create({
        nombre: values.nombre.trim(),
        categoria: values.categoria
      });

      setToast({
        type: 'success',
        message: 'Tecnología creada correctamente.'
      });

      setTimeout(() => history.push(BASE_PATH), 800);
    } catch (e) {
      setError(e.message);
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        icon={Code2}
        title="Nueva tecnología"
        description="Incorporá una tecnología al catálogo."
        backTo={BASE_PATH}
      />

      <form className="form-panel" onSubmit={submit} noValidate>
        <div className="form-grid">
          <FormField
            label="Nombre de la tecnología"
            name="nombre"
            value={values.nombre}
            onChange={change}
            required
            placeholder="Ej.: React, Node.js, MySQL"
            error={fieldErrors.nombre}
          />

          <FormField
            label="Categoría"
            name="categoria"
            value={values.categoria}
            onChange={change}
            as="select"
            options={CATEGORIAS}
            required
            error={fieldErrors.categoria}
          />
        </div>

        <ErrorMessage message={error} />

        <div className="form-footer">
          <button
            type="button"
            className="button button-secondary"
            onClick={() => history.push(BASE_PATH)}
            disabled={saving}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="button button-primary"
            disabled={saving}
          >
            <Save size={17} />
            {saving ? 'Guardando...' : 'Guardar tecnología'}
          </button>
        </div>
      </form>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </>
  );
}