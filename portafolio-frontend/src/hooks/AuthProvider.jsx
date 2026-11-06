import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { request } from '../services/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const mocksEnabled = process.env.REACT_APP_USE_MOCKS === 'true';

  const refreshUser = useCallback(async () => {
    if (mocksEnabled) {
      setUser({ id: 'u-401', nombre: 'Camila Guerrero', email: 'admin@portfolio.demo', rol: 'administrador' });
      setLoading(false);
      return;
    }
    try {
      const result = await request('/api/auth/me');
      setUser(result.user || result);
    } catch (error) {
      if (error.status === 401 || error.status === 403) setUser(null);
      else console.error('No se pudo verificar la sesión:', error.message);
    } finally {
      setLoading(false);
    }
  }, [mocksEnabled]);

  useEffect(() => { refreshUser(); }, [refreshUser]);

  const logout = useCallback(async () => {
    try {
      if (!mocksEnabled) await request('/api/auth/logout', { method: 'POST' });
    } finally {
      setUser(null);
      window.location.assign(process.env.REACT_APP_LOGIN_URL || '/login');
    }
  }, [mocksEnabled]);

  const value = useMemo(() => ({ user, loading, refreshUser, logout, setUser }), [user, loading, refreshUser, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
