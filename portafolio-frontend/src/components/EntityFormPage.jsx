
import React, { useEffect, useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  CheckCircle2,
  FileText,
  Globe,
  Image as ImageIcon,
  ListChecks,
  Save,
  Tags
} from 'lucide-react';

import PageHeader from './PageHeader';
import FormField from './FormField';
import FormSection from './FormSection';
import ImageUploader from './ImageUploader';
import TechnologySelector from './TechnologySelector';
import SegmentedControl from './SegmentedControl';
import ErrorMessage from './ErrorMessage';
import LoadingState from './LoadingState';
import sectionIcon from './sectionIcons';
import Toast from './Toast';

const empty = {
  titulo: '',
  descripcion: '',
  tecnologias: [],
  imagen: '',
  repositorio: '',
  demo: '',
  url: '',
  estado: 'Borrador',
  icono: '',
  caracteristicas: ''
};

const labels = {
  titulo: 'Título',
  repositorio: 'URL del repositorio',
  demo: 'URL de demo (opcional)',
  url: 'URL de la demo',
  icono: 'Nombre del icono',
  descripcion: 'Descripción'
};

const placeholders = {
  titulo: 'Ej.: Mi aplicación web',
  icono: 'Ej.: Code2'
};

const ESTADOS = [
  { value: 'Publicado', label: 'Publicado', tone: 'success' },
  { value: 'Borrador', label: 'Borrador', tone: 'warning' }
];

const GROUPS = [
  {
    key: 'info',
    title: 'Información',
    icon: FileText,
    accent: 'indigo',
    fields: ['titulo', 'descripcion', 'icono']
  },
  {
    key: 'imagen',
    title: 'Imagen',
    icon: ImageIcon,
    accent: 'cyan',
    fields: ['imagen']
  },
  {
    key: 'tecnologias',
    title: 'Tecnologías',
    icon: Tags,
    accent: 'slate',
    fields: ['tecnologias']
  },
  {
    key: 'caracteristicas',
    title: 'Características',
    icon: ListChecks,
    accent: 'indigo',
    fields: ['caracteristicas']
  },
  {
    key: 'publicacion',
    title: 'Publicación',
    icon: Globe,
    accent: 'indigo',
    fields: ['estado', 'repositorio', 'demo', 'url']
  }
];

const KNOWN_FIELDS = GROUPS.flatMap(group => group.fields);

const WIDE_FIELDS = [
  'imagen',
  'descripcion',
  'caracteristicas',
  'tecnologias'
];

const VALIDATED_FIELDS = [
  'titulo',
  'descripcion',
  'repositorio',
  'demo',
  'url'
];

const DESCRIPTION_RECOMMENDED = 300;
const URL_PATTERN = /^https?:\/\//i;

const isBlank = value => !String(value ?? '').trim();

function validateEntity(values) {
  const next = {};

  if (isBlank(values.titulo)) {
    next.titulo = 'El título es obligatorio.';
  }

  if (isBlank(values.descripcion)) {
    next.descripcion = 'La descripción es obligatoria.';
  }

  if (
    values.repositorio &&
    !URL_PATTERN.test(values.repositorio)
  ) {
    next.repositorio =
      'Ingresá una URL válida que comience con http:// o https://.';
  }

  if (values.url && !URL_PATTERN.test(values.url)) {
    next.url = 'Ingresá una URL válida.';
  }

  if (values.demo && !URL_PATTERN.test(values.demo)) {
    next.demo = 'Ingresá una URL válida.';
  }

  return next;
}

function buildSections(fields) {
  const unknown = fields.filter(
    field => !KNOWN_FIELDS.includes(field)
  );

  return GROUPS
    .map(group => ({
      ...group,
      fields: [
        ...group.fields.filter(field => fields.includes(field)),
        ...(group.key === 'info' ? unknown : [])
      ]
    }))
    .filter(section => section.fields.length > 0);
}

function normalizarTecnologias(tecnologias) {
  if (!Array.isArray(tecnologias)) {
    return [];
  }

  return tecnologias.map(tecnologia => {
    if (typeof tecnologia === 'string') {
      return {
        nombre: tecnologia,
        categoria: ''
      };
    }

    return {
      id_tecnologia:
        tecnologia.id_tecnologia || tecnologia.id,
      nombre: tecnologia.nombre,
      categoria: tecnologia.categoria || ''
    };
  });
}

