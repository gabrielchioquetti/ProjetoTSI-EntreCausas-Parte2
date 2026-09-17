import { useMemo, useState } from "react";
import OngCard from "./OngCard";
import listaOngs from "../../data/ongs";

function Ongs() {
  const [termoBusca, setTermoBusca] = useState("");

  const ongsFiltradas = useMemo(() => {
    const termo = termoBusca.toLowerCase().trim();

    if (!termo) {
      return listaOngs;
    }

    return listaOngs.filter((ong) => {
      const nome = ong.nome.toLowerCase();
      const descricao = ong.descricao.toLowerCase();
      const categorias = ong.categorias || [];

      const encontrouNaCategoria = categorias.some((categoria) =>
        categoria.toLowerCase().includes(termo),
      );

      return (
        nome.includes(termo) ||
        descricao.includes(termo) ||
        encontrouNaCategoria
      );
    });
  }, [termoBusca]);

  return (
    <section
      id="descobrir"
      aria-labelledby="titulo-descobrir"
      className="bg-base-100 py-16"
    >
      {/* MESMO ALINHAMENTO DO HEADER */}
      <div className="mx-auto w-full max-w-7xl px-8 md:px-14 lg:px-20">
        {/* CABEÇALHO DA SEÇÃO */}
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
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
                onChange={(event) => setTermoBusca(event.target.value)}
                placeholder="Pesquisar ONG"
                className="grow"
              />
            </label>
          </form>
        </div>

        {/* CARDS */}
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
            ongsFiltradas.map((ong) => <OngCard key={ong.id} ong={ong} />)
          ) : (
            <div className="col-span-full py-16 text-center">
              <i className="fa-solid fa-magnifying-glass mb-4 text-3xl text-primary/40"></i>

              <p className="text-lg text-base-content/60">
                Nenhuma ONG encontrada para{" "}
                <strong className="text-base-content">"{termoBusca}"</strong>.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Ongs;
