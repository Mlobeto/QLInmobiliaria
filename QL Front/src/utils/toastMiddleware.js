import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const toastMiddleware = () => (next) => (action) => {
  if (action.type.endsWith("_FAILURE")) {
    // Mostrar un toast de error
    toast.error(action.payload || "Ocurrió un error inesperado");
  }

  if (action.type.endsWith("_SUCCESS")) {
    // Mostrar un toast de éxito (opcional, según el caso)
    toast.success("Operación realizada con éxito");
  }

  return next(action);
};

export default toastMiddleware;