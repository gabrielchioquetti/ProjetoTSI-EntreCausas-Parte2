import { useEffect, useState } from "react";
import { apiFetch } from "../../services/Api";

// =========================================================
// ADAPTAÇÃO DOS DADOS DA API
// =========================================================

function adaptarOng(dados) {
  const categorias = (dados.categorias || [])
    .map((categoria) => categoria.nomeCategoria)
    .filter(Boolean);

  const descricoes = dados.descricoes || [];

  const descricaoCurta = descricoes.find(
    (descricao) => descricao.tipoDescricao === "RESUMO",
  );

  const descricaoCompleta = descricoes.find(
    (descricao) => descricao.tipoDescricao === "SOBRE",
  );

  const endereco = dados.endereco;

  const localizacao = endereco
    ? [endereco.cidade, endereco.estado].filter(Boolean).join(" - ")
    : "";

  const API_URL = (
    import.meta.env.VITE_API_URL || "http://localhost:8080"
  ).replace(/\/$/, "");

  const imagens = (dados.imagens || []).map((imagem) => ({
    src: imagem.caminho
      ? `${API_URL}${imagem.caminho}`
      : "/img/default/ongs.png",
    alt: imagem.textoAlternativo || `Imagem da ONG ${dados.nome}`,
  }));

  return {
    id: dados.idOng,
    nome: dados.nome,
    instagram: dados.instagram,
    categoriaPrincipal: categorias[0] || "",
    categorias,
    descricao: descricaoCurta?.texto || descricaoCompleta?.texto || "",
    descricaoCompleta: descricaoCompleta?.texto || "",
    localizacao,
    imagens,
  };
}

function Hero() {
  // =========================================================
  // ESTADOS
  // =========================================================

  const [slides, setSlides] = useState([]);
  const [slideAtual, setSlideAtual] = useState(0);
  const [pausado, setPausado] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  // =========================================================
  // CARREGAMENTO DAS ONGS
  // =========================================================

  useEffect(() => {
    let ativo = true;

    async function carregarOngs() {
      try {
        setCarregando(true);
        setErro("");

        const dados = await apiFetch("/api/ongs");

        if (!ativo) return;

        const ongs = Array.isArray(dados) ? dados.map(adaptarOng) : [];

        setSlides(ongs);
        setSlideAtual(0);
      } catch (error) {
        if (!ativo) return;

        setErro(error.message || "Não foi possível carregar as ONGs.");
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarOngs();

    return () => {
      ativo = false;
    };
  }, []);

  // =========================================================
  // CONTROLE MANUAL DO CARROSSEL
  // =========================================================

  const mudarSlide = (novoIndice) => {
    if (slides.length === 0) return;

    setSlideAtual((novoIndice + slides.length) % slides.length);
  };

  // Timer automático
  useEffect(() => {
    if (pausado || slides.length <= 1) return;

    const timer = setInterval(() => {
      setSlideAtual((atual) => (atual + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [pausado, slides.length]);

  const slide = slides[slideAtual];

  // =========================================================
  // ESTADO DE CARREGAMENTO, ERRO OU LISTA VAZIA
  // =========================================================

  if (carregando || erro || !slide) {
    return (
      <section
        id="hero"
        className="relative h-[95vh] w-full overflow-hidden"
        aria-label="Destaques"
      >
        {/* IMAGEM DE FUNDO */}
        <img
          src="/img/default/ongs.png"
          alt=""
          className="
            absolute
            inset-0
            h-full
            w-full
            scale-105
            object-cover
          "
        />

        {/* Camada para melhorar a leitura */}
        <div className="absolute inset-0 bg-base-200/1"></div>

        {/* CONTEÚDO */}
        <div className="relative z-10 flex h-full w-full items-center px-8 md:px-14 lg:px-15">
          <div className="w-full max-w-xl rounded-3xl bg-base-200/95 p-8 shadow-xl md:p-10">
            <p className="mb-2 text-sm font-bold uppercase tracking-wide text-primary">
              EntreCausas
            </p>

            <h1 className="mb-6 text-4xl font-black leading-tight text-base-content md:text-5xl lg:text-6xl">
              Conectando pessoas e causas
            </h1>

            {carregando ? (
              <div
                className="flex items-center gap-3 text-base-content/70"
                role="status"
              >
                <span className="loading loading-spinner loading-md text-primary"></span>
                Carregando organizações...
              </div>
            ) : (
              <p className="mb-8 text-lg leading-relaxed text-base-content/70">
                {erro
                  ? "Não foi possível carregar as organizações neste momento."
                  : "Em breve, novas organizações estarão disponíveis para você conhecer."}
              </p>
            )}

            {!carregando && (
              <a
                href="#descobrir"
                className="btn btn-primary w-full max-w-sm rounded-full px-8 text-base font-bold"
              >
                Descobrir ONGs
                <i
                  className="fa-solid fa-arrow-right ml-auto"
                  aria-hidden="true"
                ></i>
              </a>
            )}
          </div>
        </div>
      </section>
    );
  }

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
        src={slide.imagens?.[0]?.src || "/img/default/ongs.png"}
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
          event.currentTarget.onerror = null;
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

            {slide.categorias
              ?.filter((categoria) => categoria !== slide.categoriaPrincipal)
              .map((categoria) => (
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
            href={`/detalhes?id=${slide.id}`}
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
      {slides.length > 1 && (
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
      )}
    </section>
  );
}

export default Hero;