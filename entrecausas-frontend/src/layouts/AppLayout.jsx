import { AdminSolicitacoesProvider } from "../contexts/AdminSolicitacoesProvider";
import { useAdminSolicitacoes } from "../contexts/useAdminSolicitacoes";
import { Outlet, useLocation } from "react-router";
import Header from "../components/Header/Header";

function AppLayout() {
  return (
    <AdminSolicitacoesProvider>
      <AppLayoutContent />
    </AdminSolicitacoesProvider>
  );
}

function AppLayoutContent() {
  const { pathname } = useLocation();
  const { solicitacoes } = useAdminSolicitacoes();
  const totalAprovadas = solicitacoes.filter(
    (solicitacao) => solicitacao.status === "aprovada",
  ).length;
  const totalReprovadas = solicitacoes.filter(
    (solicitacao) => solicitacao.status === "reprovada",
  ).length;
  const isAuthenticatedArea =
    pathname === "/" ||
    pathname === "/editar-ong" ||
    pathname === "/editar-usuario" ||
    pathname === "/alterar-senha" ||
    pathname === "/solicitacao-exclusao-ong" ||
    pathname === "/minha-organizacao" ||
    pathname.startsWith("/admin/solicitacoes");

  return (
    <>
      <Header
        isAuthenticated={isAuthenticatedArea}
        userType={isAuthenticatedArea ? "ADM" : null}
        menuRoutes={{
          editOrganization: "/editar-ong",
          editUser: "/editar-usuario",
          viewOrganization: "/minha-organizacao",
          changePassword: "/alterar-senha",
          manageOrganizationDeletion: "/solicitacao-exclusao-ong",
          discoverOrganizations: "/feed",
          impact: "/impacto",
          contact: "/fale-conosco",
          requestHistory: "/admin/solicitacoes",
          approvedRequests:
            totalAprovadas > 0 ? "/admin/solicitacoes/aprovadas" : null,
          rejectedRequests:
            totalReprovadas > 0 ? "/admin/solicitacoes/reprovadas" : null,
        }}
        menuRouteMessages={{
          approvedRequests: "Não há ONGs aprovadas no momento.",
          rejectedRequests: "Não há ONGs reprovadas no momento.",
        }}
        onLogout={() => console.log("Logout clicado")}
      />
      <Outlet />
    </>
  );
}

export default AppLayout;
