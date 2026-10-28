import { useState } from "react";
import { Link, NavLink } from "react-router";

const adminLinks = [
  {
    key: "requestHistory",
    nome: "Histórico de Solicitações",
    icon: "fa-clock-rotate-left",
  },
  {
    key: "approvedRequests",
    nome: "Solicitações Aprovadas",
    icon: "fa-circle-check",
  },
  {
    key: "rejectedRequests",
    nome: "Solicitações Reprovadas",
    icon: "fa-circle-xmark",
  },
];

const ongLinks = [
  {
    key: "editOrganization",
    nome: "Editar Organização",
    icon: "fa-pen-to-square",
  },
  {
    key: "viewOrganization",
    nome: "Visualizar Organização",
    icon: "fa-eye",
  },
  {
    key: "manageOrganizationDeletion",
    nome: "Solicitar Exclusão da Organização",
    icon: "fa-trash",
  },
];

const sharedNavigationLinks = [
  {
    key: "discoverOrganizations",
    nome: "Descobrir ONGs",
    icon: "fa-magnifying-glass",
  },
  {
    key: "impact",
    nome: "Impacto",
    icon: "fa-chart-line",
  },
  {
    key: "contact",
    nome: "Fale Conosco",
    icon: "fa-envelope",
  },
];

const profileLinks = [
  {
    key: "editUser",
    nome: "Editar Usuário",
    icon: "fa-user-pen",
  },
  {
    key: "changePassword",
    nome: "Alterar Senha",
    icon: "fa-key",
  },
];

function AuthenticatedMenuLink({
  item,
  to,
  onClick,
  disabledReason = "Rota ainda não configurada",
}) {
  const className =
    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors";

  if (!to) {
    return (
      <span
        aria-disabled="true"
        title={disabledReason}
        className={`${className} cursor-not-allowed text-base-content/40`}
      >
        <i
          className={`fa-solid ${item.icon} w-5 text-center`}
          aria-hidden="true"
        />
        {item.nome}
      </span>
    );
  }

  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `${className} ${
          isActive
            ? "bg-secondary text-secondary-content"
            : "text-base-content hover:bg-base-200 hover:text-primary"
        }`
      }
    >
      <i
        className={`fa-solid ${item.icon} w-5 text-center`}
        aria-hidden="true"
      />
      {item.nome}
    </NavLink>
  );
}

