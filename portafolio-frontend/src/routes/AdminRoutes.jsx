
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import AdminLayout from '../layouts/AdminLayout';

// PROYECTOS
import ProyectosList from '../pages/proyectos/ProyectosList';
import ProyectoCreate from '../pages/proyectos/ProyectoCreate';
import ProyectoEdit from '../pages/proyectos/ProyectoEdit';
import ProyectoDetail from '../pages/proyectos/ProyectoDetail';

// DEMOS
import DemosList from '../pages/demos/DemosList';
import DemoCreate from '../pages/demos/DemoCreate';
import DemoEdit from '../pages/demos/DemoEdit';
import DemoDetail from '../pages/demos/DemoDetail';

// SERVICIOS
import ServiciosList from '../pages/servicios/ServiciosList';
import ServicioCreate from '../pages/servicios/ServicioCreate';
import ServicioEdit from '../pages/servicios/ServicioEdit';
import ServicioDetail from '../pages/servicios/ServicioDetail';

// USUARIOS
import UsuariosList from '../pages/usuarios/UsuariosList';
import UsuarioDetail from '../pages/usuarios/UsuarioDetail';
import UsuarioEdit from '../pages/usuarios/UsuarioEdit';

// CONSULTAS
import ConsultasList from '../pages/consultas/ConsultasList';
import ConsultaDetail from '../pages/consultas/ConsultaDetail';
import ResponderConsulta from '../pages/consultas/ResponderConsulta';

// TECNOLOGÍAS
import TecnologiasList from '../pages/tecnologias/TecnologiasList';
import TecnologiaCreate from '../pages/tecnologias/TecnologiaCreate';
import TecnologiaEdit from '../pages/tecnologias/TecnologiaEdit';

// EXPERIENCIAS
import ExperienciasList from '../pages/experiencias/ExperienciasList';
import ExperienciaCreate from '../pages/experiencias/ExperienciaCreate';

// GENERAL
import Estadisticas from '../pages/Estadisticas';
import Configuracion from '../pages/Configuracion';

import useAuth from '../hooks/useAuth';
import LoadingState from '../components/LoadingState';

function AdminAccess({
  children,
  allowed = ['administrador', 'admin', 'operador']
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingState label="Verificando sesión..." />;
  }

  if (!user) {
    return <Redirect to={process.env.REACT_APP_LOGIN_URL || '/login'} />;
  }

  const role = String(user.rol || user.role || '').toLowerCase();

  if (!allowed.includes(role)) {
    return <Redirect to="/admin/consultas" />;
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
      <Route path="/admin">
        <AdminAccess>
          <AdminLayout>
            <Switch>

              {/* INICIO / ESTADÍSTICAS */}
              <Route
                exact
                path="/admin"
                component={Estadisticas}
              />

              {/* PROYECTOS */}
              <Route
                exact
                path="/admin/proyectos"
                render={() => <AdminOnly><ProyectosList /></AdminOnly>}
              />

              <Route
                exact
                path="/admin/proyectos/nuevo"
                render={() => <AdminOnly><ProyectoCreate /></AdminOnly>}
              />

              <Route
                exact
                path="/admin/proyectos/:id/editar"
                render={() => <AdminOnly><ProyectoEdit /></AdminOnly>}
              />

              <Route
                exact
                path="/admin/proyectos/:id"
                render={() => <AdminOnly><ProyectoDetail /></AdminOnly>}
              />

              {/* DEMOS */}
              <Route
                exact
                path="/admin/demos"
                render={() => <AdminOnly><DemosList /></AdminOnly>}
              />

              <Route
                exact
                path="/admin/demos/nueva"
                render={() => <AdminOnly><DemoCreate /></AdminOnly>}
              />

              <Route
                exact
                path="/admin/demos/:id/editar"
                render={() => <AdminOnly><DemoEdit /></AdminOnly>}
              />

              <Route
                exact
                path="/admin/demos/:id"
                render={() => <AdminOnly><DemoDetail /></AdminOnly>}
              />

              {/* TECNOLOGÍAS */}
              <Route
                exact
                path="/admin/tecnologias"
                render={() => <AdminOnly><TecnologiasList /></AdminOnly>}
              />

              <Route
                exact
                path="/admin/tecnologias/nuevo"
                render={() => <AdminOnly><TecnologiaCreate /></AdminOnly>}
              />

              <Route
                exact
                path="/admin/tecnologias/:id/editar"
                render={() => <AdminOnly><TecnologiaEdit /></AdminOnly>}
              />

              {/* EXPERIENCIAS */}
              <Route
                exact
                path="/admin/experiencias"
                render={() => <AdminOnly><ExperienciasList /></AdminOnly>}
              />

              <Route
                exact
                path="/admin/experiencias/nuevo"
                render={() => <AdminOnly><ExperienciaCreate /></AdminOnly>}
              />

              {/* SERVICIOS */}
              <Route
                exact
                path="/admin/servicios"
                render={() => <AdminOnly><ServiciosList /></AdminOnly>}
              />

              <Route
                exact
                path="/admin/servicios/nuevo"
                render={() => <AdminOnly><ServicioCreate /></AdminOnly>}
              />

              <Route
                exact
                path="/admin/servicios/:id/editar"
                render={() => <AdminOnly><ServicioEdit /></AdminOnly>}
              />

              <Route
                exact
                path="/admin/servicios/:id"
                render={() => <AdminOnly><ServicioDetail /></AdminOnly>}
              />

              {/* USUARIOS */}
              <Route
                exact
                path="/admin/usuarios"
                render={() => <AdminOnly><UsuariosList /></AdminOnly>}
              />

              <Route
                exact
                path="/admin/usuarios/:id/editar"
                render={() => <AdminOnly><UsuarioEdit /></AdminOnly>}
              />

              <Route
                exact
                path="/admin/usuarios/:id"
                render={() => <AdminOnly><UsuarioDetail /></AdminOnly>}
              />

              {/* CONSULTAS */}
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

              {/* CONFIGURACIÓN Y ESTADÍSTICAS */}
              <Redirect
                exact
                from="/admin/estadisticas"
                to="/admin"
              />

              <Route
                exact
                path="/admin/configuracion"
                render={() => <AdminOnly><Configuracion /></AdminOnly>}
              />

              {/* RUTA POR DEFECTO */}
              <Redirect to="/admin" />

            </Switch>
          </AdminLayout>
        </AdminAccess>
      </Route>

      <Redirect to="/admin" />
    </Switch>
  );
}
