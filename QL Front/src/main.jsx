import ReactDOM from "react-dom/client";
import App from "./App";
import  {BrowserRouter}  from 'react-router-dom';
import "./index.css";
import axios from "axios";
import { store } from "./redux/Store/store";
import { Provider } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//axios.defaults.baseURL = "http://localhost:3001";
axios.defaults.baseURL = "https://qlinmobiliaria.onrender.com";

// Interceptor para agregar el token a todas las peticiones
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para detectar token expirado y redirigir al login
let isRedirecting = false; // Flag para evitar múltiples redirecciones

axios.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa, simplemente la retornamos
    return response;
  },
  (error) => {
    // Verificar si el error es 401 (Unauthorized) o 403 (Forbidden)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // No redirigir si ya estamos en la página de login o si ya estamos redirigiendo
      const currentPath = window.location.pathname;
      if (currentPath === '/login' || isRedirecting) {
        return Promise.reject(error);
      }

      // Verificar si el mensaje indica token expirado/inválido
      const errorMessage = error.response.data?.message || error.response.data?.error || '';
      const isTokenError = 
        errorMessage.toLowerCase().includes('token') ||
        errorMessage.toLowerCase().includes('expirado') ||
        errorMessage.toLowerCase().includes('expired') ||
        errorMessage.toLowerCase().includes('invalid') ||
        errorMessage.toLowerCase().includes('unauthorized') ||
        errorMessage.toLowerCase().includes('no autorizado') ||
        error.response.status === 401;

      if (isTokenError) {
        isRedirecting = true;
        
        // Limpiar el token del localStorage
        localStorage.removeItem('token');
        
        // Mostrar mensaje al usuario
        toast.error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
        });
        
        // Redirigir al login después de un pequeño delay
        setTimeout(() => {
          isRedirecting = false;
          window.location.href = '/login';
        }, 1500);
      }
    }
    
    return Promise.reject(error);
  }
);

// Registrar Service Worker para PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('✅ Service Worker registrado:', registration.scope);
      })
      .catch((error) => {
        console.log('❌ Error al registrar Service Worker:', error);
      });
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
  <ToastContainer
      position="top-right" 
      autoClose={4000} 
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored" 
      style={{ fontSize: "1.1rem", width: "350px" }} 
    />
   <BrowserRouter>
      <App />  
    </BrowserRouter>
  </Provider>
);