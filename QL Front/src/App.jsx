import { Routes, Route } from "react-router-dom";
import Landing from "./Components/Landing";
import Panel from "./Components/Admin/Panel";
import Clientes from "./Components/Clientes/Clientes";
import Propiedades from "./Components/Propiedades/Propiedades";

import PanelClientes from "./Components/Admin/PanelClientes";
import PanelContratos from "./Components/Admin/PanelContratos";
import PanelPropiedades from "./Components/Admin/PanelPropiedades";
import ListadoDeClientes from "./Components/Clientes/ListadoDeClientes";
import Listado from "./Components/Propiedades/Listado";
import FiltroPropiedades from "./Components/Propiedades/FiltroPropiedades"
import LoginAdmin from "./Components/Admin/Login/Login";
import CreateLeaseForm from "./Components/Contratos/CreateLeaseForm"
import CompraVenta from "./Components/Contratos/CompraVenta"
//import EstadoContratos from "./Components/Contratos/EstadoContratos"
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
          <Listado />
          //  </ProtectedRoutes>
        }
      />

<Route
        path="/filtro"
        element={
          //  <ProtectedRoutes>
          <FiltroPropiedades />
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
        path="/contratoAlquiler"
        element={
          //  <ProtectedRoutes>
          <CreateLeaseForm />
          //  </ProtectedRoutes>
        }
      />
      <Route
        path="/contratoAlquiler"
        element={
          //  <ProtectedRoutes>
          <CreateLeaseForm />
          //  </ProtectedRoutes>
        }
      />
      <Route
        path="/sale"
        element={
          //  <ProtectedRoutes>
          <CompraVenta />
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
