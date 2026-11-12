import { mockRequest } from '../mocks/mockData';

const API_URL = (process.env.REACT_APP_API_URL || '').replace(/\/$/, '');
const USE_MOCKS = process.env.REACT_APP_USE_MOCKS === 'true';

export class ApiError extends Error {
  constructor(message, status = 0, details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

function esFormData(value) {
  return typeof FormData !== 'undefined' && value instanceof FormData;
}

async function leerRespuesta(response) {
  if (response.status === 204) return null;

  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return response.json().catch(() => ({}));
  }

  const texto = await response.text().catch(() => '');
  return texto ? { mensaje: texto } : {};
}

export async function request(path, options = {}) {
  if (USE_MOCKS) {
    return mockRequest(path, options);
  }

  const url = `${API_URL}${path.startsWith('/') ? path : `/${path}`}`;

  const headers = {
    Accept: 'application/json',
    ...options.headers
  };

  let body = options.body;

  if (body !== undefined && body !== null && !esFormData(body)) {
    if (typeof body === 'object' && typeof body !== 'string') {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(body);
    } else if (typeof body === 'string' && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }
  }

  let response;

  try {
    response = await fetch(url, {
      ...options,
      headers,
      body,
      credentials: 'include'
    });
  } catch (error) {
    throw new ApiError(
      'No se pudo conectar con el backend. Comprobá que el servidor esté iniciado en el puerto 3001.',
      0,
      error
    );
  }

  const data = await leerRespuesta(response);

  if (!response.ok) {
    const mensaje =
      data?.mensaje ||
      data?.message ||
      data?.error ||
      `Error HTTP ${response.status}`;

    throw new ApiError(mensaje, response.status, data);
  }

  return data;
}

export const apiConfig = {
  get mocksEnabled() {
    return USE_MOCKS;
  },
  baseUrl: API_URL || '/ (proxy de React)'
};