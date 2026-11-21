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
  if (funcao === "administrador" || funcao === "master") {
    return "/admin/solicitacoes";
  }

  if (funcao === "usuario" || funcao === "ong") {
    return "/";
  }

  return "/login";
}

export default function RotaProtegida({
  children,
  funcoesPermitidas,
  allowedRoles,
}) {
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

  // Mantém compatibilidade com as duas formas de definir permissões.
  const permissoes = allowedRoles || funcoesPermitidas;

  // Impede o acesso a páginas de outra função.
  if (permissoes) {
    const permissoesNormalizadas = permissoes.map(normalizarFuncao);

    if (!permissoesNormalizadas.includes(funcaoUsuario)) {
      return <Navigate to={obterDestinoPorFuncao(funcaoUsuario)} replace />;
    }
  }

  // Exibe a página quando o acesso é permitido.
  return children;
}