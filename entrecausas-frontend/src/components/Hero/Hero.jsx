import { useEffect, useState } from "react";
import slides from "../../data/ongs";
function Hero() {
  const [slideAtual, setSlideAtual] = useState(0);
  const [pausado, setPausado] = useState(false);

  const mudarSlide = (novoIndice) => {
    setSlideAtual((novoIndice + slides.length) % slides.length);
  };

  // Timer automático
  useEffect(() => {
    if (pausado) return;

    const timer = setInterval(() => {
      setSlideAtual((atual) => (atual + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [pausado, slides.length]);

  const slide = slides[slideAtual];

  return (
    <section
      id="hero"
      className="relative h-[95vh] w-full overflow-hidden"
      aria-label="Destaques"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
    >
      {/* IMAGEM DE FUNDO */}
      <img
        src={slide?.imagens?.[0]?.src || "/img/default/ongs.png"}
        alt=""
        className="
      absolute
      inset-0
      h-full
      w-full
      scale-105
      object-cover
    "
        onError={(event) => {
          event.currentTarget.src = "/img/default/ongs.png";
        }}
      />

      {/* Camada para melhorar a leitura */}
      <div className="absolute inset-0 bg-base-200/1"></div>

      {/* CONTEÚDO */}
      <div className="relative z-10 flex h-full w-full items-center px-8 md:px-14 lg:px-15">
        {" "}
        <div className="w-full max-w-xl rounded-3xl bg-base-200/95 p-8 shadow-xl md:p-10">
          {/* Categorias */}
          <div className="mb-6 flex flex-wrap items-center gap-2 text-sm font-bold uppercase tracking-wide text-primary">
            <span>{slide.categoriaPrincipal}</span>

            {slide.categorias?.map((categoria) => (
              <div key={categoria} className="flex items-center gap-2">
                <span>+</span>
                <span>{categoria}</span>
              </div>
            ))}
          </div>

          {/* Nome */}
          <h1 className="mb-6 text-4xl font-black leading-tight text-base-content md:text-5xl lg:text-6xl">
            {slide.nome}
          </h1>

          {/* Descrição */}
          <p className="mb-3 text-lg leading-relaxed text-base-content/70">
            {slide.descricao}
          </p>

          {/* Localização */}
          <p className="mb-8 flex items-center gap-2 text-sm text-base-content/60">
            <i
              className="fa-solid fa-location-dot text-primary"
              aria-hidden="true"
            ></i>

            {slide.localizacao}
          </p>

          {/* Botão */}
          <a
            href={`/ongs/${slide.id}`}
            className="btn btn-primary w-full max-w-sm rounded-full px-8 text-base font-bold"
          >
            Conhecer Causa
            <i
              className="fa-solid fa-arrow-right ml-auto"
              aria-hidden="true"
            ></i>
          </a>
        </div>
      </div>

      {/* CONTROLE DO CARROSSEL */}
      <div
        className="
      absolute
      bottom-8
      left-1/2
      z-20
      flex
      -translate-x-1/2
      items-center
      gap-3
      rounded-full
      bg-base-100/95
      px-4
      py-2
      shadow-xl
    "
      >
        <button
          type="button"
          className="btn btn-circle btn-ghost btn-sm text-primary"
          onClick={() => mudarSlide(slideAtual - 1)}
          aria-label="ONG anterior"
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>

        <div className="flex items-center gap-3">
          {slides.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => mudarSlide(index)}
              aria-label={`Ver ${item.nome}`}
              className={`
            h-2.5 w-2.5 rounded-full
            transition-all duration-300
            ${
              index === slideAtual
                ? "scale-110 bg-primary"
                : "bg-primary/20 hover:bg-primary/40"
            }
          `}
            ></button>
          ))}
        </div>

        <button
          type="button"
          className="btn btn-circle btn-ghost btn-sm text-primary"
          onClick={() => mudarSlide(slideAtual + 1)}
          aria-label="Próxima ONG"
        >
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </section>
  );
}

export default Hero;
