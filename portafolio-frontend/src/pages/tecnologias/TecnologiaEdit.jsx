import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Code2, Save } from 'lucide-react';

import PageHeader from '../../components/PageHeader';
import FormField from '../../components/FormField';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingState from '../../components/LoadingState';
import Toast from '../../components/Toast';

import tecnologiasService from '../../services/tecnologiasService';

const BASE_PATH = '/admin/tecnologias';

const CATEGORIAS = [
  { value: 'Frontend', label: 'Frontend' },
  { value: 'Backend', label: 'Backend' },
  { value: 'Herramientas', label: 'Herramientas' },
  { value: 'Base de Datos', label: 'Base de Datos' }
];

export default function TecnologiaEdit() {
  const { id } = useParams();
  const history = useHistory();

  const [values, setValues] = useState({
    nombre: '',
    categoria: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let active = true;

    tecnologiasService.list()
      .then(items => {
        const tecnologia = items.find(
          item => String(item.id) === String(id)
        );

        if (!tecnologia) {
          throw new Error('No se encontró la tecnología.');
        }

        if (active) {
          setValues({
            nombre: tecnologia.nombre || '',
            categoria: tecnologia.categoria || 'Frontend'
          });
        }
      })
      .catch(e => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  const change = (name, value) => {
    setValues(current => ({
      ...current,
      [name]: value
    }));
  };

  const submit = async event => {
    event.preventDefault();

    if (!values.nombre.trim() || !values.categoria) {
      setError('Completá el nombre y la categoría.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      await tecnologiasService.update(id, {
        nombre: values.nombre.trim(),
        categoria: values.categoria
      });

      setToast({
        type: 'success',
        message: 'Tecnología actualizada correctamente.'
      });

      setTimeout(() => history.push(BASE_PATH), 800);
    } catch (e) {
      setError(e.message);
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingState label="Cargando tecnología..." />;
  }

  return (
    <>
      <PageHeader
        icon={Code2}
        title="Editar tecnología"
        description="Modificá los datos de la tecnología seleccionada."
        backTo={BASE_PATH}
      />

      <form className="form-panel" onSubmit={submit}>
        <div className="form-grid">
          <FormField
            label="Nombre de la tecnología"
            name="nombre"
            value={values.nombre}
            onChange={change}
            required
          />

          <FormField
            label="Categoría"
            name="categoria"
            value={values.categoria}
            onChange={change}
            as="select"
            options={CATEGORIAS}
            required
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
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </>
  );
}