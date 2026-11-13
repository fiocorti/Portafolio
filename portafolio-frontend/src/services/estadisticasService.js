import { request } from './api';

const estadisticasService = {
  async get() {
    return request('/api/admin/estadisticas');
  }
};

export default estadisticasService;