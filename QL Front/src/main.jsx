import ReactDOM from "react-dom/client";
import App from "./App";
import  {BrowserRouter}  from 'react-router-dom';
import "./index.css";
import axios from "axios";
import { store } from "./redux/Store/store";
import { Provider } from "react-redux";

//axios.defaults.baseURL = "https://gestioncursos-7pte.onrender.com";
axios.defaults.baseURL = "http://localhost:3001";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
   <BrowserRouter>
      <App />  
    </BrowserRouter>
  </Provider>
);