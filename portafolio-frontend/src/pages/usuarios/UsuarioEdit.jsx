import React, { useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Save } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import FormField from '../../components/FormField';
import ErrorMessage from '../../components/ErrorMessage';
import Toast from '../../components/Toast';
import LoadingState from '../../components/LoadingState';
import usuariosService from '../../services/usuariosService';
import useAuth from '../../hooks/useAuth';

export default function UsuarioEdit() {
  const { id } = useParams(); const history = useHistory(); const { user: currentUser } = useAuth();
  const [values, setValues] = useState({ nombre: '', email: '', rol: 'usuario', estado: 'Activo' });
  const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false); const [error, setError] = useState(''); const [toast, setToast] = useState(null);
  const isSelf = String(currentUser?.id) === String(id);
  useEffect(() => { let alive = true; usuariosService.get(id).then(item => { if (alive) setValues({ nombre: item.nombre || '', email: item.email || '', rol: item.rol || 'usuario', estado: item.estado || 'Activo' }); }).catch(e => alive && setError(e.message)).finally(() => alive && setLoading(false)); return () => { alive = false; }; }, [id]);
  const change = (name, value) => setValues(current => ({ ...current, [name]: value }));
  const submit = async event => { event.preventDefault(); setError(''); if (!values.nombre.trim() || !values.email.trim()) { setError('Nombre y correo son obligatorios.'); return; } if (!/^\S+@\S+\.\S+$/.test(values.email)) { setError('Ingresá un correo electrónico válido.'); return; } setSaving(true); const payload = { nombre: values.nombre.trim(), email: values.email.trim(), estado: values.estado }; if (!isSelf) payload.rol = values.rol; try { const result = await usuariosService.update(id, payload); setToast({ type: 'success', message: result?.message || 'Usuario actualizado correctamente.' }); setTimeout(() => history.push(`/admin/usuarios/${id}`), 500); } catch (e) { setError(e.message); setSaving(false); } };
  return <><PageHeader title="Editar usuario" description="Modificá solamente los datos habilitados por el backend." backTo={`/admin/usuarios/${id}`} />{loading ? <LoadingState /> : <form className="form-panel" onSubmit={submit}><div className="form-grid"><FormField label="Nombre" name="nombre" value={values.nombre} onChange={change} required /><FormField label="Correo electrónico" name="email" type="email" value={values.email} onChange={change} required /><FormField label="Estado" name="estado" value={values.estado} onChange={change} as="select" options={[{ value: 'Activo', label: 'Activo' }, { value: 'Inactivo', label: 'Inactivo' }]} />{!isSelf && <FormField label="Rol" name="rol" value={values.rol} onChange={change} as="select" options={[{ value: 'usuario', label: 'Usuario registrado' }, { value: 'operador', label: 'Operador' }]} help="No se permite asignar el rol administrador desde esta pantalla." />}</div>{isSelf && <p className="notice-inline">No podés modificar tu propio rol desde esta pantalla.</p>}<ErrorMessage message={error} /><div className="form-footer"><Link className="button button-secondary" to={`/admin/usuarios/${id}`}>Cancelar</Link><button className="button button-primary" disabled={saving}><Save size={16} />{saving ? 'Guardando...' : 'Guardar cambios'}</button></div></form>}<Toast toast={toast} onClose={() => setToast(null)} /></>;
}
