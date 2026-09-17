function Footer() {
  const integrantes = [
    {
      nome: "Gabriel Chioquetti",
      linkedin:
        "https://www.linkedin.com/in/gabriel-chioquetti-5962883b4?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    },
    {
      nome: "Gabriel Leme",
      linkedin: "www.linkedin.com/in/gabriel-leme-644b4b261",
    },
    {
      nome: "Pedro BB",
      linkedin: "https://www.linkedin.com/",
    },
  ];

  return (
    <footer className="bg-base-200 text-base-content">
      {/* PARTE PRINCIPAL */}
      <div
        className="
          mx-auto
          grid
          w-full
          max-w-7xl
          gap-10
          px-6
          py-14
          md:grid-cols-2
          lg:grid-cols-4
          lg:px-10
        "
      >
        {/* MARCA */}
        <div>
          <h2 className="mb-4 text-3xl font-black text-primary">EntreCausas</h2>

          <p className="max-w-xs leading-7 text-base-content/60">
            Conectando pessoas a causas que transformam comunidades e fazem a
            diferença.
          </p>

          <p className="mt-5 flex items-center gap-2 text-sm font-semibold">
            <i
              className="fa-solid fa-location-dot text-primary"
              aria-hidden="true"
            ></i>
            Itapetininga - SP
          </p>
        </div>

        {/* NAVEGAÇÃO */}
        <nav>
          <h3 className="footer-title text-base-content">Navegação</h3>

          <div className="flex flex-col gap-3">
            <a href="/" className="link-hover link">
              Início
            </a>

            <a href="/#descobrir" className="link-hover link">
              Descobrir ONGs
            </a>

            <a href="/#impacto" className="link-hover link">
              Impacto
            </a>

            <a href="/#quem-somos" className="link-hover link">
              Quem Somos
            </a>
          </div>
        </nav>

        {/* INTEGRANTES */}
        <nav>
          <h3 className="footer-title text-base-content">Nosso grupo</h3>

          <div className="flex flex-col gap-4">
            {integrantes.map((integrante) => (
              <a
                key={integrante.nome}
                href={integrante.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  group
                  flex
                  items-center
                  gap-3
                  text-base-content/70
                  transition-colors
                  hover:text-primary
                "
              >
                <span
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    bg-primary/10
                    text-primary
                    transition
                    group-hover:bg-primary
                    group-hover:text-primary-content
                  "
                >
                  <i className="fa-brands fa-linkedin-in"></i>
                </span>

                <span className="font-medium">{integrante.nome}</span>
              </a>
            ))}
          </div>
        </nav>

        {/* INSTITUIÇÃO */}
        <div>
          <h3 className="footer-title text-base-content">Projeto acadêmico</h3>

          <p className="leading-7 text-base-content/60">
            Projeto desenvolvido no IFSP Campus Itapetininga, com foco em
            tecnologia, impacto social e visibilidade para organizações da
            sociedade.
          </p>
        </div>
      </div>

      {/* LINHA INFERIOR */}
      <div className="border-t border-base-300">
        <div
          className="
            mx-auto
            flex
            w-full
            max-w-7xl
            flex-col
            items-center
            justify-between
            gap-4
            px-6
            py-6
            text-center
            text-sm
            md:flex-row
            md:text-left
            lg:px-10
          "
        >
          <p className="text-base-content/55">
            © 2026 IFSP Campus Itapetininga • Todos os direitos reservados
          </p>

          <p className="font-medium text-base-content/70">
            Feito com ❤️ para conectar pessoas e causas.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
