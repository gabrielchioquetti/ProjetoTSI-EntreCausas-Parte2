export default function QuemSomos() {
  return (
    <section
      id="quem-somos"
      aria-labelledby="titulo-quem-somos"
      className="bg-base-100 py-20 lg:py-28"
    >
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-[3px] w-10 rounded-full bg-primary"></span>

            <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
              Sobre o EntreCausas
            </span>

            <span className="h-[3px] w-10 rounded-full bg-primary"></span>
          </div>

          <h2
            id="titulo-quem-somos"
            className="
              mb-6
              text-4xl
              font-black
              leading-tight
              tracking-tight
              text-base-content
              md:text-5xl
              lg:text-6xl
            "
          >
            Conectamos pessoas a{" "}
            <span className="text-primary">causas que importam.</span>
          </h2>

          <p className="mx-auto max-w-2xl text-lg leading-8 text-base-content/65">
            O EntreCausas aproxima pessoas de ONGs e iniciativas sociais, dando
            mais visibilidade a projetos que transformam comunidades e tornando
            mais simples descobrir, conhecer e apoiar novas causas.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <article className="rounded-3xl border border-base-300 bg-base-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:border-primary/30 hover:shadow-xl">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-2xl text-primary">
              <i className="fa-solid fa-magnifying-glass"></i>
            </div>

            <h3 className="mb-3 text-2xl font-black text-base-content">
              Descubra ONGs
            </h3>

            <p className="leading-7 text-base-content/60">
              Encontre organizações e projetos sociais que atuam em diferentes
              causas e conheça iniciativas que fazem a diferença.
            </p>
          </article>

          <article className="rounded-3xl border border-base-300 bg-base-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:border-primary/30 hover:shadow-xl">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-2xl text-primary">
              <i className="fa-solid fa-heart"></i>
            </div>

            <h3 className="mb-3 text-2xl font-black text-base-content">
              Conheça as causas
            </h3>

            <p className="leading-7 text-base-content/60">
              Entenda o trabalho realizado por cada organização, suas histórias
              e o impacto gerado na comunidade.
            </p>
          </article>

          <article className="rounded-3xl border border-base-300 bg-base-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:border-primary/30 hover:shadow-xl">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-2xl text-primary">
              <i className="fa-solid fa-handshake-angle"></i>
            </div>

            <h3 className="mb-3 text-2xl font-black text-base-content">
              Faça parte
            </h3>

            <p className="leading-7 text-base-content/60">
              Acesse os canais das organizações e descubra como contribuir,
              participar ou ajudar a ampliar o alcance de uma causa.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
