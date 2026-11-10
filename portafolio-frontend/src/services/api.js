
import { mockRequest } from '../mocks/mockData';

// Las solicitudes se envían al backend en el puerto 3001.
const API_URL = 'http://localhost:3001';

const USE_MOCKS = process.env.REACT_APP_USE_MOCKS === 'true';

export class ApiError extends Error {
  constructor(message, status = 0, details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export async function request(path, options = {}) {
  // Si está activado el modo de pruebas, utiliza los datos simulados.
  if (USE_MOCKS) {
    return mockRequest(path, options);
  }

  const headers = {
    Accept: 'application/json',
    ...(options.body && !(options.body instanceof FormData)
      ? { 'Content-Type': 'application/json' }
      : {}),
    ...options.headers
  };

  let body = options.body;

  // Convierte los objetos a JSON, excepto FormData.
  if (
    body &&
    typeof body === 'object' &&
    !(body instanceof FormData) &&
    typeof body !== 'string'
  ) {
    body = JSON.stringify(body);
  }

  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
      body,
      credentials: 'include'
    });
  } catch (error) {
    throw new ApiError(
      'No se pudo conectar con el servidor. Verificá la API y la conexión.',
      0,
      error
    );
  }

  const contentType = response.headers.get('content-type') || '';

  const data = contentType.includes('application/json')
    ? await response.json().catch(() => ({}))
    : await response.text();

  // Reconoce los distintos formatos de error del backend.
  if (!response.ok) {
    const mensaje =
      data?.mensaje ||
      data?.message ||
      data?.error ||
      `Error HTTP ${response.status}`;

    throw new ApiError(
      mensaje,
      response.status,
      data
    );
  }

  return data;
}

export const apiConfig = {
  get mocksEnabled() {
    return USE_MOCKS;
  },
  baseUrl: API_URL
};
