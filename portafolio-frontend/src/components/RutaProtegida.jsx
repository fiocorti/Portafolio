
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RutaProtegida({ children }) {
  const { usuario, cargandoSesion } = useAuth();
  const location = useLocation();

  // Esperar a que el backend confirme la sesión
  if (cargandoSesion) {
    return (
      <main className="auth-page">
        <div className="container py-5">
          <p role="status">Verificando sesión...</p>
        </div>
      </main>
    );
  }

  // Si no inició sesión, enviarlo al login
  if (!usuario) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          desde:
            location.pathname +
            location.search +
            location.hash,
        }}
      />
    );
  }

  // Si está autenticado, mostrar la página
  return children;
}

export default RutaProtegida;
