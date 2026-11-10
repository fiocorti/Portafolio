
import { createEntityService } from './entityFactory';

const api = createEntityService('/api/tecnologias');
const apiEnUso = createEntityService('/api/tecnologias/en-uso');

function obtenerMensaje(error) {
  return (
    error?.details?.mensaje ||
    error?.message ||
    'No se pudo completar la operación.'
  );
}

function adaptarTecnologias(tecnologias) {
  return (Array.isArray(tecnologias) ? tecnologias : []).map(tecnologia => ({
    ...tecnologia,
    id: tecnologia.id_tecnologia
  }));
}

const tecnologiasService = {
  // GET /api/tecnologias
  async list() {
    const tecnologias = await api.list();
    return adaptarTecnologias(tecnologias);
  },

  // GET /api/tecnologias/en-uso
  async listEnUso() {
    const tecnologias = await apiEnUso.list();
    return adaptarTecnologias(tecnologias);
  },

  // POST /api/tecnologias
  async create(payload) {
    try {
      return await api.create(payload);
    } catch (error) {
      throw new Error(obtenerMensaje(error));
    }
  },

  // PUT /api/tecnologias/:id
  async update(id, payload) {
    try {
      return await api.update(id, payload);
    } catch (error) {
      throw new Error(obtenerMensaje(error));
    }
  },

  // DELETE /api/tecnologias/:id
  async remove(id) {
    try {
      return await api.remove(id);
    } catch (error) {
      throw new Error(obtenerMensaje(error));
    }
  }
};

export default tecnologiasService;
