import { Link, NavLink } from "react-router";

function Header() {
  const links = [
    { nome: "Home", to: "/" },
    { nome: "Descobrir ONGs", to: "/feed" },
    { nome: "Impacto", to: "/impacto" },
    { nome: "Fale Conosco", to: "/fale-conosco" },
  ];

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
