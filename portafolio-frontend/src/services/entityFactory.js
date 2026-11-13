import { request } from './api';

function extraerLista(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.datos)) return data.datos;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

export function createEntityService(endpoint) {
  return {
    async list() {
      const data = await request(endpoint);
      return extraerLista(data);
    },

    async get(id) {
      const data = await request(
        `${endpoint}/${encodeURIComponent(id)}`
      );

      return data?.item || data?.datos || data?.data || data;
    },

    async create(payload) {
      return request(endpoint, {
        method: 'POST',
        body: payload
      });
    },

    async update(id, payload) {
      return request(
        `${endpoint}/${encodeURIComponent(id)}`,
        {
          method: 'PUT',
          body: payload
        }
      );
    },

    async remove(id) {
      return request(
        `${endpoint}/${encodeURIComponent(id)}`,
        { method: 'DELETE' }
      );
    }
  };
}