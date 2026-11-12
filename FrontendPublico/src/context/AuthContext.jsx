
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { useLocation } from "react-router-dom";

import {
  iniciarSesion,
  obtenerSesionActual,
  cerrarSesion,
} from "../services/portafolioApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { pathname } = useLocation();

  const [usuario, setUsuario] = useState(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);
  const [errorSesion, setErrorSesion] = useState("");

  // Permite ignorar comprobaciones anteriores
  // cuando el usuario inicia o cierra sesión.
  const versionSesion = useRef(0);

  useEffect(() => {
    let activo = true;
    let ultimoIntento = 0;

    const verificarSesion = async () => {
      const intento = ++ultimoIntento;
      const version = versionSesion.current;

      try {
        const usuarioActual = await obtenerSesionActual();

        if (
          !activo ||
          intento !== ultimoIntento ||
          version !== versionSesion.current
        ) {
          return;
        }

        setUsuario(usuarioActual);
        setErrorSesion("");

      } catch (err) {
        if (
          !activo ||
          intento !== ultimoIntento ||
          version !== versionSesion.current
        ) {
          return;
        }

        if (err.status === 401) {
          // Sesión inválida o vencida
          setUsuario(null);
          setErrorSesion("");
        } else {
          // Error de red o del servidor.
          // Conservamos el usuario previamente conocido.
          setErrorSesion(
            "No se pudo verificar la sesión. Revisá la conexión con el servidor."
          );
        }

      } finally {
        if (
          activo &&
          intento === ultimoIntento &&
          version === versionSesion.current
        ) {
          setCargandoSesion(false);
        }
      }
    };

    // Verificar al cargar y al cambiar de ruta.
    verificarSesion();

    // Verificar cuando el usuario vuelve a la pestaña.
    const alVolverAPestana = () => {
      if (document.visibilityState === "visible") {
        verificarSesion();
      }
    };

    document.addEventListener(
      "visibilitychange",
      alVolverAPestana
    );

    return () => {
      activo = false;

      document.removeEventListener(
        "visibilitychange",
        alVolverAPestana
      );
    };
  }, [pathname]);

  // Login
  const entrar = async (email, contrasena) => {
    await iniciarSesion(email, contrasena);

    const usuarioActual = await obtenerSesionActual();

    versionSesion.current += 1;

    setUsuario(usuarioActual);
    setErrorSesion("");
    setCargandoSesion(false);

    return usuarioActual;
  };

  // Logout
  const salir = async () => {
    await cerrarSesion();

    versionSesion.current += 1;

    setUsuario(null);
    setErrorSesion("");
    setCargandoSesion(false);
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        cargandoSesion,
        errorSesion,
        entrar,
        salir,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error(
      "useAuth debe utilizarse dentro de AuthProvider"
    );
  }

  return contexto;
}
