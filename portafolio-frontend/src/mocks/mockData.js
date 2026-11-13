// Datos de demostración. Solo se usan con REACT_APP_USE_MOCKS=true.
const seed = {
  proyectos: [
    { id: 'p-101', titulo: 'Plataforma de gestión académica', descripcion: 'Sistema web para administrar cursos, estudiantes e inscripciones.', tecnologias: ['React', 'Node.js', 'MySQL'], repositorio: 'https://github.com/', demo: '', imagen: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900', estado: 'Publicado', fecha: '2026-10-20' },
    { id: 'p-102', titulo: 'Tienda online responsive', descripcion: 'Experiencia de compra con catálogo, filtros y carrito.', tecnologias: ['React', 'CSS', 'Express'], repositorio: 'https://github.com/', demo: '', imagen: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900', estado: 'Borrador', fecha: '2026-10-14' },
    { id: 'p-103', titulo: 'Dashboard de métricas', descripcion: 'Visualización de indicadores y reportes para un negocio.', tecnologias: ['JavaScript', 'Chart.js'], repositorio: 'https://github.com/', demo: '', imagen: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900', estado: 'Publicado', fecha: '2026-09-28' }
  ],
  demos: [
    { id: 'd-201', titulo: 'Explorador de GitHub', descripcion: 'Consulta perfiles y repositorios públicos de GitHub.', tecnologias: ['GitHub API', 'React'], url: 'https://github.com/', imagen: '', estado: 'Publicado' },
    { id: 'd-202', titulo: 'Clima en tiempo real', descripcion: 'Consulta las condiciones meteorológicas mediante Open-Meteo.', tecnologias: ['Open-Meteo', 'JavaScript'], url: 'https://open-meteo.com/', imagen: '', estado: 'Publicado' }
  ],
  servicios: [
    { id: 's-301', titulo: 'Desarrollo web', descripcion: 'Sitios y aplicaciones web modernas, accesibles y adaptables a cualquier dispositivo.', icono: 'Code2', caracteristicas: ['Diseño responsive', 'Buenas prácticas', 'Optimización de rendimiento', 'SEO técnico', 'Accesibilidad WCAG 2.1', 'Despliegue continuo'], estado: 'Publicado' },
    { id: 's-302', titulo: 'Integración de APIs', descripcion: 'Conexión de tu aplicación con servicios externos de forma segura y documentada.', icono: 'Plug', caracteristicas: ['Consumo REST', 'Validación de datos', 'Autenticación JWT', 'Documentación Swagger', 'Manejo de errores', 'Webhooks'], estado: 'Publicado' },
    { id: 's-303', titulo: 'Diseño de interfaces', descripcion: 'Prototipos y sistemas de diseño que hacen tu producto claro y fácil de usar.', icono: 'Palette', caracteristicas: ['Prototipos interactivos', 'Sistema de diseño', 'Diseño responsive', 'Pruebas de usabilidad', 'Guía de estilos'], estado: 'Publicado' },
    { id: 's-304', titulo: 'Bases de datos', descripcion: 'Modelado y mantenimiento de datos para aplicaciones que crecen sin perder velocidad.', icono: 'Database', caracteristicas: ['Modelado relacional', 'Consultas optimizadas', 'Migraciones versionadas', 'Respaldos automáticos', 'Índices y rendimiento'], estado: 'Publicado' },
    { id: 's-305', titulo: 'Automatización de procesos', descripcion: 'Scripts y flujos que eliminan tareas repetitivas y avisan cuando algo importante pasa.', icono: 'Workflow', caracteristicas: ['Scripts en Node.js', 'Tareas programadas', 'Integración con Google Sheets', 'Notificaciones por correo'], estado: 'Borrador' },
    { id: 's-306', titulo: 'Soporte y mantenimiento', descripcion: 'Acompañamiento continuo para que tu aplicación siga segura, actualizada y estable.', icono: 'LifeBuoy', caracteristicas: ['Actualizaciones de seguridad', 'Monitoreo de errores', 'Respuesta en 24 h', 'Reporte mensual', 'Copias de seguridad'], estado: 'Publicado' }
  ],
  usuarios: [
    { id: 'u-401', nombre: 'Camila Guerrero', email: 'admin@portfolio.demo', rol: 'administrador', estado: 'Activo', fechaRegistro: '2026-09-01' },
    { id: 'u-402', nombre: 'Sofía Martínez', email: 'sofia@example.com', rol: 'operador', estado: 'Activo', fechaRegistro: '2026-09-12' },
    { id: 'u-403', nombre: 'Lucas Fernández', email: 'lucas@example.com', rol: 'usuario', estado: 'Activo', fechaRegistro: '2026-10-02' },
    { id: 'u-404', nombre: 'Valentina Ruiz', email: 'vale@example.com', rol: 'usuario', estado: 'Inactivo', fechaRegistro: '2026-10-09' }
  ],
  contactos: [
    { id: 'c-501', nombre: 'María López', email: 'maria@example.com', asunto: 'Consulta por desarrollo web', mensaje: 'Hola, quisiera conocer más sobre tus servicios de desarrollo web.', fecha: '2026-11-02T10:30:00', estado: 'Pendiente' },
    { id: 'c-502', nombre: 'Julián Pérez', email: 'julian@example.com', asunto: 'Propuesta de colaboración', mensaje: 'Me interesa conversar sobre una posible colaboración.', fecha: '2026-11-01T16:15:00', estado: 'Respondida', respuesta: '¡Gracias por escribirme! Me pondré en contacto.' }
  ]
};

const KEY = 'portfolio-admin-mock-v2';
function readStore() {
  try { const saved = localStorage.getItem(KEY); return saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(seed)); }
  catch (_) { return JSON.parse(JSON.stringify(seed)); }
}
function writeStore(store) { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (_) { /* almacenamiento no disponible */ } }
function dashboard(store) {
  return {
    counts: { proyectos: store.proyectos.length, demos: store.demos.length, servicios: store.servicios.length, usuarios: store.usuarios.length, consultasPendientes: store.contactos.filter(x => x.estado === 'Pendiente').length },
    visits: [{ label: 'Lun', value: 34 }, { label: 'Mar', value: 48 }, { label: 'Mié', value: 42 }, { label: 'Jue', value: 65 }, { label: 'Vie', value: 54 }, { label: 'Sáb', value: 79 }, { label: 'Dom', value: 68 }],
    distribution: [{ label: 'Proyectos', value: store.proyectos.length }, { label: 'Demos', value: store.demos.length }, { label: 'Servicios', value: store.servicios.length }],
    activity: [{ id: 1, text: 'Panel de demostración listo para utilizar', date: 'Hoy' }, { id: 2, text: 'Los datos se almacenan localmente en modo demo', date: 'Modo demo' }]
  };
}

export async function mockRequest(path, options = {}) {
  await new Promise(resolve => setTimeout(resolve, 120));
  const method = (options.method || 'GET').toUpperCase();
  const cleanPath = path.split('?')[0].replace(/\/$/, '');
  const body = options.body || {};
  if (cleanPath === '/api/auth/me' && method === 'GET') return { user: seed.usuarios[0] };
  if (cleanPath === '/api/auth/logout' && method === 'POST') return { success: true };
  const store = readStore();
  if (cleanPath === '/api/admin/dashboard' && method === 'GET') return dashboard(store);
  if (cleanPath === '/api/admin/estadisticas' && method === 'GET') return dashboard(store);

  // Simula la misma ruta y el mismo contrato que utiliza el backend real.
  if (cleanPath === '/api/contacto/responder' && method === 'POST') {
    const contact = store.contactos.find(item => String(item.id) === String(body.id_consulta));
    if (!contact) throw { status: 404, message: 'Consulta no encontrada.' };
    contact.respuesta = body.contenido_respuesta || '';
    contact.estado = 'Respondida';
    writeStore(store);
    return {
      item: contact,
      mensaje: 'Respuesta registrada en los datos de demostración.'
    };
  }

  const routes = [
    ['proyectos', '/api/admin/proyectos'], ['demos', '/api/admin/demos'], ['servicios', '/api/admin/servicios'],
    ['usuarios', '/api/admin/usuarios'], ['contactos', '/api/contactos']
  ];
  for (const [key, prefix] of routes) {
    if (cleanPath === prefix || cleanPath.startsWith(`${prefix}/`)) {
      const id = cleanPath.slice(prefix.length).replace(/^\//, '');
      const index = id ? store[key].findIndex(item => String(item.id) === id) : -1;
      if (key === 'contactos' && id && cleanPath.endsWith('/responder') && method === 'POST') {
        const contactId = cleanPath.split('/')[3];
        const contact = store.contactos.find(item => String(item.id) === contactId);
        if (!contact) throw { status: 404, message: 'Consulta no encontrada.' };
        contact.respuesta = body.respuesta || '';
        contact.estado = 'Respondida';
        writeStore(store);
        return { item: contact, message: 'Respuesta registrada en los datos de demostración.' };
      }
      if (!id && method === 'GET') return { items: store[key] };
      if (id && method === 'GET') {
        if (index < 0) throw { status: 404, message: 'Registro no encontrado.' };
        return { item: store[key][index] };
      }
      if (method === 'POST' && !id) {
        const item = { ...body, id: `${key.slice(0, 1)}-${Date.now()}`, fecha: body.fecha || new Date().toISOString().slice(0, 10) };
        store[key].unshift(item); writeStore(store); return { item, message: 'Registro creado en modo demostración.' };
      }
      if (id && ['PUT', 'PATCH'].includes(method)) {
        if (index < 0) throw { status: 404, message: 'Registro no encontrado.' };
        store[key][index] = { ...store[key][index], ...body, id: store[key][index].id };
        writeStore(store); return { item: store[key][index], message: 'Registro actualizado en modo demostración.' };
      }
      if (id && method === 'DELETE') {
        if (index < 0) throw { status: 404, message: 'Registro no encontrado.' };
        store[key].splice(index, 1); writeStore(store); return { success: true, message: 'Registro eliminado en modo demostración.' };
      }
    }
  }
  throw { status: 404, message: `Ruta de demostración no configurada: ${method} ${cleanPath}` };
}
