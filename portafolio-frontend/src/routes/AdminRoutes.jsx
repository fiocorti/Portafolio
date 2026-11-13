import React from 'react';
import {
  Redirect,
  Route,
  Switch
} from 'react-router-dom';

import AdminLayout from '../layouts/AdminLayout';
import useAuth from '../hooks/useAuth';
import LoadingState from '../components/LoadingState';


// Proyectos
import ProyectosList from '../pages/proyectos/ProyectosList';
import ProyectoCreate from '../pages/proyectos/ProyectoCreate';
import ProyectoEdit from '../pages/proyectos/ProyectoEdit';
import ProyectoDetail from '../pages/proyectos/ProyectoDetail';

// Demos
import DemosList from '../pages/demos/DemosList';
import DemoDetail from '../pages/demos/DemoDetail';

// Servicios
import ServiciosList from '../pages/servicios/ServiciosList';
import ServicioCreate from '../pages/servicios/ServicioCreate';
import ServicioEdit from '../pages/servicios/ServicioEdit';
import ServicioDetail from '../pages/servicios/ServicioDetail';

// Usuarios
import UsuariosList from '../pages/usuarios/UsuariosList';
import UsuarioDetail from '../pages/usuarios/UsuarioDetail';
import UsuarioEdit from '../pages/usuarios/UsuarioEdit';

// Consultas
import ConsultasList from '../pages/consultas/ConsultasList';
import ConsultaDetail from '../pages/consultas/ConsultaDetail';
import ResponderConsulta from '../pages/consultas/ResponderConsulta';

// Tecnologías
import TecnologiasList from '../pages/tecnologias/TecnologiasList';
import TecnologiaCreate from '../pages/tecnologias/TecnologiaCreate';

// Experiencias
import ExperienciasList from '../pages/experiencias/ExperienciasList';
import ExperienciaCreate from '../pages/experiencias/ExperienciaCreate';

// General
import Estadisticas from '../pages/Estadisticas';
import Configuracion from '../pages/Configuracion';


const URL_PUBLICA = (
  process.env.REACT_APP_PUBLIC_URL || "http://localhost:3000"
).replace(/\/+$/, "");

// Entrada única de login: frontend público
function LoginPublico() {
  const { user, loading } = useAuth();

  const rol = String(
    user?.rol || user?.role || ""
  ).toLowerCase();

  const tieneAcceso = [
    "administrador",
    "admin",
    "operador"
  ].includes(rol);

  React.useEffect(() => {
    if (!loading && !tieneAcceso) {
      window.location.replace(`${URL_PUBLICA}/login`);
    }
  }, [loading, tieneAcceso]);

  if (loading) {
    return <LoadingState label="Verificando sesión..." />;
  }

  // Si ya es administrador, abrir directamente el panel
  if (tieneAcceso) {
    return <Redirect to="/admin" />;
  }

  return <p>Redirigiendo al inicio de sesión...</p>;
}


