
import { request } from './api';

const authService = {
  async login(email, contrasena) {
    const response = await request('/api/auth/login', {
      method: 'POST',
      body: {
        email: email.trim(),
        contrasena
      }
    });

    if (!response?.exito || !response?.token || !response?.usuario) {
      throw new Error(
        response?.message || 'No se pudo iniciar sesión.'
      );
    }

    return {
      token: response.token,
      usuario: response.usuario
    };
  },

  async me() {
    return request('/api/auth/me', {
      method: 'GET'
    });
  },

  async logout() {
    return request('/api/auth/logout', {
      method: 'POST'
    });
  },

  async register(datos) {
    return request('/api/auth/registro', {
      method: 'POST',
      body: datos
    });
  }
};

export default authService;
