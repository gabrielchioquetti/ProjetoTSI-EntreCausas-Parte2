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
    <section id="descobrir" aria-labelledby="titulo-descobrir">
      <div className="section-inner section-inner--wide">
        <div id="div-descobrir">
          <div>
            <h2 id="titulo-descobrir">Descobrir ONGs</h2>
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            <label className="sr-only" htmlFor="pesquisa-ong">
              Pesquisar ONG
            </label>
            <input
              id="pesquisa-ong"
              type="search"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              placeholder="Pesquisar ONG"
            />
          </form>
        </div>

        <div id="ongs">
          {ongsFiltradas.length > 0 ? (
            ongsFiltradas.map((ong) => <OngCard key={ong.id} ong={ong} />)
          ) : (
            <p className="ongs-sem-resultado">
              Nenhuma ONG encontrada para"{termoBusca}".
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default Ongs;
