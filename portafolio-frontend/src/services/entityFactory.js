import { request } from './api';

export function createEntityService(endpoint) {
  return {
    async list() {
  const data = await request(endpoint);
  return data.datos || data.items || data.data || data;
},
    async get(id) { const data = await request(`${endpoint}/${encodeURIComponent(id)}`); return data.item || data.data || data; },
    async create(payload) { return request(endpoint, { method: 'POST', body: payload }); },
    async update(id, payload) { return request(`${endpoint}/${encodeURIComponent(id)}`, { method: 'PUT', body: payload }); },
    async remove(id) { return request(`${endpoint}/${encodeURIComponent(id)}`, { method: 'DELETE' }); }
  };
}
