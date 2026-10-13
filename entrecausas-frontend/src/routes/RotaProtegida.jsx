
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";

export default function RotaProtegida({ children }) {
  const { usuario, carregando } = useAuth();
  const location = useLocation();

  // Aguarda a consulta da sessão antes de decidir o acesso.
  if (carregando) {
    return null;
  }

  // Guarda a página solicitada para retornar a ela após o login.
  if (!usuario) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // Exibe a página quando o usuário está autenticado.
  return children;
}
