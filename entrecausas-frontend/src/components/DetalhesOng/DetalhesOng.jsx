import { useState } from "react";

function DetalhesOng({ ong }) {
  const [imagemAtual, setImagemAtual] = useState(0);

  if (!ong) {
    return (
      <section className="bg-base-100 py-20">
        <div className="mx-auto w-full max-w-7xl px-15">
          <div className="rounded-2xl border border-base-300 bg-base-100 p-10">
            <h1 className="mb-3 text-3xl font-black">ONG não encontrada</h1>

            <p className="mb-6 text-base-content/60">
              Não foi possível encontrar a organização solicitada.
            </p>

            <a href="/" className="btn btn-primary">
              Voltar para o início
            </a>
          </div>
        </div>
      </section>
    );
  }

  const imagens = ong.imagens || [];

  const imagemAtualObj = imagens[imagemAtual] || {
    src: "/img/default/ongs.png",
    alt: `Imagem da ${ong.nome}`,
  };

  const irParaImagemAnterior = () => {
    if (imagens.length <= 1) return;

    setImagemAtual((indice) =>
      indice === 0 ? imagens.length - 1 : indice - 1,
    );
  };

  const irParaProximaImagem = () => {
    if (imagens.length <= 1) return;

    setImagemAtual((indice) =>
      indice === imagens.length - 1 ? 0 : indice + 1,
    );
  };

  const linkMapa = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    ong.localizacao,
  )}`;

  const mapaEmbed = `https://www.google.com/maps?q=${encodeURIComponent(
    ong.localizacao,
  )}&output=embed`;

  return (
    <section
      id="detalhe-ong"
      className="bg-base-100 py-10"
      aria-labelledby="titulo-ong"
    >
      {/* MESMO ALINHAMENTO DO HEADER */}
      <div className="mx-auto w-full max-w-7xl px-15">
        {/* PARTE PRINCIPAL */}
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          {/* ====================== */}
          {/* GALERIA */}
          {/* ====================== */}
          <div>
            <div className="relative h-[520px] overflow-hidden rounded-2xl bg-base-200">
              <img
                src={imagemAtualObj.src}
                alt={imagemAtualObj.alt || `Imagem da ${ong.nome}`}
                className="h-full w-full object-cover"
                onError={(event) => {
                  event.currentTarget.src = "/img/default/ongs.png";
                }}
              />

              {imagens.length > 1 && (
                <div
                  className="
      absolute
      bottom-5
      left-1/2
      z-20
      flex
      -translate-x-1/2
      items-center
      gap-3
      rounded-full
      bg-base-100/95
      px-3
      py-2
      shadow-lg
    "
                >
                  {/* Seta esquerda */}
                  <button
                    type="button"
                    onClick={irParaImagemAnterior}
                    aria-label="Imagem anterior"
                    className="btn btn-circle btn-ghost btn-sm text-primary"
                  >
                    <i className="fa-solid fa-chevron-left"></i>
                  </button>

                  {/* Bolinhas */}
                  <div className="flex items-center gap-3">
                    {imagens.map((imagem, indice) => (
                      <button
                        key={imagem.src}
                        type="button"
                        onClick={() => setImagemAtual(indice)}
                        aria-label={`Ver imagem ${indice + 1}`}
                        aria-current={
                          indice === imagemAtual ? "true" : undefined
                        }
                        className={`
            rounded-full
            transition-all
            duration-300
            ${
              indice === imagemAtual
                ? "h-3 w-3 scale-110 bg-primary"
                : "h-2.5 w-2.5 bg-primary/20 hover:bg-primary/40"
            }
          `}
                      ></button>
                    ))}
                  </div>

                  {/* Seta direita */}
                  <button
                    type="button"
                    onClick={irParaProximaImagem}
                    aria-label="Próxima imagem"
                    className="btn btn-circle btn-ghost btn-sm text-primary"
                  >
                    <i className="fa-solid fa-chevron-right"></i>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ====================== */}
          {/* INFORMAÇÕES */}
          {/* ====================== */}
          <article className="flex flex-col">
            {/* Categoria + ações */}
            <div className="mb-6 flex items-center justify-between gap-4">
              <span
                className="
                  badge
                  badge-primary
                  gap-2
                  rounded-full
                  px-4
                  py-4
                  font-semibold
                "
              >
                <i className="fa-solid fa-paw" aria-hidden="true"></i>

                {ong.categoriaPrincipal}
              </span>

              <div className="flex gap-2">
                <button
                  type="button"
                  className="btn btn-square btn-outline border-base-300"
                  aria-label="Compartilhar ONG"
                >
                  <i className="fa-solid fa-share-nodes"></i>
                </button>

                <button
                  type="button"
                  className="btn btn-outline border-base-300"
                >
                  <i className="fa-regular fa-heart"></i>
                  Salvar
                </button>
              </div>
            </div>

            {/* Nome */}
            <h1
              id="titulo-ong"
              className="
                mb-3
                text-5xl
                font-black
                tracking-tight
                text-base-content
                lg:text-6xl
              "
            >
              {ong.nome}
            </h1>

            {/* Localização */}
            <p className="mb-6 flex items-center gap-2 text-lg font-semibold text-primary">
              <i className="fa-solid fa-location-dot" aria-hidden="true"></i>

              {ong.localizacao}
            </p>

            {/* Descrição */}
            <p className="mb-6 text-lg leading-relaxed text-base-content/70">
              {ong.descricao}
            </p>

            {/* Categorias */}
            {ong.categorias?.length > 0 && (
              <div className="mb-8 flex flex-wrap gap-2">
                {ong.categorias.map((categoria) => (
                  <span
                    key={categoria}
                    className="
                      rounded-full
                      bg-base-200
                      px-4
                      py-2
                      text-sm
                      text-base-content/70
                    "
                  >
                    {categoria}
                  </span>
                ))}
              </div>
            )}

            {/* BOTÃO PRINCIPAL */}
            <a
              href="#sobre-ong"
              className="
                btn
                btn-primary
                mb-3
                h-14
                w-full
                rounded-xl
                text-base
                font-bold
              "
            >
              Conhecer a ONG
              <i
                className="fa-solid fa-arrow-right ml-auto"
                aria-hidden="true"
              ></i>
            </a>

            {/* INSTAGRAM + MAPA */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {ong.instagram && (
                <a
                  href={ong.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    btn
                    h-14
                    rounded-xl
                    border-base-300
                    bg-base-100
                  "
                >
                  <i className="fa-brands fa-instagram text-lg"></i>
                  Instagram
                  <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
                </a>
              )}

              <a
                href={linkMapa}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  btn
                  h-14
                  rounded-xl
                  border-base-300
                  bg-base-100
                "
              >
                <i className="fa-solid fa-location-dot text-primary"></i>
                Ver mapa
                <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
              </a>
            </div>

            {/* INFORMAÇÕES RÁPIDAS */}
            <div
              className="
                mt-5
                grid
                grid-cols-3
                divide-x
                divide-base-300
                rounded-2xl
                border
                border-base-300
                p-5
              "
            >
              <div className="px-3">
                <i className="fa-solid fa-people-group mb-2 text-xl text-primary"></i>

                <p className="font-bold">Comunidade</p>

                <p className="mt-1 text-xs text-base-content/50">
                  {ong.localizacao}
                </p>
              </div>

              <div className="px-3">
                <i className="fa-solid fa-heart mb-2 text-xl text-primary"></i>

                <p className="font-bold">Causa</p>

                <p className="mt-1 text-xs text-base-content/50">
                  {ong.categoriaPrincipal}
                </p>
              </div>

              <div className="px-3">
                <i className="fa-solid fa-shield mb-2 text-xl text-primary"></i>

                <p className="font-bold">Atuação</p>

                <p className="mt-1 text-xs text-base-content/50">
                  {ong.categorias?.[0] || "ONG"}
                </p>
              </div>
            </div>
          </article>
        </div>

        {/* DIVISOR */}
        <div className="divider my-12"></div>

        {/* ====================== */}
        {/* PARTE INFERIOR */}
        {/* ====================== */}

        <div id="sobre-ong" className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
          {/* SOBRE */}
          <article>
            <h2 className="mb-5 text-3xl font-black text-base-content">
              Sobre a {ong.nome}
            </h2>

            <p className="max-w-3xl text-lg leading-relaxed text-base-content/70">
              {ong.descricao}
            </p>

            {/* Outras redes */}
            <div className="mt-8 flex flex-wrap gap-3">
              {ong.facebook && (
                <a
                  href={ong.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline rounded-full"
                >
                  <i className="fa-brands fa-facebook"></i>
                  Facebook
                </a>
              )}

              {ong.site && (
                <a
                  href={ong.site}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline rounded-full"
                >
                  <i className="fa-solid fa-globe"></i>
                  Site oficial
                </a>
              )}
            </div>
          </article>

          {/* MAPA */}
          <aside
            className="
              rounded-2xl
              border
              border-base-300
              bg-base-100
              p-5
              shadow-sm
            "
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-bold">
                  <i className="fa-solid fa-location-dot text-primary"></i>
                  Localização
                </h2>

                <p className="mt-2 text-sm text-base-content/60">
                  {ong.localizacao}
                </p>
              </div>

              <a
                href={linkMapa}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-primary hover:underline"
              >
                Ver no mapa
              </a>
            </div>

            <div className="h-64 overflow-hidden rounded-xl">
              <iframe
                title={`Localização da ${ong.nome}`}
                src={mapaEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full border-0"
              ></iframe>
            </div>
          </aside>
        </div>

        {/* VOLTAR */}
        <div className="mt-12">
          <a href="/#descobrir" className="btn btn-ghost">
            <i className="fa-solid fa-arrow-left"></i>
            Voltar para ONGs
          </a>
        </div>
      </div>
    </section>
  );
}

export default DetalhesOng;
