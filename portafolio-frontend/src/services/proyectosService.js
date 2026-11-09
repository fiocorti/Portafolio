
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
  async list() {
    const respuesta = await service.list();
    const proyectos = Array.isArray(respuesta)
      ? respuesta
      : respuesta.datos || [];

    return proyectos.map(adaptarProyecto);
  },

  async get(id) {
    const proyectos = await this.list();

    return proyectos.find(
      proyecto => String(proyecto.id) === String(id)
    ) || null;
  },

  async create(payload) {
    return service.create(payload);
  },

  async update() {
    throw new Error(
      'La edición de proyectos todavía no está disponible en el backend.'
    );
  },

  async remove() {
    throw new Error(
      'La eliminación de proyectos todavía no está disponible en el backend.'
    );
  }
};

export default proyectosService;
