import { request } from './api';

function adaptarExperiencia(experiencia) {
  return {
    ...experiencia,
    id: experiencia.id_experiencia ?? experiencia.id,
    titulo: experiencia.titulo || '',
    categoria: experiencia.categoria || '',
    descripcion: experiencia.descripcion || '',
    fecha_inicio: experiencia.fecha_inicio || null,
    fecha_fin: experiencia.fecha_fin || null,
    estado: experiencia.estado || 'Publicado'
  };
}

const experienciasService = {
  async list() {
    const respuesta = await request('/api/experiencias');

    const experiencias = Array.isArray(respuesta)
      ? respuesta
      : respuesta?.datos || [];

    return experiencias.map(adaptarExperiencia);
  },

  async create(payload) {
    return request('/api/experiencias', {
      method: 'POST',
      body: {
        titulo: payload.titulo || '',
        categoria: payload.categoria || '',
        descripcion: payload.descripcion || '',
        fecha_inicio: payload.fecha_inicio || null,
        fecha_fin: payload.fecha_fin || null,
        estado: payload.estado || 'Publicado'
      }
    });
  },

  async update() {
    throw new Error(
      'El backend actual no dispone de una ruta para editar experiencias.'
    );
  },

  async remove() {
    throw new Error(
      'El backend actual no dispone de una ruta para eliminar experiencias.'
    );
  }
};

export default experienciasService;