import { Navigate, useLocation } from "react-router";
import { useAuth } from "../contexts/AuthContext.jsx";

// Normaliza a função retornada pelo backend.
function normalizarFuncao(funcao) {
  return typeof funcao === "string"
    ? funcao
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
    : "";
}

// Define o destino conforme a função do usuário.
function obterDestinoPorFuncao(funcao) {
  if (funcao === "administrador") {
    return "/admin/solicitacoes";
  }

  if (funcao === "usuario") {
    return "/";
  }

  return "/login";
}

export default function RotaProtegida({ children, funcoesPermitidas }) {
  const { usuario, carregando } = useAuth();
  const location = useLocation();

  // Aguarda a consulta da sessão antes de decidir o acesso.
  if (carregando) {
    return null;
  }

  // Redireciona para o login quando não existe sessão.
  if (!usuario) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Identifica a função retornada pelo backend.
  const funcaoUsuario = normalizarFuncao(usuario.funcaoNome);

  // Impede o acesso a páginas de outra função.
  if (funcoesPermitidas) {
    const permissoesNormalizadas = funcoesPermitidas.map(normalizarFuncao);

    if (!permissoesNormalizadas.includes(funcaoUsuario)) {
      return <Navigate to={obterDestinoPorFuncao(funcaoUsuario)} replace />;
    }
  }

  // Exibe a página quando o acesso é permitido.
  return children;
}
