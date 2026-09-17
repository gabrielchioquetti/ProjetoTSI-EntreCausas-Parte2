import { useEffect, useMemo, useState } from "react";

import OngCard from "./OngCard";
import listaOngs from "../../data/ongs";

function Ongs() {
  const [indiceAtual, setIndiceAtual] = useState(0);

  const quantidadeVisivel = 3;

  // =========================================================
  // ONGS QUE APARECEM NO CARROSSEL
  // =========================================================

  const ongsVisiveis = useMemo(() => {
    if (listaOngs.length <= quantidadeVisivel) {
      return listaOngs;
    }

    return Array.from({ length: quantidadeVisivel }, (_, posicao) => {
      const indice = (indiceAtual + posicao) % listaOngs.length;

      return listaOngs[indice];
    });
  }, [indiceAtual]);

  // =========================================================
  // CARROSSEL AUTOMÁTICO
  // =========================================================

  useEffect(() => {
    if (listaOngs.length <= quantidadeVisivel) {
      return;
    }

    const intervalo = setInterval(() => {
      setIndiceAtual((indiceAnterior) =>
        indiceAnterior === listaOngs.length - 1 ? 0 : indiceAnterior + 1,
      );
    }, 5000);

    return () => clearInterval(intervalo);
  }, []);

  // =========================================================
  // ONG ANTERIOR
  // =========================================================

  function voltar() {
    setIndiceAtual((indiceAnterior) =>
      indiceAnterior === 0 ? listaOngs.length - 1 : indiceAnterior - 1,
    );
  }

  // =========================================================
  // PRÓXIMA ONG
  // =========================================================

  function avancar() {
    setIndiceAtual((indiceAnterior) =>
      indiceAnterior === listaOngs.length - 1 ? 0 : indiceAnterior + 1,
    );
  }

  return (
    <section
      id="descobrir"
      aria-labelledby="titulo-descobrir"
      className="bg-base-100 py-16"
    >
      <div className="mx-auto w-full max-w-7xl px-8 md:px-14 lg:px-20">
        {/* ================================================= */}
        {/* CABEÇALHO */}
        {/* ================================================= */}

        <div className="mb-10">
          <p className="mb-2 text-sm font-bold uppercase tracking-wider text-primary">
            Encontre uma causa
          </p>

          <h2
            id="titulo-descobrir"
            className="text-3xl font-black text-base-content md:text-4xl"
          >
            Descobrir ONGs
          </h2>
        </div>

        {/* ================================================= */}
        {/* CARROSSEL */}
        {/* ================================================= */}

        <div
          id="ongs"
          className="
            grid
            grid-cols-1
            gap-6
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >
          {ongsVisiveis.map((ong) => (
            <div key={ong.id} className="animate-[fadeIn_0.5s_ease-in-out]">
              <OngCard ong={ong} />
            </div>
          ))}
        </div>

        {/* ================================================= */}
        {/* INDICADORES */}
        {/* ================================================= */}

        {listaOngs.length > quantidadeVisivel && (
          <div className="mt-10 flex items-center justify-center gap-3">
            {/* SETA ESQUERDA */}

            <button
              type="button"
              aria-label="ONG anterior"
              onClick={voltar}
              className="
                btn
                btn-circle
                btn-ghost
                btn-sm
                text-primary
              "
            >
              <i className="fa-solid fa-chevron-left" aria-hidden="true"></i>
            </button>

            {/* BOLINHAS */}

            <div
              className="
                flex
                items-center
                gap-2
                rounded-full
                bg-base-200
                px-4
                py-3
              "
            >
              {listaOngs.map((ong, indice) => (
                <button
                  key={ong.id}
                  type="button"
                  onClick={() => setIndiceAtual(indice)}
                  aria-label={`Ir para ONG ${indice + 1}`}
                  aria-current={indice === indiceAtual ? "true" : undefined}
                  className={`
                    rounded-full
                    transition-all
                    duration-300

                    ${
                      indice === indiceAtual
                        ? "h-3 w-8 bg-primary"
                        : "h-2.5 w-2.5 bg-primary/20 hover:bg-primary/40"
                    }
                  `}
                ></button>
              ))}
            </div>

            {/* SETA DIREITA */}

            <button
              type="button"
              aria-label="Próxima ONG"
              onClick={avancar}
              className="
                btn
                btn-circle
                btn-ghost
                btn-sm
                text-primary
              "
            >
              <i className="fa-solid fa-chevron-right" aria-hidden="true"></i>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default Ongs;
