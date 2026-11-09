import { createEntityService } from './entityFactory';

const api = createEntityService('/api/tecnologias');

function obtenerMensaje(error) {
  return error?.details?.mensaje ||
    error?.message ||
    'No se pudo completar la operación.';
}

const tecnologiasService = {
  async list() {
    const tecnologias = await api.list();

    return (Array.isArray(tecnologias) ? tecnologias : []).map(tecnologia => ({
      ...tecnologia,
      id: tecnologia.id_tecnologia
    }));
  },

  async create(payload) {
    try {
      return await api.create(payload);
    } catch (error) {
      throw new Error(obtenerMensaje(error));
    }
  },

  async update(id, payload) {
    try {
      return await api.update(id, payload);
    } catch (error) {
      throw new Error(obtenerMensaje(error));
    }
  },

  async remove(id) {
    try {
      return await api.remove(id);
    } catch (error) {
      throw new Error(obtenerMensaje(error));
    }
  }
};

export default tecnologiasService;