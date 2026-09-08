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

  const imagemPrincipal = ong.imagens?.[0];

  const categorias = ong.categorias || [];

  return (
    <a
      className="cards"
      href={`/detalhes?id=${ong.id}`}
      aria-label={`Conhecer a ONG ${ong.nome}`}
    >
      <span className="card-badge">
        <i className={icone} aria-hidden="true"></i>
        {nomeCategoria}
      </span>

      {imagemPrincipal && (
        <img
          src={imagemPrincipal.src}
          alt={imagemPrincipal.alt || `Imagem da ${ong.nome}`}
        />
      )}

      <h3>{ong.nome}</h3>

      <p>{ong.descricao}</p>

      {categorias.length > 0 && (
        <h4>
          {categorias
            .map((categoria) => {
              return nomesCategorias[categoria] || categoria;
            })
            .join(" • ")}
        </h4>
      )}
    </a>
  );
}

export default OngCard;
