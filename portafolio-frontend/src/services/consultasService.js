import { request } from './api';

export default {
  // Los endpoints de lectura se mantienen hasta que el backend publique las rutas GET.
  async list() {
    const data = await request('/api/contactos');
    return data.items || data.data || data;
  },

  async get(id) {
    const data = await request(`/api/contactos/${encodeURIComponent(id)}`);
    return data.item || data.data || data;
  },

  // Coincide con POST /api/contacto/responder del backend.
  async reply(id, respuesta) {
    return request('/api/contacto/responder', {
      method: 'POST',
      body: {
        id_consulta: id,
        contenido_respuesta: respuesta
      }
    });
  }
};
