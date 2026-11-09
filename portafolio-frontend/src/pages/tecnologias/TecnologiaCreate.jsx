
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
    categoria: 'Frontend',
    icono_url: ''
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

  const validate = () => {
    const next = {};

    if (!values.nombre.trim()) {
      next.nombre = 'El nombre de la tecnología es obligatorio.';
    }

    if (!values.categoria) {
      next.categoria = 'Seleccioná una categoría.';
    }

    if (values.icono_url.trim()) {
      try {
        const url = new URL(values.icono_url);

        if (!['http:', 'https:'].includes(url.protocol)) {
          next.icono_url = 'La URL debe comenzar con http:// o https://.';
        }
      } catch {
        next.icono_url = 'Ingresá una URL válida.';
      }
    }

    setFieldErrors(next);

    return Object.keys(next).length === 0;
  };

  const submit = async event => {
    event.preventDefault();

    if (!validate()) return;

    setSaving(true);
    setError('');

    try {
      const payload = {
        nombre: values.nombre.trim(),
        categoria: values.categoria,
        icono_url: values.icono_url.trim() || null
      };

      const result = await tecnologiasService.create(payload);

      setToast({
        type: 'success',
        message: result?.mensaje || 'Tecnología creada correctamente.'
      });

      setTimeout(() => {
        history.push(BASE_PATH);
      }, 800);

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
        description="Incorporá una tecnología al stack de tu portfolio."
        backTo={BASE_PATH}
      />

      <section className="panel" style={{ padding: 16, marginBottom: 18 }}>
        <strong>Importante</strong>
        <p className="muted-text" style={{ marginBottom: 0 }}>
          El formulario está preparado, pero el servidor todavía
          necesita implementar POST /api/tecnologias para guardar
          nuevas tecnologías.
        </p>
      </section>

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

          <div className="form-span-2">
            <FormField
              label="URL del ícono"
              name="icono_url"
              type="url"
              value={values.icono_url}
              onChange={change}
              placeholder="https://..."
              help="Ingresá la dirección de una imagen del logo. Este campo es opcional."
              error={fieldErrors.icono_url}
            />
          </div>

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

      <Toast
        toast={toast}
        onClose={() => setToast(null)}
      />
    </>
  );
}