function Header({
  isAuthenticated = null,
  userType = null,
  menuRoutes = {},
  menuRouteMessages = {},
  onLogout,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = [
    { nome: "Home", to: "/" },
    { nome: "Descobrir ONGs", to: "/feed" },
    { nome: "Impacto", to: "/impacto" },
    { nome: "Fale Conosco", to: "/fale-conosco" },
  ];

  // Identifica os perfis reconhecidos pelo projeto.
  const perfilReconhecido = userType === "ADM" || userType === "USUARIO";

  // Exibe o menu correspondente ao perfil autenticado.
  const hasAuthenticatedMenu = isAuthenticated === true && perfilReconhecido;

  // Evita exibir o menu público durante uma sessão autenticada.
  const sessaoSemPerfilReconhecido =
    isAuthenticated === true && !perfilReconhecido;

  // Seleciona as opções conforme o perfil autenticado.
  const roleLinks =
    userType === "ADM" ? adminLinks : userType === "USUARIO" ? ongLinks : [];

  // Fecha o menu antes de solicitar o encerramento da sessão.
  function handleLogout() {
    setIsMenuOpen(false);
    onLogout?.();
  }

  if (hasAuthenticatedMenu || sessaoSemPerfilReconhecido) {
    return (
      <>
        <button
          type="button"
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={isMenuOpen}
          aria-controls="authenticated-sidebar"
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
          className="
            fixed
            left-4
            top-4
            z-[60]
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            bg-base-100
            text-primary
            shadow-md
            transition-colors
            hover:bg-secondary
            focus-visible:outline-2
            focus-visible:outline-offset-2
            focus-visible:outline-primary
          "
        >
          <i
            className={`fa-solid ${
              isMenuOpen ? "fa-xmark" : "fa-bars"
            } text-lg`}
            aria-hidden="true"
          />
        </button>

        <aside
          id="authenticated-sidebar"
          aria-label="Navegação da conta"
          aria-hidden={!isMenuOpen}
          inert={!isMenuOpen}
          className={`
            fixed
            inset-y-0
            left-0
            z-50
            flex
            w-72
            flex-col
            border-r
            border-base-300
            bg-base-100
            px-5
            pb-6
            pt-20
            shadow-xl
            transition-transform
            duration-200
            ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className="mb-8 text-2xl font-extrabold tracking-tight text-primary"
          >
            EntreCausas
          </Link>

          <nav className="flex-1 space-y-6 overflow-y-auto" aria-label="Menu">
            {hasAuthenticatedMenu && (
              <>
                <section>
                  <ul className="space-y-1">
                    {sharedNavigationLinks.map((item) => (
                      <li key={item.key}>
                        <AuthenticatedMenuLink
                          item={item}
                          to={menuRoutes?.[item.key]}
                          disabledReason={menuRouteMessages?.[item.key]}
                          onClick={() => setIsMenuOpen(false)}
                        />
                      </li>
                    ))}
                  </ul>
                </section>

                {roleLinks.length > 0 && (
                  <section>
                    <h2 className="mb-2 px-3 text-xs font-bold uppercase tracking-wider text-base-content/50">
                      {userType === "ADM" ? "Administração" : "Organização"}
                    </h2>

                    <ul className="space-y-1">
                      {roleLinks.map((item) => (
                        <li key={item.key}>
                          <AuthenticatedMenuLink
                            item={item}
                            to={menuRoutes?.[item.key]}
                            disabledReason={menuRouteMessages?.[item.key]}
                            onClick={() => setIsMenuOpen(false)}
                          />
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                <section>
                  <h2 className="mb-2 px-3 text-xs font-bold uppercase tracking-wider text-base-content/50">
                    Meu Perfil
                  </h2>

                  <ul className="space-y-1">
                    {profileLinks.map((item) => (
                      <li key={item.key}>
                        <AuthenticatedMenuLink
                          item={item}
                          to={menuRoutes?.[item.key]}
                          disabledReason={menuRouteMessages?.[item.key]}
                          onClick={() => setIsMenuOpen(false)}
                        />
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <ul className="space-y-1">
                    <li>
                      <button
                        type="button"
                        onClick={handleLogout}
                        disabled={!onLogout}
                        title={
                          !onLogout
                            ? "Ação de logout ainda não configurada"
                            : undefined
                        }
                        className="
                          flex
                          w-full
                          items-center
                          gap-3
                          rounded-lg
                          px-3
                          py-2.5
                          text-left
                          text-sm
                          font-semibold
                          text-base-content
                          transition-colors
                          hover:bg-base-200
                          hover:text-primary
                          disabled:cursor-not-allowed
                          disabled:text-base-content/40
                        "
                      >
                        <i
                          className="fa-solid fa-right-from-bracket w-5 text-center"
                          aria-hidden="true"
                        />
                        Sair da Conta
                      </button>
                    </li>
                  </ul>
                </section>
              </>
            )}

            {sessaoSemPerfilReconhecido && (
              <p role="status" className="px-3 text-sm text-base-content/60">
                Perfil não identificado. Verifique a função retornada pelo
                backend para exibir as opções correspondentes.
              </p>
            )}
          </nav>
        </aside>
      </>
    );
  }

  return (
    <div className="sticky top-0 z-50 w-full rounded-md bg-base-100 px-6 shadow-sm max-lg:collapse">
      <input id="navbar-1-toggle" className="peer hidden" type="checkbox" />

      <label
        htmlFor="navbar-1-toggle"
        className="fixed inset-0 hidden max-lg:peer-checked:block"
      ></label>

      <div className="collapse-title navbar">
        {/* LOGO */}
        <div className="navbar-start">
          <Link
            to="/"
            className="
              text-2xl
              font-extrabold
              tracking-tight
              text-primary
              md:text-3xl
            "
          >
            EntreCausas
          </Link>
        </div>

        {/* MENU */}
        <div className="navbar-end hidden lg:flex">
          <nav className="hidden items-center gap-10 md:flex">
            {links.map((link) => (
              <NavLink
                key={link.nome}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) => `
                  relative
                  py-2
                  font-semibold
                  transition-colors
                  duration-200
                  hover:text-primary

                  ${
                    isActive
                      ? `
                        text-primary

                        after:absolute
                        after:left-0
                        after:-bottom-1
                        after:h-[3px]
                        after:w-full
                        after:rounded-full
                        after:bg-primary
                      `
                      : "text-base-content"
                  }
                `}
              >
                {link.nome}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}

export default Header;
