
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { registrarVisita } from "../services/portafolioApi";

const secciones = {
  "/": "Inicio",
  "/sobre-mi": "Sobre mí",
  "/tecnologias": "Tecnologías",
  "/servicios": "Servicios",
  "/proyectos": "Proyectos",
  "/contacto": "Contacto",
  "/login": "Login",
  "/registro": "Registro",
};

function RegistroVisitas() {
  const { pathname } = useLocation();
  const ultimaRuta = useRef(null);

  useEffect(() => {
    // Evitar registros duplicados del efecto en desarrollo.
    if (ultimaRuta.current === pathname) {
      return;
    }

    ultimaRuta.current = pathname;

    const seccion = secciones[pathname];

    // No registrar rutas desconocidas o vistas previas.
    if (!seccion) {
      return;
    }

    registrarVisita(seccion)
      .catch((error) => {
        console.warn(
          "No se pudo registrar la visita:",
          error.message
        );
      });

  }, [pathname]);

  return null;
}

export default RegistroVisitas;
