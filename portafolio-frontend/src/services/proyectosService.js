
import { createEntityService } from './entityFactory';

const proyectosService = createEntityService('/api/proyectos');

function adaptarProyecto(proyecto) {
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

export default {
  ...proyectosService,

  async list() {
    const proyectos = await proyectosService.list();
    return proyectos.map(adaptarProyecto);
  },

  async get(id) {
    const proyectos = await this.list();
    return proyectos.find(proyecto => String(proyecto.id) === String(id));
  }
};
