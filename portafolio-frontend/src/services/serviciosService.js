
import { createEntityService } from './entityFactory';

const api = createEntityService('/api/servicios');

// Convierte los datos del backend al formato utilizado por el frontend.
function adaptarServicio(servicio) {
  if (!servicio) return null;

  const caracteristicas = servicio.caracteristicas;

  return {
    ...servicio,
    id: servicio.id_servicio ?? servicio.id,
    titulo: servicio.nombre || servicio.titulo || '',
    icono: servicio.icono_url || servicio.icono || '',
    caracteristicas: Array.isArray(caracteristicas)
      ? caracteristicas
      : typeof caracteristicas === 'string'
        ? caracteristicas
            .split(/\r?\n/)
            .map(item => item.trim())
            .filter(Boolean)
        : []
  };
}

// Convierte los datos del formulario a los campos que espera Express.
function prepararServicio(datos = {}) {
  const caracteristicas = datos.caracteristicas;

  return {
    nombre: String(datos.nombre || datos.titulo || '').trim(),
    descripcion: String(datos.descripcion || '').trim(),
    caracteristicas: Array.isArray(caracteristicas)
      ? caracteristicas
          .map(item => String(item).trim())
          .filter(Boolean)
          .join('\n')
      : String(caracteristicas || '').trim(),
    icono_url: datos.icono_url || datos.icono || null,
    estado: datos.estado || 'Borrador'
  };
}

const serviciosService = {
  // GET /api/servicios
  async list() {
    const servicios = await api.list();

    return servicios.map(adaptarServicio);
  },

  // GET individual: se obtiene desde el listado porque
  // el frontend no necesita una ruta adicional para buscarlo.
  async get(id) {
    const servicios = await this.list();

    return servicios.find(
      servicio => String(servicio.id) === String(id)
    ) || null;
  },

  // POST /api/servicios
  async create(datos) {
    return api.create(prepararServicio(datos));
  },

  // PUT /api/servicios/:id
  async update(id, datos) {
    return api.update(id, prepararServicio(datos));
  },

  // DELETE /api/servicios/:id
  async remove(id) {
    return api.remove(id);
  }
};

export default serviciosService;