export default function EntityFormPage({
  title,
  description,
  service,
  basePath,
  kind = 'project',
  fields,
  transformIn,
  transformOut,
  renderPreview
}) {
  const { id } = useParams();
  const history = useHistory();

  const editing = Boolean(id);

  const [values, setValues] = useState(empty);
  const [touched, setTouched] = useState({});
  const [attempted, setAttempted] = useState(false);
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let active = true;

    if (editing) {
      service.get(id)
        .then(item => {
          if (!active) return;

          const transformed = transformIn
            ? transformIn(item)
            : item;

          setValues({
            ...empty,
            ...transformed,
            tecnologias: normalizarTecnologias(
              transformed.tecnologias || item.tecnologias
            ),
            caracteristicas: Array.isArray(
              transformed.caracteristicas
            )
              ? transformed.caracteristicas.join('\n')
              : (transformed.caracteristicas || '')
          });
        })
        .catch(e => {
          if (active) setError(e.message);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }

    return () => {
      active = false;
    };
  }, [editing, id, service, transformIn]);

  const errors = useMemo(
    () => validateEntity(values),
    [values]
  );

  const change = (name, value) => {
    setValues(current => ({
      ...current,
      [name]: value
    }));
  };

  const touch = name => {
    setTouched(current =>
      current[name]
        ? current
        : { ...current, [name]: true }
    );
  };

  const showError = name =>
    ((attempted || touched[name]) && errors[name]) || undefined;

  const isValid = name =>
    VALIDATED_FIELDS.includes(name) &&
    (attempted || touched[name]) &&
    !errors[name] &&
    !isBlank(values[name]);

  const submit = async event => {
    event.preventDefault();

    setAttempted(true);

    if (Object.keys(errors).length > 0) {
      setError('Revisá los campos marcados antes de guardar.');
      return;
    }

    setError('');
    setSaving(true);

    const payload = transformOut
      ? transformOut(values)
      : {
          ...values,
          tecnologias: normalizarTecnologias(values.tecnologias),
          caracteristicas: String(
            values.caracteristicas || ''
          )
            .split('\n')
            .map(item => item.trim())
            .filter(Boolean)
        };

    try {
      const result = editing
        ? await service.update(id, payload)
        : await service.create(payload);

      setSaving(false);
      setSaved(true);

      setToast({
        type: 'success',
        message:
          result?.message ||
          result?.mensaje ||
          `${kind} ${editing ? 'actualizado' : 'creado'} correctamente.`
      });

      setTimeout(() => {
        history.push(basePath);
      }, 800);

    } catch (e) {
      setError(e.message);
      setSaving(false);
    }
  };

  const renderField = name => {
    let node;

    if (name === 'imagen') {
      node = (
        <ImageUploader
          value={values.imagen}
          onChange={change}
        />
      );

    } else if (name === 'tecnologias') {
      node = (
        <TechnologySelector
          value={values.tecnologias}
          onChange={change}
        />
      );

    } else if (name === 'estado') {
      node = (
        <SegmentedControl
          name={name}
          label="Estado"
          value={values.estado}
          onChange={change}
          options={ESTADOS}
        />
      );

    } else if (name === 'descripcion') {
      node = (
        <FormField
          label={labels.descripcion}
          name={name}
          value={values.descripcion}
          onChange={change}
          error={showError(name)}
          valid={isValid(name)}
          onBlur={() => touch(name)}
          as="textarea"
          rows={5}
          required
          placeholder="Describí brevemente este contenido..."
          count={String(values.descripcion || '').length}
          recommended={DESCRIPTION_RECOMMENDED}
        />
      );

    } else if (name === 'caracteristicas') {
      node = (
        <FormField
          label="Características"
          name={name}
          value={values.caracteristicas}
          onChange={change}
          as="textarea"
          rows={4}
          help="Escribí una característica por línea."
        />
      );

    } else {
      node = (
        <FormField
          label={labels[name] || name}
          name={name}
          value={values[name]}
          onChange={change}
          error={showError(name)}
          valid={isValid(name)}
          onBlur={() => touch(name)}
          required={name === 'titulo'}
          placeholder={placeholders[name] || 'https://...'}
        />
      );
    }

    return WIDE_FIELDS.includes(name)
      ? (
          <div className="form-span-2" key={name}>
            {node}
          </div>
        )
      : (
          <React.Fragment key={name}>
            {node}
          </React.Fragment>
        );
  };

  const common = fields || [
    'titulo',
    'descripcion',
    'imagen',
    'tecnologias',
    'estado'
  ];

  const sections = buildSections(common);

  return (
    <>
      <PageHeader
        title={title}
        description={description}
        backTo={basePath}
        icon={sectionIcon(basePath)}
      />

      {loading ? (
        <LoadingState label="Cargando datos..." />
      ) : (
        <div className={`form-layout${renderPreview ? ' has-preview' : ''}`}>
          <form
            className="form-stack"
            onSubmit={submit}
            noValidate
          >
            {sections.map((section, index) => (
              <FormSection
                key={section.key}
                title={section.title}
                icon={section.icon}
                accent={section.accent}
                index={index}
              >
                <div className="form-grid">
                  {section.fields.map(renderField)}
                </div>
              </FormSection>
            ))}

            <ErrorMessage message={error} />

            <div className="form-footer">
              <button
                type="button"
                className="button button-secondary"
                onClick={() => history.push(basePath)}
                disabled={saving || saved}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className={`button ${saved ? 'button-success' : 'button-primary'}`}
                disabled={saving || saved}
              >
                {saved ? (
                  <>
                    <CheckCircle2 size={17} aria-hidden="true" />
                    Guardado
                  </>
                ) : saving ? (
                  <>
                    <span
                      className="spinner spinner-inline"
                      aria-hidden="true"
                    />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save size={17} aria-hidden="true" />
                    {editing ? 'Guardar cambios' : 'Crear registro'}
                  </>
                )}
              </button>
            </div>
          </form>

          {renderPreview && (
            <aside
              className="form-preview"
              aria-label="Vista previa en vivo"
            >
              <div className="form-preview-sticky">
                <p className="preview-label">
                  <span className="live-dot" aria-hidden="true" />
                  Vista previa en vivo
                </p>

                {renderPreview(values)}
              </div>
            </aside>
          )}
        </div>
      )}

      <Toast
        toast={toast}
        onClose={() => setToast(null)}
      />
    </>
  );
}
