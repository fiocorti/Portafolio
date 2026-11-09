
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Technologies from "./pages/Technologies";
import Services from "./pages/Services";
import Projects from "./pages/Projects";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Contact from "./pages/Contact";
import Footer from "./components/Footer";
import { Navigate } from "react-router-dom";
import ProjectDetail from "./pages/ProjectDetail";
import Demos from "./pages/Demos";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/sobre-mi" element={<About />} />

        <Route path="/tecnologias" element={<Technologies />} />

        <Route path="/servicios" element={<Services />} />

        <Route path="/proyectos" element={<Projects />} />

        <Route path="/contacto" element={<Contact />} />

        <Route path="/login" element={<Login />} />

        <Route path="/registro" element={<Register />} />

        
        {/* Ruta real: bloqueada hasta integrar autenticación */}
        <Route
          path="/proyectos/:id"
          element={<Navigate to="/login" replace />}
        />

        {/* Vista previa disponible solo en desarrollo */}
        {process.env.NODE_ENV === "development" && (
          <Route
            path="/vista-previa/proyecto"
            element={<ProjectDetail />}
          />
        )}
        
        {/* Rutas reales pendientes de autenticación */}
        <Route
          path="/demos"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="/demos/:id"
          element={<Navigate to="/login" replace />}
        />

        {/* Vista previa solo en desarrollo */}
        {process.env.NODE_ENV === "development" && (
          <Route
            path="/vista-previa/demos"
            element={<Demos />}
          />
        )}


      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
