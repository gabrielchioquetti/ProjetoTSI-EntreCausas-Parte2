import { useCallback } from "react";
import { AdminSolicitacoesProvider } from "../contexts/AdminSolicitacoesProvider";
import { useAdminSolicitacoes } from "../contexts/useAdminSolicitacoes";
import { useAuth } from "../contexts/AuthContext.jsx";
import { Outlet, useLocation, useNavigate } from "react-router";
import Header from "../components/Header/Header";

function AppLayout() {
  return (
    <AdminSolicitacoesProvider>
      <AppLayoutContent />
    </AdminSolicitacoesProvider>
  );
}

function AppLayoutContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario, carregando, sair } = useAuth();
  const { solicitacoes } = useAdminSolicitacoes();
  const isMasterPreview =
    ["/admin/usuarios", "/admin/historico"].includes(location.pathname) &&
    new URLSearchParams(location.search).get("preview") === "1";

  const totalAprovadas = solicitacoes.filter(
    (solicitacao) => solicitacao.status === "aprovada",
  ).length;

  const totalReprovadas = solicitacoes.filter(
    (solicitacao) => solicitacao.status === "reprovada",
  ).length;

  // Normaliza a função retornada pelo backend.
  const funcao =
    typeof usuario?.funcaoNome === "string"
      ? usuario.funcaoNome.trim().toUpperCase()
      : "";

  // Adapta a função do backend ao padrão utilizado pelo Header.
  const userType =
    funcao === "ADMINISTRADOR"
      ? "ADM"
      : funcao === "MASTER"
        ? "MASTER"
        : funcao === "USUARIO"
          ? "USUARIO"
          : funcao === "ONG"
            ? "ONG"
            : null;

  // Encerra a sessão e retorna à tela de login.
  const handleLogout = useCallback(async () => {
    try {
      await sair();
      navigate("/login", { replace: true });
    } catch (erro) {
      console.error("Não foi possível encerrar a sessão.", erro);
    }
  }, [sair, navigate]);

  return (
    <>
      {!carregando && (
        <Header
          isAuthenticated={Boolean(usuario) || isMasterPreview}
          userType={isMasterPreview ? "MASTER" : userType}
          menuRoutes={{
            home: "/",
            about: "/autoria",
            editOrganization: "/editar-ong",
            editUser: "/editar-usuario",
            viewOrganization: "/minha-organizacao",
            changePassword: "/alterar-senha",
            manageOrganizationDeletion: "/solicitacao-exclusao-ong",
            discoverOrganizations: "/feed",
            impact: "/impacto",
            contact: "/fale-conosco",
            requestHistory: isMasterPreview
              ? null
              : "/admin/solicitacoes",
            listUsers: isMasterPreview
              ? "/admin/usuarios?preview=1"
              : undefined,
            auditHistory: isMasterPreview
              ? "/admin/historico?preview=1"
              : "/admin/historico",
            approvedRequests:
              totalAprovadas > 0 ? "/admin/solicitacoes/aprovadas" : null,
            rejectedRequests:
              totalReprovadas > 0 ? "/admin/solicitacoes/reprovadas" : null,
          }}
          menuRouteMessages={{
            requestHistory: isMasterPreview
              ? "Disponível após autenticação administrativa"
              : undefined,
            approvedRequests: "Não há ONGs aprovadas no momento.",
            rejectedRequests: "Não há ONGs reprovadas no momento.",
          }}
          onLogout={
            isMasterPreview
              ? () => navigate("/", { replace: true })
              : handleLogout
          }
        />
      )}

      <Outlet />
    </>
  );
}

export default AppLayout;
