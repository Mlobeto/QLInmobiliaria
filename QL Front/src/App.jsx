
import { Routes, Route } from "react-router-dom";
import Landing from "./Components/Landing";
import Panel from "./Components/Admin/Panel";
import Clientes from "./Components/Clientes/Clientes"
import Propiedades from "./Components/Propiedades/Propiedades"

import LoginAdmin from "./Components/Admin/Login/Login";

// eslint-disable-next-line no-unused-vars
import ProtectedRoutes from './utils/ProtectedRoutes';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      {/* Ruta protegida: solo los administradores pueden ver el Panel */}
      <Route
        path="/panel"
        element={
          //  <ProtectedRoutes>
          <Panel />
          //  </ProtectedRoutes>
        }
      />
      <Route
        path="/cliente"
        element={
          //  <ProtectedRoutes>
          <Clientes />
          //  </ProtectedRoutes>
        }
      />

<Route
        path="/cargarPropiedad"
        element={
          //  <ProtectedRoutes>
          <Propiedades />
          //  </ProtectedRoutes>
        }
      />
         <Route
        path="/login"
        element={
          
          <LoginAdmin />
          
        }
      />

      
    </Routes>
  );
}

export default App;