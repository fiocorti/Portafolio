import { request } from './api';

function normalizarEstado(estado) {
  const valor = String(estado || '').toLowerCase();

  if (valor === 'respondida') return 'Respondida';
  if (valor === 'pendiente') return 'Pendiente';

  return estado || 'Pendiente';
}

function adaptarConsulta(consulta, mensajes = []) {
  const listaMensajes = Array.isArray(mensajes) ? mensajes : [];

  const mensajeOriginal = listaMensajes.find(
    mensaje => !mensaje.es_respuesta_admin
  );

  const respuestas = listaMensajes.filter(
    mensaje => Boolean(mensaje.es_respuesta_admin)
  );

  const ultimaRespuesta = respuestas[respuestas.length - 1];

  return {
    ...consulta,
    id: consulta.id_consulta ?? consulta.id,
    nombre: consulta.nombre_remitente ?? consulta.nombre ?? '',
    email: consulta.email_remitente ?? consulta.email ?? '',
    asunto: consulta.motivo ?? consulta.asunto ?? '',
    fecha: consulta.fecha_inicio ?? consulta.fecha ?? null,
    estado: normalizarEstado(consulta.estado),
    mensaje:
      mensajeOriginal?.contenido ??
      consulta.contenido ??
      consulta.mensaje ??
      '',
    respuesta: ultimaRespuesta?.contenido ?? '',
    mensajes: listaMensajes
  };
}

const consultasService = {
  // GET /api/contacto
  async list() {
    const data = await request('/api/contacto');
    const consultas = data?.consultas || [];

    return Array.isArray(consultas)
      ? consultas.map(consulta => adaptarConsulta(consulta))
      : [];
  },

  // GET /api/contacto/:id
  async get(id) {
    const data = await request(
      `/api/contacto/${encodeURIComponent(id)}`
    );

    if (!data?.consulta) {
      throw new Error('No se encontraron los datos de la consulta.');
    }

    return adaptarConsulta(
      data.consulta,
      data.mensajes || []
    );
  },

  // POST /api/contacto/responder
  async reply(id, respuesta) {
    return request('/api/contacto/responder', {
      method: 'POST',
      body: {
        id_consulta: id,
        contenido_respuesta: respuesta
      }
    });
  }
};

export default consultasService;