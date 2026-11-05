import React from 'react';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import EntityListPage from '../../components/EntityListPage';
import usuariosService from '../../services/usuariosService';
import StatusBadge from '../../components/StatusBadge';
const columns = [
  { key: 'nombre', label: 'Usuario', render: row => <div className="table-primary-cell"><span className="user-table-avatar">{(row.nombre || 'U').charAt(0)}</span><div><strong>{row.nombre}</strong><small>{row.email}</small></div></div> },
  { key: 'rol', label: 'Rol', render: row => <span className="role-pill">{row.rol}</span> },
  { key: 'estado', label: 'Estado', render: row => <StatusBadge status={row.estado} /> },
  { key: 'fechaRegistro', label: 'Registro' },
  { key: 'detail', label: 'Detalle', render: row => <Link className="table-icon-button" title="Ver usuario" to={`/admin/usuarios/${row.id}`}><Eye size={16} /></Link> }
];
export default function UsuariosList() { return <EntityListPage title="Usuarios" description="Consultá las cuentas registradas y sus roles dentro del sistema." service={usuariosService} basePath="/admin/usuarios" entityLabel="Usuario" columns={columns} getSearchText={row => `${row.nombre} ${row.email} ${row.rol}`} filters={['Activo', 'Inactivo', 'administrador', 'operador', 'usuario']} showCreate={false} showView={false} showEdit={false} showDelete={false} />; }
