import { useEffect, useMemo, useRef, useState } from "react";

import OngCard from "./OngCard";

import listaOngs from "../../data/ongs";

function OngsFeed() {
  // =========================================================
  // ESTADOS
  // =========================================================

  const [termoBusca, setTermoBusca] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
  const [quantidadeVisivel, setQuantidadeVisivel] = useState(6);

  const observadorRef = useRef(null);

  // =========================================================
  // CATEGORIAS DISPONÍVEIS
  // =========================================================

  const categoriasDisponiveis = useMemo(() => {
    return [
      ...new Set(
        listaOngs.map((ong) => ong.categoriaPrincipal).filter(Boolean),
      ),
    ];
  }, []);

  // =========================================================
  // FILTRO DE ONGS
  // =========================================================

  const ongsFiltradas = useMemo(() => {
    const termo = termoBusca.toLowerCase().trim();

    return listaOngs.filter((ong) => {
      const nome = ong.nome?.toLowerCase() || "";
      const descricao = ong.descricao?.toLowerCase() || "";
      const categoriaPrincipal = ong.categoriaPrincipal?.toLowerCase() || "";

      const categorias = ong.categorias || [];

      // =====================================================
      // PESQUISA
      // =====================================================

      const encontrouNaCategoria = categorias.some((categoria) =>
        categoria.toLowerCase().includes(termo),
      );

      const correspondePesquisa =
        !termo ||
        nome.includes(termo) ||
        descricao.includes(termo) ||
        categoriaPrincipal.includes(termo) ||
        encontrouNaCategoria;

      // =====================================================
      // FILTRO POR CATEGORIA
      // =====================================================

      const correspondeCategoria =
        !categoriaSelecionada ||
        ong.categoriaPrincipal === categoriaSelecionada;

      return correspondePesquisa && correspondeCategoria;
    });
  }, [termoBusca, categoriaSelecionada]);

  // =========================================================
  // VERIFICA SE EXISTE FILTRO ATIVO
  // =========================================================

  const filtroAtivo = termoBusca.trim() !== "" || categoriaSelecionada !== "";

  // =========================================================
  // ONGS VISÍVEIS
  // =========================================================

  const ongsVisiveis = useMemo(() => {
    if (ongsFiltradas.length === 0) {
      return [];
    }

    // =====================================================
    // SE ESTIVER PESQUISANDO OU FILTRANDO
    // MOSTRA SOMENTE OS RESULTADOS REAIS
    // =====================================================

    if (filtroAtivo) {
      return ongsFiltradas;
    }

    // =====================================================
    // SEM FILTRO, MANTÉM O FEED INFINITO
    // =====================================================

    return Array.from(
      { length: quantidadeVisivel },
      (_, index) => ongsFiltradas[index % ongsFiltradas.length],
    );
  }, [ongsFiltradas, quantidadeVisivel, filtroAtivo]);

  // =========================================================
  // SCROLL INFINITO
  // =========================================================

  useEffect(() => {
    // =====================================================
    // SE EXISTIR FILTRO OU PESQUISA,
    // NÃO ATIVA O SCROLL INFINITO
    // =====================================================

    if (filtroAtivo) {
      return;
    }

    const elemento = observadorRef.current;

    if (!elemento) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (entry.isIntersecting) {
          setQuantidadeVisivel((quantidadeAtual) => quantidadeAtual + 6);
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0,
      },
    );

    observer.observe(elemento);

    return () => {
      observer.disconnect();
    };
  }, [filtroAtivo]);

  // =========================================================
  // ALTERAR PESQUISA
  // =========================================================

  function alterarPesquisa(event) {
    setTermoBusca(event.target.value);

    // Reinicia o feed
    setQuantidadeVisivel(6);
  }

  // =========================================================
  // ALTERAR CATEGORIA
  // =========================================================

  function alterarCategoria(event) {
    setCategoriaSelecionada(event.target.value);

    // Reinicia o feed
    setQuantidadeVisivel(6);
  }

  // =========================================================
  // LIMPAR FILTROS
  // =========================================================

  function limparFiltros() {
    setTermoBusca("");
    setCategoriaSelecionada("");
    setQuantidadeVisivel(6);
  }

  return (
    <section
      id="descobrir"
      aria-labelledby="titulo-descobrir"
      className="bg-base-100 py-16"
    >
      {/* =====================================================
          CONTAINER PRINCIPAL
      ===================================================== */}

      <div className="mx-auto w-full max-w-7xl px-8 md:px-14 lg:px-20">
        {/* =====================================================
            CABEÇALHO DA SEÇÃO
        ===================================================== */}

        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          {/* TÍTULO */}

          <div>
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

          {/* =====================================================
              FILTROS
          ===================================================== */}

          <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
            {/* FILTRO POR CATEGORIA */}

            <select
              value={categoriaSelecionada}
              onChange={alterarCategoria}
              className="select select-bordered w-full rounded-full bg-base-100 sm:w-56"
              aria-label="Filtrar ONGs por categoria"
            >
              <option value="">Todas as categorias</option>

              {categoriasDisponiveis.map((categoria) => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>

            {/* PESQUISA */}

            <form
              className="w-full md:w-auto"
              onSubmit={(event) => event.preventDefault()}
            >
              <label className="sr-only" htmlFor="pesquisa-ong">
                Pesquisar ONG
              </label>

              <label className="input input-bordered flex w-full items-center gap-3 rounded-full bg-base-100 md:w-80">
                <i
                  className="fa-solid fa-magnifying-glass text-base-content/40"
                  aria-hidden="true"
                ></i>

                <input
                  id="pesquisa-ong"
                  type="search"
                  value={termoBusca}
                  onChange={alterarPesquisa}
                  placeholder="Pesquisar ONG"
                  className="grow"
                />
              </label>
            </form>
          </div>
        </div>

        {/* =====================================================
            INFORMAÇÕES DOS FILTROS
        ===================================================== */}

        {(termoBusca || categoriaSelecionada) && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            {/* QUANTIDADE DE RESULTADOS */}

            <p className="text-sm text-base-content/60">
              {ongsFiltradas.length}{" "}
              {ongsFiltradas.length === 1
                ? "ONG encontrada"
                : "ONGs encontradas"}
            </p>

            {/* BOTÃO LIMPAR FILTROS */}

            <button
              type="button"
              onClick={limparFiltros}
              className="btn btn-ghost btn-sm rounded-full text-primary"
            >
              <i className="fa-solid fa-xmark" aria-hidden="true"></i>
              Limpar filtros
            </button>
          </div>
        )}

        {/* =====================================================
            CARDS DAS ONGS
        ===================================================== */}

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
          {ongsFiltradas.length > 0 ? (
            /* =================================================
                ONGS ENCONTRADAS
            ================================================= */

            ongsVisiveis.map((ong, index) => (
              <OngCard key={`${ong.id}-${index}`} ong={ong} />
            ))
          ) : (
            /* =================================================
                ESTADO VAZIO
            ================================================= */

            <div className="col-span-full py-16 text-center">
              <i
                className="fa-solid fa-magnifying-glass mb-4 text-3xl text-primary/40"
                aria-hidden="true"
              ></i>

              <h3 className="mb-2 text-xl font-bold text-base-content">
                Nenhuma ONG encontrada
              </h3>

              <p className="mb-5 text-lg text-base-content/60">
                Não encontramos organizações com os filtros selecionados.
              </p>

              <button
                type="button"
                onClick={limparFiltros}
                className="btn btn-primary rounded-full"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </div>

        {/* =====================================================
            DETECTOR DO SCROLL INFINITO

            SÓ APARECE QUANDO NÃO EXISTE FILTRO
            OU PESQUISA ATIVA
        ===================================================== */}

        {!filtroAtivo && ongsFiltradas.length > 0 && (
          <div
            ref={observadorRef}
            className="flex justify-center py-10"
            aria-live="polite"
          >
            <span
              className="loading loading-spinner loading-md"
              aria-label="Carregando mais ONGs"
            ></span>
          </div>
        )}
      </div>
    </section>
  );
}

export default OngsFeed;
