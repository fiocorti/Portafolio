
import { createEntityService } from './entityFactory';

const api = createEntityService('/api/experiencias');

function obtenerMensaje(error) {
  return error?.details?.mensaje ||
    error?.message ||
    'No se pudo completar la operación.';
}

const experienciasService = {
  async list() {
    const experiencias = await api.list();

    return (Array.isArray(experiencias) ? experiencias : []).map(experiencia => ({
      ...experiencia,
      id: experiencia.id_experiencia
    }));
  },

  async create(payload) {
    try {
      return await api.create(payload);
    } catch (error) {
      throw new Error(obtenerMensaje(error));
    }
  }
};

export default experienciasService;
