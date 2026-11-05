import { request } from './api';
export default { async get(params = {}) { const query = new URLSearchParams(params).toString(); return request(`/api/admin/estadisticas${query ? `?${query}` : ''}`); } };
