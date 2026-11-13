import proyectosService from './proyectosService';

const demosService = {
  async list() {
    const proyectos = await proyectosService.list();

    return proyectos
      .filter(proyecto => (
        typeof proyecto.demo === 'string' &&
        proyecto.demo.trim() !== ''
      ))
      .map(proyecto => ({
        ...proyecto,
        id: proyecto.id,
        nombre: proyecto.nombre,
        titulo: proyecto.titulo,
        url: proyecto.demo,
        demo_url: proyecto.demo
      }));
  },

  async get(id) {
    const demos = await this.list();

    return demos.find(
      demo => String(demo.id) === String(id)
    ) || null;
  },

  async create() {
    throw new Error(
      'Las demos se crean desde el formulario de proyectos, completando el campo de URL de demo.'
    );
  },

  async update() {
    throw new Error(
      'Las demos se editan desde el proyecto al que pertenecen.'
    );
  },

  async remove() {
    throw new Error(
      'Para quitar una demo, editá el proyecto y vaciá su URL de demo.'
    );
  }
};

export default demosService;