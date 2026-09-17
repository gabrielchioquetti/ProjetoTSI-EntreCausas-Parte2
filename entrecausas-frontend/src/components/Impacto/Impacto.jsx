function Impacto() {
  return (
    <section
      id="impacto"
      aria-labelledby="titulo-impacto"
      className="bg-base-100 py-16 lg:py-24"
    >
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
        <div
          className="
        hero
        min-h-[600px]
        overflow-hidden
        rounded-3xl
        bg-cover
        bg-center
        shadow-sm
      "
          style={{
            backgroundImage:
              "url('/img/carrossel/instituto-nosso-lar/fotografia-Instituto-Nosso-Lar-Horizontal-Desktop.jpg')",
          }}
        >
          {/* Escurece toda a imagem */}
          <div className="hero-overlay bg-black/55"></div>

          {/* Conteúdo */}
          <div className="hero-content w-full justify-start px-8 py-16 lg:px-16">
            <div className="max-w-2xl">
              {/* Identificação */}
              <div className="mb-5 flex items-center gap-3">
                <span className="h-[3px] w-10 rounded-full bg-primary"></span>

                <span className="text-sm font-bold uppercase tracking-[0.18em] text-white">
                  Nosso Impacto
                </span>
              </div>

              {/* Título */}
              <h2
                id="titulo-impacto"
                className="
              mb-6
              text-4xl
              font-black
              leading-tight
              tracking-tight
              text-white
              md:text-5xl
              lg:text-6xl
            "
              >
                Mais visibilidade
                <br />
                para a sua <span className="text-primary">causa.</span>
              </h2>

              {/* Texto */}
              <p
                className="
              mb-8
              max-w-xl
              text-base
              leading-8
              text-white/80
              md:text-lg
            "
              >
                Cada projeto desenvolvido fortalece comunidades, gera novas
                oportunidades e promove mudanças reais na vida de quem mais
                precisa. Através de ações sociais, apoio contínuo e iniciativas
                transformadoras, construímos caminhos mais justos e um futuro
                com mais dignidade.
              </p>

              {/* CTA */}
              <a
                href="/impacto"
                className="
              btn
              btn-primary
              h-14
              rounded-xl
              border-none
              px-7
              text-base
              font-bold
            "
              >
                Conheça nosso impacto
                <i
                  className="fa-solid fa-arrow-right ml-2"
                  aria-hidden="true"
                ></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Impacto;
