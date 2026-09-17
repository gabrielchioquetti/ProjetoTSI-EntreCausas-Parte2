const iconesCategorias = {
  Educacao: "fa-solid fa-graduation-cap",
  Solidariedade: "fa-solid fa-hand-holding-heart",
  Cultura: "fa-solid fa-people-group",
  Animais: "fa-solid fa-paw",
  MeioAmbiente: "fa-solid fa-leaf",
  Saude: "fa-solid fa-heart-pulse",
  Esporte: "fa-solid fa-futbol",
};

const nomesCategorias = {
  Educacao: "Educação",
  Solidariedade: "Solidariedade",
  Cultura: "Cultura",
  Animais: "Animais",
  MeioAmbiente: "Meio Ambiente",
  Saude: "Saúde",
  Esporte: "Esporte",
};

function OngCard({ ong }) {
  const icone =
    iconesCategorias[ong.categoriaPrincipal] || "fa-solid fa-circle-info";

  const nomeCategoria =
    nomesCategorias[ong.categoriaPrincipal] ||
    ong.categoriaPrincipal ||
    "Categoria";

  const imagemPrincipal = ong.imagens?.[0]?.src || "/img/default/ongs.png";

  const imagemAlt = ong.imagens?.[0]?.alt || `Imagem da ONG ${ong.nome}`;

  const categorias = ong.categorias || [];

  return (
    <a
      href={`/detalhes?id=${ong.id}`}
      aria-label={`Conhecer a ONG ${ong.nome}`}
      className="
        card
        group
        w-full
        overflow-hidden
        rounded-3xl
        border
        border-base-300
        bg-base-100
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
      "
    >
      {/* IMAGEM */}
      <figure className="relative h-56 overflow-hidden bg-base-200">
        <img
          src={imagemPrincipal}
          alt={imagemAlt}
          className="
            h-full
            w-full
            object-cover
            transition-transform
            duration-500
            group-hover:scale-105
          "
          onError={(event) => {
            event.currentTarget.src = "/img/default/ongs.png";
          }}
        />

        {/* Categoria principal */}
        <div
          className="
            badge
            badge-primary
            absolute
            left-4
            top-4
            gap-2
            rounded-full
            px-4
            py-3
            font-semibold
            shadow-md
          "
        >
          <i className={icone} aria-hidden="true"></i>

          {nomeCategoria}
        </div>
      </figure>

      {/* CONTEÚDO */}
      <div className="card-body gap-4 p-6">
        {/* Nome */}
        <h2 className="card-title text-2xl font-bold text-base-content">
          {ong.nome}
        </h2>

        {/* Localização */}
        {ong.localizacao && (
          <div className="flex items-center gap-2 text-sm text-base-content/60">
            <i
              className="fa-solid fa-location-dot text-primary"
              aria-hidden="true"
            ></i>

            <span>{ong.localizacao}</span>
          </div>
        )}

        {/* Descrição */}
        <p className="line-clamp-3 leading-relaxed text-base-content/70">
          {ong.descricao}
        </p>

        {/* Categorias */}
        {categorias.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {categorias.map((categoria) => (
              <div
                key={categoria}
                className="
                  badge
                  badge-outline
                  border-primary/30
                  text-primary
                "
              >
                {nomesCategorias[categoria] || categoria}
              </div>
            ))}
          </div>
        )}

        {/* Rodapé */}
        <div className="card-actions mt-2 items-center justify-between">
          <span className="font-semibold text-primary">Conhecer causa</span>

          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              bg-primary
              text-primary-content
              transition-transform
              duration-300
              group-hover:translate-x-1
            "
          >
            <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
          </div>
        </div>
      </div>
    </a>
  );
}

export default OngCard;
