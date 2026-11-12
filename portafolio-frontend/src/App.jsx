
import React from "react";
import {
  BrowserRouter,
  Switch,
  Route,
} from "react-router-dom";

import { AuthProvider } from "./hooks/AuthProvider";

import AdminRoutes from "./routes/AdminRoutes";
import PublicRoutes from "./routes/PublicRoutes";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Switch>

          {/* RUTAS ADMINISTRATIVAS */}
          <Route
            path="/admin"
            component={AdminRoutes}
          />

          {/* RUTAS PÚBLICAS */}
          <Route
            path="/"
            component={PublicRoutes}
          />

        </Switch>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