function AdminAccess({
  children,
  allowed = ['administrador', 'admin', 'operador']
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingState label="Verificando sesión..." />;
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  const role = String(user.rol || user.role || '').toLowerCase();

  if (!allowed.includes(role)) {
    return <Redirect to="/login" />;
  }

  return children;
}

function AdminOnly({ children }) {
  return (
    <AdminAccess allowed={['administrador', 'admin']}>
      {children}
    </AdminAccess>
  );
}

export default function AdminRoutes() {
  return (
    <Switch>
    <Route exact path="/login" component={LoginPublico} />
      <Route path="/admin">
        <AdminAccess>
          <AdminLayout>
            <Switch>
              {/* Inicio */}
              <Route
                exact
                path="/admin"
                component={Estadisticas}
              />

              {/* Proyectos */}
              <Route
                exact
                path="/admin/proyectos"
                render={() => (
                  <AdminOnly><ProyectosList /></AdminOnly>
                )}
              />

              <Route
                exact
                path="/admin/proyectos/nuevo"
                render={() => (
                  <AdminOnly><ProyectoCreate /></AdminOnly>
                )}
              />

              <Route
                exact
                path="/admin/proyectos/:id/editar"
                render={() => (
                  <AdminOnly><ProyectoEdit /></AdminOnly>
                )}
              />

              <Route
                exact
                path="/admin/proyectos/:id"
                render={() => (
                  <AdminOnly><ProyectoDetail /></AdminOnly>
                )}
              />

              {/* Demos: se consultan desde los proyectos */}
              <Route
                exact
                path="/admin/demos"
                render={() => (
                  <AdminOnly><DemosList /></AdminOnly>
                )}
              />

              <Route
                exact
                path="/admin/demos/nueva"
                render={() => <Redirect to="/admin/proyectos" />}
              />

              <Route
                exact
                path="/admin/demos/:id/editar"
                render={() => <Redirect to="/admin/proyectos" />}
              />

              <Route
                exact
                path="/admin/demos/:id"
                render={() => (
                  <AdminOnly><DemoDetail /></AdminOnly>
                )}
              />

              {/* Tecnologías */}
              <Route
                exact
                path="/admin/tecnologias"
                render={() => (
                  <AdminOnly><TecnologiasList /></AdminOnly>
                )}
              />

              <Route
                exact
                path="/admin/tecnologias/nuevo"
                render={() => (
                  <AdminOnly><TecnologiaCreate /></AdminOnly>
                )}
              />

              <Route
                exact
                path="/admin/tecnologias/:id/editar"
                render={() => <Redirect to="/admin/tecnologias" />}
              />

              {/* Experiencias */}
              <Route
                exact
                path="/admin/experiencias"
                render={() => (
                  <AdminOnly><ExperienciasList /></AdminOnly>
                )}
              />

              <Route
                exact
                path="/admin/experiencias/nuevo"
                render={() => (
                  <AdminOnly><ExperienciaCreate /></AdminOnly>
                )}
              />

              {/* Servicios */}
              <Route
                exact
                path="/admin/servicios"
                render={() => (
                  <AdminOnly><ServiciosList /></AdminOnly>
                )}
              />

              <Route
                exact
                path="/admin/servicios/nuevo"
                render={() => (
                  <AdminOnly><ServicioCreate /></AdminOnly>
                )}
              />

              <Route
                exact
                path="/admin/servicios/:id/editar"
                render={() => (
                  <AdminOnly><ServicioEdit /></AdminOnly>
                )}
              />

              <Route
                exact
                path="/admin/servicios/:id"
                render={() => (
                  <AdminOnly><ServicioDetail /></AdminOnly>
                )}
              />

              {/* Usuarios */}
              <Route
                exact
                path="/admin/usuarios"
                render={() => (
                  <AdminOnly><UsuariosList /></AdminOnly>
                )}
              />

              <Route
                exact
                path="/admin/usuarios/:id/editar"
                render={() => (
                  <AdminOnly><UsuarioEdit /></AdminOnly>
                )}
              />

              <Route
                exact
                path="/admin/usuarios/:id"
                render={() => (
                  <AdminOnly><UsuarioDetail /></AdminOnly>
                )}
              />

              {/* Consultas */}
              <Route
                exact
                path="/admin/consultas"
                component={ConsultasList}
              />

              <Route
                exact
                path="/admin/consultas/:id/responder"
                component={ResponderConsulta}
              />

              <Route
                exact
                path="/admin/consultas/:id"
                component={ConsultaDetail}
              />

              {/* Configuración */}
              <Route
                exact
                path="/admin/configuracion"
                render={() => (
                  <AdminOnly><Configuracion /></AdminOnly>
                )}
              />

              <Redirect
                exact
                from="/admin/estadisticas"
                to="/admin"
              />

              <Redirect to="/admin" />
            </Switch>
          </AdminLayout>
        </AdminAccess>
      </Route>

      <Redirect to="/admin" />
    </Switch>
  );
}