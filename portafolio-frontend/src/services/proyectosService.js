
import { createEntityService } from './entityFactory';

const service = createEntityService('/api/proyectos');

function adaptarProyecto(proyecto) {
  if (!proyecto) return null;

  return {
    ...proyecto,
    id: proyecto.id_proyecto,
    titulo: proyecto.nombre,
    imagen: proyecto.imagen_url,
    fecha: proyecto.fecha_creacion,
    repositorio: proyecto.repositorio_url,
    demo: proyecto.demo_url,
    tecnologias: proyecto.tecnologias || []
  };
}

const proyectosService = {
  // Obtener todos los proyectos
  async list() {
    const respuesta = await service.list();

    const proyectos = Array.isArray(respuesta)
      ? respuesta
      : respuesta.datos || [];

    return proyectos.map(adaptarProyecto);
  },

  // Obtener un proyecto por ID
  async get(id) {
    const proyectos = await this.list();

    return proyectos.find(
      proyecto => String(proyecto.id) === String(id)
    ) || null;
  },

  // Crear proyecto con imagen y tecnologías
  async create(payload) {
    const formData = new FormData();

    formData.append('nombre', payload.nombre);
    formData.append('descripcion', payload.descripcion || '');
    formData.append('repositorio_url', payload.repositorio_url || '');
    formData.append('demo_url', payload.demo_url || '');
    formData.append('estado', payload.estado || 'Borrador');

    formData.append(
      'tecnologias_ids',
      JSON.stringify(payload.tecnologias_ids || [])
    );

    if (payload.imagen instanceof File) {
      formData.append('imagen', payload.imagen);
    }

    return service.create(formData);
  },

  // Editar proyecto
  async update(id, payload) {
    return service.update(id, payload);
  },

  // Eliminar proyecto
  async remove(id) {
    return service.remove(id);
  }
};

export default proyectosService;
