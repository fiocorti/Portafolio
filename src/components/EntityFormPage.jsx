import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Save } from 'lucide-react';
import PageHeader from './PageHeader';
import FormField from './FormField';
import ImageUploader from './ImageUploader';
import ErrorMessage from './ErrorMessage';
import Toast from './Toast';

const empty = { titulo: '', descripcion: '', tecnologias: '', imagen: '', repositorio: '', demo: '', url: '', estado: 'Borrador', icono: '', caracteristicas: '' };
export default function EntityFormPage({ title, description, service, basePath, kind = 'project', fields, transformIn, transformOut }) {
  const { id } = useParams(); const history = useHistory(); const editing = Boolean(id);
  const [values, setValues] = useState(empty); const [errors, setErrors] = useState({}); const [loading, setLoading] = useState(editing); const [saving, setSaving] = useState(false); const [error, setError] = useState(''); const [toast, setToast] = useState(null);
  useEffect(() => { let active = true; if (editing) { service.get(id).then(item => { if (active) setValues({ ...empty, ...(transformIn ? transformIn(item) : item), tecnologias: Array.isArray(item.tecnologias) ? item.tecnologias.join(', ') : (item.tecnologias || ''), caracteristicas: Array.isArray(item.caracteristicas) ? item.caracteristicas.join('\n') : (item.caracteristicas || '') }); }).catch(e => active && setError(e.message)).finally(() => active && setLoading(false)); } return () => { active = false; }; }, [editing, id, service, transformIn]);
  const change = (name, value) => setValues(current => ({ ...current, [name]: value }));
  const validate = () => { const next = {}; if (!values.titulo.trim()) next.titulo = 'El título es obligatorio.'; if (!values.descripcion.trim()) next.descripcion = 'La descripción es obligatoria.'; if (values.repositorio && !/^https?:\/\//i.test(values.repositorio)) next.repositorio = 'Ingresá una URL válida que comience con http:// o https://.'; if (values.url && !/^https?:\/\//i.test(values.url)) next.url = 'Ingresá una URL válida.'; if (values.demo && !/^https?:\/\//i.test(values.demo)) next.demo = 'Ingresá una URL válida.'; setErrors(next); return Object.keys(next).length === 0; };
  const submit = async event => { event.preventDefault(); if (!validate()) return; setSaving(true); setError(''); const payload = transformOut ? transformOut(values) : { ...values, tecnologias: values.tecnologias.split(',').map(x => x.trim()).filter(Boolean), caracteristicas: values.caracteristicas.split('\n').map(x => x.trim()).filter(Boolean) }; try { const result = editing ? await service.update(id, payload) : await service.create(payload); setToast({ type: 'success', message: result?.message || `${kind} ${editing ? 'actualizado' : 'creado'} correctamente.` }); setTimeout(() => history.push(basePath), 500); } catch (e) { setError(e.message); setSaving(false); } };
  const common = fields || ['titulo', 'descripcion', 'imagen', 'tecnologias', 'estado'];
  if (loading) return <div className="panel"><p>Cargando datos...</p></div>;
  return <><PageHeader eyebrow="GESTIÓN DE CONTENIDO" title={title} description={description} backTo={basePath} /><form className="form-panel" onSubmit={submit} noValidate><div className="form-grid">{common.map(field => {
    if (field === 'imagen') return <div className="form-span-2" key={field}><ImageUploader value={values.imagen} onChange={change} /></div>;
    if (field === 'descripcion') return <div className="form-span-2" key={field}><FormField label="Descripción" name="descripcion" value={values.descripcion} onChange={change} error={errors.descripcion} as="textarea" rows={5} required placeholder="Describí brevemente este contenido..." /></div>;
    if (field === 'tecnologias') return <FormField key={field} label="Tecnologías" name="tecnologias" value={values.tecnologias} onChange={change} help="Separá cada tecnología con una coma. Ej.: React, Node.js, MySQL" placeholder="React, JavaScript, CSS" />;
    if (field === 'caracteristicas') return <div className="form-span-2" key={field}><FormField label="Características" name="caracteristicas" value={values.caracteristicas} onChange={change} as="textarea" rows={4} help="Escribí una característica por línea." /></div>;
    if (field === 'estado') return <FormField key={field} label="Estado" name="estado" value={values.estado} onChange={change} as="select" options={[{ value: 'Publicado', label: 'Publicado' }, { value: 'Borrador', label: 'Borrador' }]} />;
    const labels = { titulo: 'Título', repositorio: 'URL del repositorio', demo: 'URL de demo (opcional)', url: 'URL de la demo', icono: 'Nombre del icono' };
    return <FormField key={field} label={labels[field] || field} name={field} value={values[field]} onChange={change} error={errors[field]} required={field === 'titulo'} placeholder={field === 'titulo' ? 'Ej.: Mi aplicación web' : 'https://...'} />;
  })}</div><ErrorMessage message={error} /><div className="form-footer"><button type="button" className="button button-secondary" onClick={() => history.push(basePath)}>Cancelar</button><button type="submit" className="button button-primary" disabled={saving}><Save size={17} />{saving ? 'Guardando...' : editing ? 'Guardar cambios' : 'Crear registro'}</button></div></form><Toast toast={toast} onClose={() => setToast(null)} /></>;
}
