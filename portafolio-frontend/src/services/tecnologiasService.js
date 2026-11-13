import { request } from './api';

function adaptarTecnologia(tecnologia) {
  return {
    ...tecnologia,
    id: tecnologia.id_tecnologia ?? tecnologia.id,
    nombre: tecnologia.nombre || '',
    categoria: tecnologia.categoria || '',
    icono: tecnologia.icono_url || tecnologia.icono || ''
  };
}

function extraerTecnologias(respuesta) {
  if (Array.isArray(respuesta)) return respuesta;
  if (Array.isArray(respuesta?.datos)) return respuesta.datos;
  return [];
}

const tecnologiasService = {
  async list() {
    const respuesta = await request('/api/tecnologias');

    return extraerTecnologias(respuesta).map(adaptarTecnologia);
  },

  async listEnUso() {
    const respuesta = await request('/api/tecnologias/en-uso');

    return extraerTecnologias(respuesta).map(adaptarTecnologia);
  },

  async create(payload) {
    return request('/api/tecnologias', {
      method: 'POST',
      body: {
        nombre: payload.nombre || '',
        categoria: payload.categoria || '',
        icono_url: payload.icono_url || payload.icono || null
      }
    });
  },

  async remove(id) {
    return request(
      `/api/tecnologias/${encodeURIComponent(id)}`,
      { method: 'DELETE' }
    );
  }
};

export default tecnologiasService;