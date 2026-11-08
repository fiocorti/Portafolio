import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    setUser({
      id: 'u-401',
      nombre: 'Camila Guerrero',
      email: 'admin@portfolio.demo',
      rol: 'administrador'
    });

    setLoading(false);
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, refreshUser, logout, setUser }),
    [user, loading, refreshUser, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}