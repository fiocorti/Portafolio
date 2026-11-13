import { createEntityService } from './entityFactory';

const service = createEntityService('/api/proyectos');

function adaptarProyecto(proyecto) {
  if (!proyecto) return null;

  const tecnologias = Array.isArray(proyecto.tecnologias)
    ? proyecto.tecnologias
    : [];

  return {
    ...proyecto,
    id: proyecto.id_proyecto ?? proyecto.id,
    nombre: proyecto.nombre || proyecto.titulo || '',
    titulo: proyecto.nombre || proyecto.titulo || '',
    imagen: proyecto.imagen_url || proyecto.imagen || '',
    fecha: proyecto.fecha_creacion || proyecto.fecha || null,
    repositorio: proyecto.repositorio_url || proyecto.repositorio || '',
    demo: proyecto.demo_url || proyecto.demo || '',
    tecnologias
  };
}

function esArchivo(value) {
  return typeof File !== 'undefined' && value instanceof File;
}

function obtenerIdsTecnologias(payload) {
  if (Array.isArray(payload.tecnologias_ids)) {
    return payload.tecnologias_ids;
  }

  if (Array.isArray(payload.tecnologias)) {
    return payload.tecnologias
      .map(tecnologia => (
        typeof tecnologia === 'object'
          ? tecnologia.id_tecnologia ?? tecnologia.id
          : tecnologia
      ))
      .filter(id => id !== undefined && id !== null && id !== '');
  }

  return [];
}

function obtenerTecnologiasParaEdicion(payload) {
  if (!Array.isArray(payload.tecnologias)) return [];

  return payload.tecnologias
    .map(tecnologia => {
      if (typeof tecnologia === 'string') {
        return { nombre: tecnologia, categoria: 'General' };
      }

      return {
        nombre: tecnologia.nombre || tecnologia.label || '',
        categoria: tecnologia.categoria || 'General'
      };
    })
    .filter(tecnologia => tecnologia.nombre);
}

const proyectosService = {
  async list() {
    const respuesta = await service.list();
    return respuesta.map(adaptarProyecto);
  },

  async get(id) {
    const proyectos = await this.list();

    return proyectos.find(
      proyecto => String(proyecto.id) === String(id)
    ) || null;
  },

  async create(payload) {
    const formData = new FormData();

    formData.append('nombre', payload.nombre || payload.titulo || '');
    formData.append('descripcion', payload.descripcion || '');
    formData.append(
      'repositorio_url',
      payload.repositorio_url || payload.repositorio || ''
    );
    formData.append(
      'demo_url',
      payload.demo_url || payload.demo || ''
    );
    formData.append('estado', payload.estado || 'Borrador');

    formData.append(
      'tecnologias_ids',
      JSON.stringify(obtenerIdsTecnologias(payload))
    );

    const imagen = payload.imagen || payload.archivo_imagen;

    if (esArchivo(imagen)) {
      formData.append('imagen', imagen);
    }

    return service.create(formData);
  },

  async update(id, payload) {
    const datos = {
      nombre: payload.nombre || payload.titulo || '',
      descripcion: payload.descripcion || '',
      repositorio_url:
        payload.repositorio_url || payload.repositorio || '',
      imagen_url:
        typeof payload.imagen === 'string'
          ? payload.imagen
          : payload.imagen_url || '',
      demo_url: payload.demo_url || payload.demo || '',
      estado: payload.estado || 'Borrador',
      tecnologias: obtenerTecnologiasParaEdicion(payload)
    };

    return service.update(id, datos);
  },

  async remove(id) {
    return service.remove(id);
  }
};

export default proyectosService;