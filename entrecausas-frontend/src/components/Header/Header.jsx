function Header() {
  return (
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
  );
}

export default Header;