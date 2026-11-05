import { mockRequest } from '../mocks/mockData';

const API_URL = (process.env.REACT_APP_API_URL || '').replace(/\/$/, '');
const USE_MOCKS = process.env.REACT_APP_USE_MOCKS === 'true';

export class ApiError extends Error {
  constructor(message, status = 0, details = null) { super(message); this.name = 'ApiError'; this.status = status; this.details = details; }
}

export async function request(path, options = {}) {
  if (USE_MOCKS) return mockRequest(path, options);
  const headers = { Accept: 'application/json', ...(options.body && !(options.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}), ...options.headers };
  let body = options.body;
  if (body && typeof body === 'object' && !(body instanceof FormData) && typeof body !== 'string') body = JSON.stringify(body);
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...options, headers, body, credentials: 'include' });
  } catch (error) {
    throw new ApiError('No se pudo conectar con el servidor. Verificá la API y la conexión.', 0, error);
  }
  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json().catch(() => ({})) : await response.text();
  if (!response.ok) throw new ApiError(data?.message || data?.error || `Error HTTP ${response.status}`, response.status, data);
  return data;
}

export const apiConfig = { get mocksEnabled() { return USE_MOCKS; }, baseUrl: API_URL };
