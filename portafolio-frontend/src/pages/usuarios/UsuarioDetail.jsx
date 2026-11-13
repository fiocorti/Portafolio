import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Pencil, Users } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import StatusBadge from '../../components/StatusBadge';
import LoadingState from '../../components/LoadingState';
import ErrorMessage from '../../components/ErrorMessage';
import usuariosService from '../../services/usuariosService';

export default function UsuarioDetail() {
  const { id } = useParams(); const [user, setUser] = useState(null); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  useEffect(() => { usuariosService.get(id).then(setUser).catch(e => setError(e.message)).finally(() => setLoading(false)); }, [id]);
  return <><PageHeader icon={Users} title="Detalle del usuario" description="Información de la cuenta registrada." backTo="/admin/usuarios" action={<Link className="button button-primary" to={`/admin/usuarios/${id}/editar`}><Pencil size={16} /> Editar datos</Link>} />{loading ? <LoadingState /> : error ? <ErrorMessage message={error} /> : user && <section className="panel user-detail"><div className="user-large-avatar">{(user.nombre || 'U').charAt(0)}</div><h3>{user.nombre}</h3><p>{user.email}</p><div className="detail-grid"><div className="detail-item"><span>Rol</span><strong>{user.rol}</strong></div><div className="detail-item"><span>Estado</span><strong><StatusBadge status={user.estado} /></strong></div><div className="detail-item"><span>Fecha de registro</span><strong>{user.fechaRegistro || '—'}</strong></div><div className="detail-item"><span>ID</span><strong>{user.id}</strong></div></div><p className="notice-inline">La modificación de roles y permisos depende de las operaciones autorizadas por el backend. No se permite asignar el rol administrador desde esta pantalla ni modificar el propio rol.</p></section>}</>;
}
