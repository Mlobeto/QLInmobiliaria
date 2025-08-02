import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { verifyToken } from "./redux/Actions/actions";
import Landing from "./Components/Landing";
import Panel from "./Components/Admin/Panel";
import Clientes from "./Components/Clientes/Clientes";
import Propiedades from "./Components/Propiedades/Propiedades";
import EstadoContratos from "./Components/Contratos/EstadoContratos";
import PanelClientes from "./Components/Admin/PanelClientes";
import PanelContratos from "./Components/Admin/PanelContratos";
import PanelPropiedades from "./Components/Admin/PanelPropiedades";
import ListadoDeClientes from "./Components/Clientes/ListadoDeClientes";
import Listado from "./Components/Propiedades/Listado";
import FiltroPropiedades from "./Components/Propiedades/FiltroPropiedades";
import LoginAdmin from "./Components/Admin/Login/Login";
import CreateLeaseForm from "./Components/Contratos/CreateLeaseForm";
import CompraVenta from "./Components/Contratos/CompraVenta";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import PaymentForm from "./Components/Pagos/PaymentForm";
import PaymentList from "./Components/Pagos/PaymentList";
import PaymentReport from "./Components/Pagos/PaymentReport";
import PanelInformes from "./Components/Admin/PanelInformes";
import ContractAlerts from "./Components/Contratos/ContractAlerts";
import ContratoAlquiler from "./Components/PdfTemplates/ContratoAlquiler";
import ActualizarAlquileres from "./Components/Contratos/ActualizarAlquileres";

// 🆕 Crear un wrapper para manejar el PDF con datos
import PDFContractWrapper from "./Components/PdfTemplates/PDFContractWrapper";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(verifyToken());
    }
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<LoginAdmin />} />

      {/* Rutas protegidas */}
      <Route
        path="/panel"
        element={
          <ProtectedRoutes>
            <Panel />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/panelClientes"
        element={
          <ProtectedRoutes>
            <PanelClientes />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/listadoClientes"
        element={
          <ProtectedRoutes>
            <ListadoDeClientes />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/panelContratos"
        element={
          <ProtectedRoutes>
            <PanelContratos />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/panelPropiedades"
        element={
          <ProtectedRoutes>
            <PanelPropiedades />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/PanelInformes"
        element={
          <ProtectedRoutes>
            <PanelInformes />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/listadoDePropiedades"
        element={
          <ProtectedRoutes>
            <Listado />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/filtro"
        element={
          <ProtectedRoutes>
            <FiltroPropiedades />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/cliente"
        element={
          <ProtectedRoutes>
            <Clientes />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/contratoAlquiler"
        element={
          <ProtectedRoutes>
            <CreateLeaseForm />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/updateAlquiler"
        element={
          <ProtectedRoutes>
            <ActualizarAlquileres />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/sale"
        element={
          <ProtectedRoutes>
            <CompraVenta />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/cargarPropiedad"
        element={
          <ProtectedRoutes>
            <Propiedades />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/create-payment"
        element={
          <ProtectedRoutes>
            <PaymentForm />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/leaseList"
        element={
          <ProtectedRoutes>
            <EstadoContratos />
          </ProtectedRoutes>
        }
      />
      
      {/* 🔧 Rutas PDF mejoradas */}
      {/* Ruta específica para PDF con ID de contrato */}
      <Route
        path="/pdf/:leaseId"
        element={
          <ProtectedRoutes>
            <PDFContractWrapper />
          </ProtectedRoutes>
        }
      />
      
      {/* Ruta genérica para PDF (redirige o muestra error) */}
      <Route
        path="/pdf"
        element={
          <ProtectedRoutes>
            <PDFContractWrapper />
          </ProtectedRoutes>
        }
      />
      
      <Route
        path="/paymentList"
        element={
          <ProtectedRoutes>
            <PaymentList />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/reportes"
        element={
          <ProtectedRoutes>
            <PaymentReport />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/alertas"
        element={
          <ProtectedRoutes>
            <ContractAlerts />
          </ProtectedRoutes>
        }
      />
    </Routes>
  );
}

export default App;