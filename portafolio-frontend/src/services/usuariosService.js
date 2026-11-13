import { createEntityService } from './entityFactory';

const api = createEntityService('/api/admin/usuarios');

function adaptarUsuario(usuario) {
  if (!usuario) return null;

  return {
    ...usuario,
    id: usuario.id ?? usuario.id_admin ?? usuario.id_usuario,
    nombre: usuario.nombre || '',
    apellido: usuario.apellido || '',
    email: usuario.email || '',
    rol: usuario.rol || 'usuario',
    estado: usuario.estado || 'Activo'
  };
}

const usuariosService = {
  async list() {
    const usuarios = await api.list();
    return usuarios.map(adaptarUsuario);
  },

  async get(id) {
    const usuario = await api.get(id);
    return adaptarUsuario(usuario);
  },

  async update(id, payload) {
    return api.update(id, {
      nombre: payload.nombre || '',
      email: payload.email || '',
      estado: payload.estado || 'Activo',
      rol: payload.rol || 'usuario'
    });
  }
};

export default usuariosService;