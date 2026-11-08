
import React from "react";

import {
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

// Componentes públicos
import Navbar from "../features/publico/components/Navbar";
import Footer from "../features/publico/components/Footer";

// Páginas públicas
import Home from "../features/publico/pages/Home";
import About from "../features/publico/pages/About";
import Technologies from "../features/publico/pages/Technologies";
import Services from "../features/publico/pages/Services";
import Projects from "../features/publico/pages/Projects";
import Contact from "../features/publico/pages/Contact";
import Login from "../features/publico/pages/Login";
import Register from "../features/publico/pages/Register";

// Páginas restringidas
import ProjectDetail from "../features/publico/pages/ProjectDetail";
import Demos from "../features/publico/pages/Demos";

// Estilos del frontend público
import "../features/publico/styles/global.css";

function PublicRoutes() {
  return (
    <div className="publico-layout">

      <Navbar />

      <Switch>

        {/* PÁGINAS PÚBLICAS */}
        <Route exact path="/" component={Home} />

        <Route
          exact
          path="/sobre-mi"
          component={About}
        />

        <Route
          exact
          path="/tecnologias"
          component={Technologies}
        />

        <Route
          exact
          path="/servicios"
          component={Services}
        />

        <Route
          exact
          path="/proyectos"
          component={Projects}
        />

        <Route
          exact
          path="/contacto"
          component={Contact}
        />

        <Route
          exact
          path="/login"
          component={Login}
        />

        <Route
          exact
          path="/registro"
          component={Register}
        />

        {/* VISTAS PREVIAS DE DESARROLLO */}
        {process.env.NODE_ENV === "development" && (
          <>
            <Route
              exact
              path="/vista-previa/proyecto"
              component={ProjectDetail}
            />

            <Route
              exact
              path="/vista-previa/demos"
              component={Demos}
            />
          </>
        )}

        {/* RUTAS PROTEGIDAS PENDIENTES */}
        <Route exact path="/proyectos/:id">
          <Redirect to="/login" />
        </Route>

        <Route exact path="/demos">
          <Redirect to="/login" />
        </Route>

        <Route exact path="/demos/:id">
          <Redirect to="/login" />
        </Route>

        {/* RUTAS NO ENCONTRADAS */}
        <Redirect to="/" />

      </Switch>

      <Footer />

    </div>
  );
}
export default PublicRoutes;