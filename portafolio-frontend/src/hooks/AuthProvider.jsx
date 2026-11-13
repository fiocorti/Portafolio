
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';

import authService from '../services/authService';

export const AuthContext = createContext(null);

/**
 * Normaliza los diferentes formatos posibles de respuesta
 * del backend para mantener una estructura uniforme.
 */
function normalizarUsuario(respuesta) {
  if (!respuesta) {
    return null;
  }

  const usuario =
    respuesta.usuario ||
    respuesta.user ||
    respuesta.datos?.usuario ||
    respuesta.datos?.user ||
    respuesta.datos ||
    null;

  if (!usuario || typeof usuario !== 'object') {
    return null;
  }

  return {
    ...usuario,

    id:
      usuario.id ??
      usuario.id_usuario ??
      usuario.id_admin ??
      null,

    nombre:
      usuario.nombre ||
      usuario.nombres ||
      usuario.name ||
      '',

    email:
      usuario.email ||
      usuario.correo ||
      '',

    rol:
      usuario.rol ||
      usuario.role ||
      ''
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Recupera la sesión existente.
   * El backend valida la cookie de autenticación.
   */
  const refreshUser = useCallback(async () => {
    try {
      const respuesta = await authService.me();

      const usuario = normalizarUsuario(respuesta);

      setUser(usuario);

      return usuario;
    } catch (error) {
      setUser(null);

      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Inicia sesión utilizando las credenciales
   * verificadas por el backend.
   */
  const login = useCallback(async (email, contrasena) => {
    setLoading(true);

    try {
      // El backend valida las credenciales y establece la cookie.
      await authService.login(email, contrasena);

      // Comprobamos que la sesión realmente quedó establecida.
      const respuesta = await authService.me();

      const usuario = normalizarUsuario(respuesta);

      if (!usuario) {
        setUser(null);

        throw new Error(
          'No se pudieron recuperar los datos de la sesión.'
        );
      }

      setUser(usuario);

      return usuario;
    } catch (error) {
      setUser(null);

      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Cierra la sesión en el backend y limpia
   * el estado de autenticación del frontend.
   */
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setLoading(false);
    }
  }, []);

  /**
   * Comprueba la sesión automáticamente al iniciar
   * o recargar la aplicación.
   */
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  /**
   * Valores y funciones disponibles mediante useAuth().
   */
  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
      refreshUser,
      setUser,
      isAuthenticated: Boolean(user)
    }),
    [
      user,
      loading,
      login,
      logout,
      refreshUser
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
