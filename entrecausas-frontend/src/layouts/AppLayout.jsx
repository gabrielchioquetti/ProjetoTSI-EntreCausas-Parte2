import { useCallback } from "react";
import { AdminSolicitacoesProvider } from "../contexts/AdminSolicitacoesProvider";
import { useAdminSolicitacoes } from "../contexts/useAdminSolicitacoes";
import { useAuth } from "../contexts/AuthContext.jsx";
import { Outlet, useNavigate } from "react-router";
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
  const { usuario, carregando, sair } = useAuth();
  const { solicitacoes } = useAdminSolicitacoes();

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

  // Reconhece somente as três funções definidas no backend.
  const userType = ["USUARIO", "ADMINISTRADOR", "MASTER"].includes(funcao)
    ? funcao
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
          isAuthenticated={Boolean(usuario)}
          userType={userType}
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
            requestHistory: "/admin/solicitacoes",
            listUsers: "/admin/usuarios",
            auditHistory: "/admin/historico",
            approvedRequests:
              totalAprovadas > 0 ? "/admin/solicitacoes/aprovadas" : null,
            rejectedRequests:
              totalReprovadas > 0 ? "/admin/solicitacoes/reprovadas" : null,
          }}
          menuRouteMessages={{
            approvedRequests: "Não há ONGs aprovadas no momento.",
            rejectedRequests: "Não há ONGs reprovadas no momento.",
          }}
          onLogout={handleLogout}
        />
      )}

      <Outlet />
    </>
  );
}

export default AppLayout;