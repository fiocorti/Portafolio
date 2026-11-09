
import { createEntityService } from './entityFactory';

const serviciosService = createEntityService('/api/servicios');

function adaptarServicio(servicio) {
  const caracteristicas = servicio.caracteristicas;

  return {
    ...servicio,
    id: servicio.id_servicio,
    titulo: servicio.nombre,
    icono: servicio.icono_url,
    caracteristicas: Array.isArray(caracteristicas)
      ? caracteristicas
      : typeof caracteristicas === 'string'
        ? caracteristicas.split(/\r?\n/).map(item => item.trim()).filter(Boolean)
        : []
  };
}

export default {
  ...serviciosService,

  async list() {
    const servicios = await serviciosService.list();
    return servicios.map(adaptarServicio);
  },

  async get(id) {
    const servicios = await this.list();

    return servicios.find(
      servicio => String(servicio.id) === String(id)
    );
  }
};
