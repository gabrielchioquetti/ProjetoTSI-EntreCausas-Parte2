import Header from "../../components/Header/Header";
import Hero from "../../components/Hero/Hero";
import ImpactoSession from "../../components/Impacto/Impacto";
import Footer from "../../components/Footer/Footer";
import BackToTop from "../../components/Acessibilidade/BackToTop";
import VLibras from "../../components/Acessibilidade/VLibras";
import UserWay from "../../components/Acessibilidade/UserWay";

function Impacto() {
  const pilares = [
    {
      icone: "fa-eye",
      titulo: "Mais visibilidade",
      texto:
        "Ajudamos organizações sociais a serem encontradas por mais pessoas.",
    },
    {
      icone: "fa-magnifying-glass",
      titulo: "Causas mais acessíveis",
      texto:
        "Facilitamos a descoberta de projetos e iniciativas sociais da cidade.",
    },
    {
      icone: "fa-users",
      titulo: "Mais conexões",
      texto: "Aproximamos ONGs, moradores, voluntários, apoiadores e empresas.",
    },
    {
      icone: "fa-map-location-dot",
      titulo: "Impacto local",
      texto: "Valorizamos quem transforma a comunidade todos os dias.",
    },
  ];

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      {/* ACESSIBILIDADE */}
      <a
        href="#conteudo-principal"
        className="
          sr-only
          focus:not-sr-only
          focus:fixed
          focus:left-4
          focus:top-4
          focus:z-[9999]
          focus:rounded-lg
          focus:bg-base-100
          focus:px-4
          focus:py-3
          focus:text-primary
          focus:shadow-xl
        "
      >
        Pular para o conteúdo principal
      </a>

      <Header />

      <main id="conteudo-principal">
        <ImpactoSession />
        {/* ===================================================== */}
        {/* PRINCIPAIS BENEFÍCIOS */}
        {/* ===================================================== */}

        <section
          id="beneficios"
          aria-labelledby="titulo-beneficios"
          className="bg-base-100 py-20 lg:py-28"
        >
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
            <div className="mx-auto mb-14 max-w-3xl text-center">
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-primary">
                Por que esse projeto importa?
              </p>

              <h2
                id="titulo-beneficios"
                className="
                  text-4xl
                  font-black
                  leading-tight
                  tracking-tight
                  md:text-5xl
                "
              >
                Impacto começa quando{" "}
                <span className="text-primary">pessoas se conectam.</span>
              </h2>

              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-base-content/60">
                O EntreCausas torna iniciativas sociais mais visíveis,
                acessíveis e próximas de quem deseja contribuir.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {pilares.map((pilar) => (
                <article
                  key={pilar.titulo}
                  className="
                    rounded-3xl
                    border
                    border-base-300
                    bg-base-100
                    p-7
                    transition-all
                    duration-300
                    hover:-translate-y-2
                    hover:border-primary/30
                    hover:shadow-xl
                  "
                >
                  <div
                    className="
                      mb-6
                      flex
                      h-14
                      w-14
                      items-center
                      justify-center
                      rounded-2xl
                      bg-primary/10
                      text-xl
                      text-primary
                    "
                  >
                    <i className={`fa-solid ${pilar.icone}`}></i>
                  </div>

                  <h3 className="mb-3 text-xl font-black">{pilar.titulo}</h3>

                  <p className="leading-7 text-base-content/60">
                    {pilar.texto}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ===================================================== */}
        {/* MAIS VISIBILIDADE */}
        {/* ===================================================== */}

        <section
          id="mais-visibilidade"
          aria-labelledby="titulo-visibilidade"
          className="bg-base-200/60 py-20 lg:py-28"
        >
          <div
            className="
              mx-auto
              grid
              w-full
              max-w-7xl
              items-center
              gap-12
              px-6
              lg:grid-cols-2
              lg:px-10
            "
          >
            {/* Imagem */}
            <div className="overflow-hidden rounded-[2rem] shadow-lg">
              <img
                src="/img/impacto/mais_visibilidade/willian_2000-help-1265227.jpg"
                alt="Voluntários reunidos em uma ação comunitária"
                className="h-[520px] w-full object-cover"
              />
            </div>

            {/* Conteúdo */}
            <div>
              <div className="mb-5 flex items-center gap-3">
                <span className="h-[3px] w-10 rounded-full bg-primary"></span>

                <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
                  Mais visibilidade
                </span>
              </div>

              <h2
                id="titulo-visibilidade"
                className="
                  mb-6
                  text-4xl
                  font-black
                  leading-tight
                  tracking-tight
                  md:text-5xl
                "
              >
                Sua ONG merece ser vista por{" "}
                <span className="text-primary">mais pessoas.</span>
              </h2>

              <p className="mb-8 text-lg leading-8 text-base-content/65">
                Muitas organizações realizam trabalhos importantes todos os
                dias, mas ainda são pouco conhecidas pela população. O
                EntreCausas cria um espaço organizado para apresentar essas
                iniciativas e ampliar seu alcance.
              </p>

              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <i className="fa-solid fa-circle-check mt-1 text-primary"></i>

                  <div>
                    <h3 className="font-bold">
                      Mais pessoas conhecendo sua causa
                    </h3>

                    <p className="mt-1 text-base-content/60">
                      Sua iniciativa passa a contar com um espaço próprio para
                      apresentar seu trabalho.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <i className="fa-solid fa-circle-check mt-1 text-primary"></i>

                  <div>
                    <h3 className="font-bold">Presença digital organizada</h3>

                    <p className="mt-1 text-base-content/60">
                      Informações importantes ficam reunidas e fáceis de
                      encontrar.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <i className="fa-solid fa-circle-check mt-1 text-primary"></i>

                  <div>
                    <h3 className="font-bold">Novas oportunidades</h3>

                    <p className="mt-1 text-base-content/60">
                      Voluntários, empresas e apoiadores podem descobrir sua
                      organização.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================== */}
        {/* ENCONTRAR CAUSAS */}
        {/* ===================================================== */}

        <section
          id="encontrar-causas"
          aria-labelledby="titulo-encontrar"
          className="bg-base-100 py-20 lg:py-28"
        >
          <div
            className="
              mx-auto
              grid
              w-full
              max-w-7xl
              items-center
              gap-12
              px-6
              lg:grid-cols-2
              lg:px-10
            "
          >
            {/* Conteúdo */}
            <div className="order-2 lg:order-1">
              <div className="mb-5 flex items-center gap-3">
                <span className="h-[3px] w-10 rounded-full bg-primary"></span>

                <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
                  Descobrir causas
                </span>
              </div>

              <h2
                id="titulo-encontrar"
                className="
                  mb-6
                  text-4xl
                  font-black
                  leading-tight
                  tracking-tight
                  md:text-5xl
                "
              >
                Encontrar uma causa não deveria ser{" "}
                <span className="text-primary">complicado.</span>
              </h2>

              <p className="mb-8 max-w-xl text-lg leading-8 text-base-content/65">
                Reunimos iniciativas sociais em um ambiente simples e organizado
                para que moradores encontrem projetos, conheçam suas histórias e
                descubram maneiras reais de participar.
              </p>

              <a
                href="/#titulo-descobrir"
                className="btn btn-primary h-14 rounded-xl px-7 font-bold"
              >
                Explorar causas
                <i
                  className="fa-solid fa-arrow-right ml-2"
                  aria-hidden="true"
                ></i>
              </a>
            </div>

            {/* Imagem */}
            <div className="order-1 overflow-hidden rounded-[2rem] shadow-lg lg:order-2">
              <img
                src="/img/impacto/encontrar_causas/encontrar_causas.jpg"
                alt="Pessoa utilizando uma plataforma para encontrar causas sociais"
                className="h-[520px] w-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* ===================================================== */}
        {/* COMUNIDADE */}
        {/* ===================================================== */}

        <section
          id="comunidade"
          aria-labelledby="titulo-comunidade"
          className="bg-base-200/60 py-20 lg:py-28"
        >
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
            <div className="mx-auto mb-14 max-w-3xl text-center">
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-primary">
                Uma rede que cresce junta
              </p>

              <h2
                id="titulo-comunidade"
                className="
                  text-4xl
                  font-black
                  leading-tight
                  tracking-tight
                  md:text-5xl
                "
              >
                Aproximamos quem faz de quem{" "}
                <span className="text-primary">quer fazer parte.</span>
              </h2>

              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-base-content/60">
                Organizações, moradores, voluntários e parceiros passam a fazer
                parte de uma mesma rede de transformação.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {/* ONGS */}
              <article className="rounded-3xl border border-base-300 bg-base-100 p-8">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-2xl text-primary">
                  <i className="fa-solid fa-building-ngo"></i>
                </div>

                <h3 className="mb-3 text-2xl font-black">Organizações</h3>

                <p className="leading-7 text-base-content/60">
                  ONGs ganham um espaço para apresentar suas causas, projetos e
                  formas de atuação.
                </p>
              </article>

              {/* PESSOAS */}
              <article className="rounded-3xl border border-base-300 bg-base-100 p-8">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-2xl text-primary">
                  <i className="fa-solid fa-users"></i>
                </div>

                <h3 className="mb-3 text-2xl font-black">Pessoas</h3>

                <p className="leading-7 text-base-content/60">
                  Moradores e voluntários encontram iniciativas com as quais se
                  identificam e podem participar.
                </p>
              </article>

              {/* EMPRESAS */}
              <article className="rounded-3xl border border-base-300 bg-base-100 p-8">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-2xl text-primary">
                  <i className="fa-solid fa-handshake-angle"></i>
                </div>

                <h3 className="mb-3 text-2xl font-black">Empresas</h3>

                <p className="leading-7 text-base-content/60">
                  Empresas e parceiros encontram projetos locais para apoiar e
                  construir novas parcerias.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* ===================================================== */}
        {/* EMPRESAS E PARCEIROS */}
        {/* ===================================================== */}

        <section
          id="parceiros"
          aria-labelledby="titulo-parceiros"
          className="bg-base-100 py-20 lg:py-28"
        >
          <div
            className="
              mx-auto
              grid
              w-full
              max-w-7xl
              items-center
              gap-14
              px-6
              lg:grid-cols-[0.9fr_1.1fr]
              lg:px-10
            "
          >
            <div>
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-primary">
                Empresas e parceiros
              </p>

              <h2
                id="titulo-parceiros"
                className="
                  mb-6
                  text-4xl
                  font-black
                  leading-tight
                  tracking-tight
                  md:text-5xl
                "
              >
                Quando empresas apoiam causas locais,{" "}
                <span className="text-primary">toda a cidade ganha.</span>
              </h2>

              <p className="text-lg leading-8 text-base-content/65">
                Negócios e parceiros podem encontrar iniciativas alinhadas aos
                seus valores e contribuir de diferentes maneiras para fortalecer
                projetos sociais.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <article className="rounded-2xl border border-base-300 p-6">
                <i className="fa-solid fa-coins mb-5 text-2xl text-primary"></i>

                <h3 className="mb-2 text-xl font-black">Patrocínio</h3>

                <p className="text-base-content/60">
                  Apoio financeiro para viabilizar ações e projetos.
                </p>
              </article>

              <article className="rounded-2xl border border-base-300 p-6">
                <i className="fa-solid fa-box-open mb-5 text-2xl text-primary"></i>

                <h3 className="mb-2 text-xl font-black">Recursos</h3>

                <p className="text-base-content/60">
                  Materiais e equipamentos para apoiar as organizações.
                </p>
              </article>

              <article className="rounded-2xl border border-base-300 p-6">
                <i className="fa-solid fa-chalkboard-user mb-5 text-2xl text-primary"></i>

                <h3 className="mb-2 text-xl font-black">Conhecimento</h3>

                <p className="text-base-content/60">
                  Capacitação e compartilhamento de experiência profissional.
                </p>
              </article>

              <article className="rounded-2xl border border-base-300 p-6">
                <i className="fa-solid fa-people-carry-box mb-5 text-2xl text-primary"></i>

                <h3 className="mb-2 text-xl font-black">Voluntariado</h3>

                <p className="text-base-content/60">
                  Equipes participando diretamente de ações sociais.
                </p>
              </article>
            </div>
          </div>
        </section>

        <Hero />
      </main>

      <Footer />

      <BackToTop />
      <VLibras />
      <UserWay />
    </div>
  );
}

export default Impacto;
