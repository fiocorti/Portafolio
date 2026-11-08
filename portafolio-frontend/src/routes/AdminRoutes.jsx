import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import ProyectosList from '../pages/proyectos/ProyectosList';
import ProyectoCreate from '../pages/proyectos/ProyectoCreate';
import ProyectoEdit from '../pages/proyectos/ProyectoEdit';
import ProyectoDetail from '../pages/proyectos/ProyectoDetail';
import DemosList from '../pages/demos/DemosList';
import DemoCreate from '../pages/demos/DemoCreate';
import DemoEdit from '../pages/demos/DemoEdit';
import DemoDetail from '../pages/demos/DemoDetail';
import ServiciosList from '../pages/servicios/ServiciosList';
import ServicioCreate from '../pages/servicios/ServicioCreate';
import ServicioEdit from '../pages/servicios/ServicioEdit';
import ServicioDetail from '../pages/servicios/ServicioDetail';
import UsuariosList from '../pages/usuarios/UsuariosList';
import UsuarioDetail from '../pages/usuarios/UsuarioDetail';
import UsuarioEdit from '../pages/usuarios/UsuarioEdit';
import ConsultasList from '../pages/consultas/ConsultasList';
import ConsultaDetail from '../pages/consultas/ConsultaDetail';
import ResponderConsulta from '../pages/consultas/ResponderConsulta';
import Estadisticas from '../pages/Estadisticas';
import Configuracion from '../pages/Configuracion';
import useAuth from '../hooks/useAuth';
import LoadingState from '../components/LoadingState';


function AdminAccess({
  children,
  allowed = ["administrador", "admin", "operador"],
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <LoadingState label="Verificando sesión..." />
    );
  }

  // Usuario no autenticado
  if (!user) {
    return <Redirect to="/login" />;
  }

  // Obtener el rol del usuario
  const rol = String(
    user.rol || user.role || ""
  ).toLowerCase().trim();

  // Verificar si tiene permiso
  if (!allowed.includes(rol)) {

    // Un operador no puede acceder a
    // funcionalidades exclusivas del admin
    if (rol === "operador") {
      return <Redirect to="/admin/consultas" />;
    }

    // Usuarios sin permisos administrativos
    // vuelven al sitio público
    return <Redirect to="/" />;
  }

  return children;
}


function AdminOnly({ children }) {
  return <AdminAccess allowed={['administrador', 'admin']}>{children}</AdminAccess>;
}

export default function AdminRoutes() {
  return (
    <Switch>
      <Route path="/admin">
        <AdminAccess>
          <AdminLayout>
            <Switch>
              <Route exact path="/admin" component={Estadisticas} />
              <Route exact path="/admin/proyectos" render={() => <AdminOnly><ProyectosList /></AdminOnly>} />
              <Route exact path="/admin/proyectos/nuevo" render={() => <AdminOnly><ProyectoCreate /></AdminOnly>} />
              <Route exact path="/admin/proyectos/:id/editar" render={() => <AdminOnly><ProyectoEdit /></AdminOnly>} />
              <Route exact path="/admin/proyectos/:id" render={() => <AdminOnly><ProyectoDetail /></AdminOnly>} />
              <Route exact path="/admin/demos" render={() => <AdminOnly><DemosList /></AdminOnly>} />
              <Route exact path="/admin/demos/nueva" render={() => <AdminOnly><DemoCreate /></AdminOnly>} />
              <Route exact path="/admin/demos/:id/editar" render={() => <AdminOnly><DemoEdit /></AdminOnly>} />
              <Route exact path="/admin/demos/:id" render={() => <AdminOnly><DemoDetail /></AdminOnly>} />
              <Route exact path="/admin/servicios" render={() => <AdminOnly><ServiciosList /></AdminOnly>} />
              <Route exact path="/admin/servicios/nuevo" render={() => <AdminOnly><ServicioCreate /></AdminOnly>} />
              <Route exact path="/admin/servicios/:id/editar" render={() => <AdminOnly><ServicioEdit /></AdminOnly>} />
              <Route exact path="/admin/servicios/:id" render={() => <AdminOnly><ServicioDetail /></AdminOnly>} />
              <Route exact path="/admin/usuarios" render={() => <AdminOnly><UsuariosList /></AdminOnly>} />
              <Route exact path="/admin/usuarios/:id/editar" render={() => <AdminOnly><UsuarioEdit /></AdminOnly>} />
              <Route exact path="/admin/usuarios/:id" render={() => <AdminOnly><UsuarioDetail /></AdminOnly>} />
              <Route exact path="/admin/consultas" component={ConsultasList} />
              <Route exact path="/admin/consultas/:id/responder" component={ResponderConsulta} />
              <Route exact path="/admin/consultas/:id" component={ConsultaDetail} />
              <Redirect exact from="/admin/estadisticas" to="/admin" />
              <Route exact path="/admin/configuracion" render={() => <AdminOnly><Configuracion /></AdminOnly>} />
              <Redirect to="/admin" />
            </Switch>
          </AdminLayout>
        </AdminAccess>
      </Route>
      <Redirect to="/admin" />
    </Switch>
  );
}
