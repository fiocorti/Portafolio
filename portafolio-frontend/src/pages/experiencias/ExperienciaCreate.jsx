
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Briefcase, Save } from 'lucide-react';

import PageHeader from '../../components/PageHeader';
import FormField from '../../components/FormField';
import ErrorMessage from '../../components/ErrorMessage';
import Toast from '../../components/Toast';

import experienciasService from '../../services/experienciasService';

const BASE_PATH = '/admin/experiencias';

const CATEGORIAS = [
  { value: 'Proyectos Académicos', label: 'Proyectos académicos' },
  { value: 'Laboral', label: 'Laboral' },
  { value: 'Aprendizaje', label: 'Aprendizaje' },
  { value: 'Otro', label: 'Otro' }
];

const ESTADOS = [
  { value: 'Publicado', label: 'Publicado' },
  { value: 'Borrador', label: 'Borrador' }
];

export default function ExperienciaCreate() {
  const history = useHistory();

  const [values, setValues] = useState({
    titulo: '',
    categoria: 'Proyectos Académicos',
    descripcion: '',
    fecha_inicio: '',
    fecha_fin: '',
    estado: 'Borrador'
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

    if (!values.titulo.trim()) {
      next.titulo = 'El título es obligatorio.';
    }

    if (!values.categoria) {
      next.categoria = 'Seleccioná una categoría.';
    }

    if (!values.fecha_inicio) {
      next.fecha_inicio = 'La fecha de inicio es obligatoria.';
    }

    if (
      values.fecha_fin &&
      values.fecha_inicio &&
      values.fecha_fin < values.fecha_inicio
    ) {
      next.fecha_fin = 'La fecha de finalización no puede ser anterior al inicio.';
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
        titulo: values.titulo.trim(),
        categoria: values.categoria,
        descripcion: values.descripcion.trim() || null,
        fecha_inicio: values.fecha_inicio,
        fecha_fin: values.fecha_fin || null,
        estado: values.estado
      };

      const result = await experienciasService.create(payload);

      setToast({
        type: 'success',
        message: result?.mensaje || 'Experiencia creada correctamente.'
      });

      setTimeout(() => {
        history.push(BASE_PATH);
      }, 900);

    } catch (e) {
      setError(e.message);
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        icon={Briefcase}
        title="Nueva experiencia"
        description="Agregá una experiencia laboral, académica o de aprendizaje a tu portfolio."
        backTo={BASE_PATH}
      />

      <form className="form-panel" onSubmit={submit} noValidate>

        <div className="form-grid">

          <FormField
            label="Título"
            name="titulo"
            value={values.titulo}
            onChange={change}
            required
            placeholder="Ej.: Desarrolladora Full Stack — Proyecto académico"
            error={fieldErrors.titulo}
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
              label="Descripción"
              name="descripcion"
              value={values.descripcion}
              onChange={change}
              as="textarea"
              rows={5}
              placeholder="Contá qué hiciste, qué responsabilidades tuviste y qué tecnologías o conocimientos aplicaste."
              help="Describí tu rol, las tareas realizadas y los aprendizajes obtenidos."
            />
          </div>

          <FormField
            label="Fecha de inicio"
            name="fecha_inicio"
            type="date"
            value={values.fecha_inicio}
            onChange={change}
            required
            error={fieldErrors.fecha_inicio}
          />

          <FormField
            label="Fecha de finalización"
            name="fecha_fin"
            type="date"
            value={values.fecha_fin}
            onChange={change}
            min={values.fecha_inicio || undefined}
            help="Dejala vacía si esta experiencia continúa actualmente."
            error={fieldErrors.fecha_fin}
          />

          <FormField
            label="Estado"
            name="estado"
            value={values.estado}
            onChange={change}
            as="select"
            options={ESTADOS}
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
            {saving ? 'Guardando...' : 'Guardar experiencia'}
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
