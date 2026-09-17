function Header() {
  const links = [
    { nome: "Início", href: "#inicio" },
    { nome: "Descobrir ONGs", href: "#descobrir" },
    { nome: "Impacto", href: "#impacto" },
    { nome: "Fale Conosco", href: "#contato" },
  ];

  return (
    <div className="sticky top-0 z-50 max-lg:collapse bg-base-100 shadow-sm w-full rounded-md px-6">
      <input id="navbar-1-toggle" class="peer hidden" type="checkbox" />
      <label
        for="navbar-1-toggle"
        class="fixed inset-0 hidden max-lg:peer-checked:block"
      ></label>
      <div class="collapse-title navbar">
        <div class="navbar-start">
          <a
            href="#cabecalho"
            className="
          text-2xl
          md:text-3xl
          font-extrabold
          text-primary
          tracking-tight
        "
          >
            {" "}
            EntreCausas
          </a>
        </div>
        <div class="navbar-end hidden lg:flex">
          <nav className="hidden md:flex items-center gap-10">
            {links.map((link, index) => (
              <a
                key={link.nome}
                href={link.href}
                className={`
                  relative
                  font-semibold
                  text-base-content
                  transition-colors
                  duration-200
                  hover:text-primary
                  py-2

                  ${
                    index === 0
                      ? "text-primary after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[3px] after:bg-primary after:rounded-full"
                      : ""
                  }
                `}
              >
                {link.nome}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}

export default Header;

/* 
<header id="cabecalho" role="banner">
        <a className="h2-logo" href="#cabecalho">EntreCausas</a>

        <button id="menu-toggle" type="button" aria-expanded="false" aria-controls="nav-principal" aria-label="Abrir menu de navegacao">
            <span></span>
            <span></span>
            <span></span>
        </button>

        <nav id="nav-principal" aria-label="Navegacao principal">
            <ul id="ul-cabecalho">
                <li><a className="a-cabecalho" href="#titulo-hero">Início</a></li>
                <li><a className="a-cabecalho" href="#titulo-descobrir">Descobrir ONGs</a></li>
                <li><a className="a-cabecalho" href="#titulo-impacto">Impacto</a></li>
                <li><a className="a-cabecalho" href="#titulo-fale-conosco">Fale Conosco</a></li>
            </ul>
        </nav>
    </header>

*/
