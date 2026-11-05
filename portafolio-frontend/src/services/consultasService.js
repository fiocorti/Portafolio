import { request } from './api';
export default {
  async list() { const data = await request('/api/contactos'); return data.items || data.data || data; },
  async get(id) { const data = await request(`/api/contactos/${encodeURIComponent(id)}`); return data.item || data.data || data; },
  async reply(id, respuesta) { return request(`/api/contactos/${encodeURIComponent(id)}/responder`, { method: 'POST', body: { respuesta } }); }
};
