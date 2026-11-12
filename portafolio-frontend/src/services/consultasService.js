import { request } from './api';

function normalizarEstado(estado) {
  const valor = String(estado || '').toLowerCase();

  if (valor === 'respondida') return 'Respondida';
  if (valor === 'pendiente') return 'Pendiente';

  return estado || 'Pendiente';
}

function adaptarConsulta(consulta) {
  return {
    ...consulta,
    id: consulta.id_consulta ?? consulta.id,
    nombre: consulta.nombre_remitente || '',
    email: consulta.email_remitente || '',
    asunto: consulta.motivo || '',
    fecha: consulta.fecha_inicio || null,
    servicio: consulta.nombre_servicio || '',
    estado: normalizarEstado(consulta.estado),
    mensaje: consulta.contenido || consulta.mensaje || '',
    respuesta: '',
    mensajes: []
  };
}

const consultasService = {
  async list() {
    const respuesta = await request('/api/contacto');
    const consultas = respuesta?.consultas || [];

    return Array.isArray(consultas)
      ? consultas.map(adaptarConsulta)
      : [];
  },

  async get(id) {
    const consultas = await this.list();

    const consulta = consultas.find(
      item => String(item.id) === String(id)
    );

    if (!consulta) {
      throw new Error('No se encontró la consulta en el listado.');
    }

    return consulta;
  },

  async reply(id, respuesta) {
    const contenido = String(respuesta || '').trim();

    if (!contenido) {
      throw new Error('Escribí una respuesta antes de enviarla.');
    }

    return request('/api/contacto/responder', {
      method: 'POST',
      body: {
        id_consulta: id,
        contenido_respuesta: contenido
      }
    });
  }
};

export default consultasService;