import { useEffect, useState } from "react";

function Hero() {
const [slideAtual, setSlideAtual] = useState(0);
const [pausado, setPausado] = useState(false);

const slides = [
{
imagem: "/img/hero/slide-1.png",
titulo: "Lorem ipsum dolor sit amet",
descricao:
"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
link: "#",
},
{
imagem: "/img/hero/slide-2.png",
titulo: "Ut enim ad minim veniam",
descricao:
"Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
link: "#titulo-descobrir",
},
{
imagem: "/img/hero/slide-3.png",
titulo: "Duis aute irure dolor reprehenderit",
descricao:
"Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
link: "#sobre",
},
{
imagem: "/img/hero/slide-4.png",
titulo: "Excepteur sint occaecat cupidatat",
descricao:
"Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
link: "#titulo-descobrir",
},
];

/*

Avança ou volta o slide.
O operador % faz o carrossel voltar ao primeiro
quando chega ao último e vice-versa.
*/
const mudarSlide = (novoIndice) => {
setSlideAtual(
(novoIndice + slides.length) % slides.length
);
};

/*

Carrossel automático.
Mantém os 5 segundos do JavaScript original.
*/
useEffect(() => {
if (pausado) {
return;
}
const intervalo = setInterval(() => {
  setSlideAtual((indiceAtual) => {
    return (indiceAtual + 1) % slides.length;
  });
}, 5000);

return () => clearInterval(intervalo);

}, [pausado, slides.length]);

/*

Permite usar as setas esquerda e direita do teclado
quando o carrossel estiver em foco.
*/
const handleKeyDown = (event) => {
if (event.key === "ArrowLeft") {
event.preventDefault();
mudarSlide(slideAtual - 1);
}
if (event.key === "ArrowRight") {
  event.preventDefault();
  mudarSlide(slideAtual + 1);
}

};

/*

Suporte a swipe no celular.
*/
const [inicioToque, setInicioToque] = useState(null);

const handleTouchStart = (event) => {
const toque = event.touches[0];

if (!toque) {
  return;
}

setInicioToque({
  x: toque.clientX,
  y: toque.clientY,
});

setPausado(true);

};

const handleTouchEnd = (event) => {
if (!inicioToque) {
setPausado(false);
return;
}

const toque = event.changedTouches[0];

if (!toque) {
  setInicioToque(null);
  setPausado(false);
  return;
}

const deltaX = toque.clientX - inicioToque.x;
const deltaY = toque.clientY - inicioToque.y;

const limiteSwipe = 45;

/*
 * Só considera swipe quando o movimento horizontal
 * for maior que o vertical.
 */
if (
  Math.abs(deltaX) > limiteSwipe &&
  Math.abs(deltaX) > Math.abs(deltaY)
) {
  if (deltaX < 0) {
    mudarSlide(slideAtual + 1);
  } else {
    mudarSlide(slideAtual - 1);
  }
}

setInicioToque(null);
setPausado(false);

};

return (
<section id="hero" aria-label="Destaques">
<div
className="hero-slider"
data-hero-slider
aria-roledescription="carrossel"
aria-label="Slides de destaque"
tabIndex="0"
onMouseEnter={() => setPausado(true)}
onMouseLeave={() => setPausado(false)}
onFocus={() => setPausado(true)}
onBlur={() => setPausado(false)}
onKeyDown={handleKeyDown}
onTouchStart={handleTouchStart}
onTouchEnd={handleTouchEnd}
>
{/* Região utilizada para informar leitores de tela */}
<div className="hero-live-region sr-only" aria-live="polite" aria-atomic="true" >
Slide {slideAtual + 1} de {slides.length}
</div>

    {slides.map((slide, index) => {
      const ativo = index === slideAtual;

      return (
        <div
          key={slide.imagem}
          className={`hero-slide ${ativo ? "is-active" : ""}`}
          role="group"
          aria-roledescription="slide"
          aria-label={`Slide ${index + 1} de ${slides.length}`}
          aria-hidden={!ativo}
          style={{
            backgroundImage: `url("${slide.imagem}")`,
          }}
        >
          <div className="hero-overlay"></div>

          <div className="hero-content">
            <h1 id={index === 0 ? "titulo-hero" : undefined}>
              {slide.titulo}
            </h1>

            <p className="hero-sub">
              {slide.descricao}
            </p>

            <div className="hero-actions">
              <a
                href={slide.link}
                className="btn btn--primary"
                tabIndex={ativo ? 0 : -1}
              >
                Conhecer Causa

                <i
                  className="fa-solid fa-arrow-right"
                  aria-hidden="true"
                ></i>
              </a>
            </div>
          </div>
        </div>
      );
    })}

    {/* Controles do carrossel */}
    <div
      className="hero-controls"
      role="group"
      aria-label="Controles do carrossel"
    >
      <button
        className="hero-arrow hero-arrow--prev"
        type="button"
        aria-label="Slide anterior"
        onClick={() => mudarSlide(slideAtual - 1)}
      >
        <i
          className="fa-solid fa-chevron-left"
          aria-hidden="true"
        ></i>
      </button>

      <div
        className="hero-dots"
        data-hero-dots
        role="tablist"
        aria-label="Selecionar slide"
      >
        {slides.map((slide, index) => {
          const ativo = index === slideAtual;

          return (
            <button
              key={slide.imagem}
              className={`hero-dot ${ativo ? "is-active" : ""}`}
              type="button"
              role="tab"
              aria-selected={ativo}
              aria-label={`Ver slide ${index + 1}`}
              onClick={() => mudarSlide(index)}
            ></button>
          );
        })}
      </div>

      <button
        className="hero-arrow hero-arrow--next"
        type="button"
        aria-label="Próximo slide"
        onClick={() => mudarSlide(slideAtual + 1)}
      >
        <i
          className="fa-solid fa-chevron-right"
          aria-hidden="true"
        ></i>
      </button>
    </div>
  </div>
</section>

);
}

export default Hero;