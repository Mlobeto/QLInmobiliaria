import { Routes, Route } from "react-router-dom";
import Landing from "./Components/Landing";
import Panel from "./Components/Admin/Panel";
import Clientes from "./Components/Clientes/Clientes";
import Propiedades from "./Components/Propiedades/Propiedades";
import ContractAlquilerForm from "./Components/Contratos/ContractAlquilerForm";
import PanelClientes from "./Components/Admin/PanelClientes";
import PanelContratos from "./Components/Admin/PanelContratos";
import PanelPropiedades from "./Components/Admin/PanelPropiedades";
import ListadoDeClientes from "./Components/Clientes/ListadoDeClientes";
import ListadoPropiedades from "./Components/Propiedades/ListadoPropiedades";
import LoginAdmin from "./Components/Admin/Login/Login";

// eslint-disable-next-line no-unused-vars
import ProtectedRoutes from "./utils/ProtectedRoutes";

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
        path="/panelClientes"
        element={
          //  <ProtectedRoutes>
          <PanelClientes />
          //  </ProtectedRoutes>
        }
      />
      <Route
        path="/listadoClientes"
        element={
          //  <ProtectedRoutes>
          <ListadoDeClientes />
          //  </ProtectedRoutes>
        }
      />
      <Route
        path="/panelContratos"
        element={
          //  <ProtectedRoutes>
          <PanelContratos />
          //  </ProtectedRoutes>
        }
      />

<Route
        path="/panelPropiedades"
        element={
          //  <ProtectedRoutes>
          <PanelPropiedades />
          //  </ProtectedRoutes>
        }
      />


<Route
        path="/listadoDePropiedades"
        element={
          //  <ProtectedRoutes>
          <ListadoPropiedades />
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
        path="/contratos"
        element={
          //  <ProtectedRoutes>
          <ContractAlquilerForm />
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

      <Route path="/login" element={<LoginAdmin />} />
    </Routes>
  );
}

export default App;
