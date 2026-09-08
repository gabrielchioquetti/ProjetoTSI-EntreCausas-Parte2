import { useState } from "react";

function DetalhesOng({ ong }) {
  const [imagemAtual, setImagemAtual] = useState(0);
  const [prevOng, setPrevOng] = useState(ong);

  // Redefine a imagem selecionada para 0 quando a prop ong mudar
  if (ong !== prevOng) {
    setPrevOng(ong);
    setImagemAtual(0);
  }

  if (!ong) {
    return (
      <main id="detalhe-ong">
        <div className="detalhe-container">
          <div className="detalhe-card">
            <h1>ONG não encontrada</h1>

            <p>Não foi possível encontrar a organização solicitada.</p>

            <a href="/" className="btn btn--primary">
              Voltar para o início
            </a>
          </div>
        </div>
      </main>
    );
  }

  const imagens = ong.imagens || [];
  const imagemAtualObj = imagens[imagemAtual] || imagens[0];

  const irParaImagemAnterior = () => {
    if (imagens.length <= 1) {
      return;
    }

    setImagemAtual((indice) =>
      indice === 0 ? imagens.length - 1 : indice - 1,
    );
  };

  const irParaProximaImagem = () => {
    if (imagens.length <= 1) {
      return;
    }

    setImagemAtual((indice) =>
      indice === imagens.length - 1 ? 0 : indice + 1,
    );
  };

  return (
    <main id="detalhe-ong">
      <div className="detalhe-container">
        {/* Galeria de imagens */}
        <div className="detalhe-imagem">
          {imagemAtualObj && (
            <img
              src={imagemAtualObj.src}
              alt={imagemAtualObj.alt || `Imagem da ${ong.nome}`}
            />
          )}

          {imagens.length > 1 && (
            <>
              <button
                type="button"
                className="detalhe-arrow detalhe-arrow--prev"
                onClick={irParaImagemAnterior}
                aria-label="Imagem anterior"
              >
                <i className="fa-solid fa-chevron-left" aria-hidden="true"></i>
              </button>

              <button
                type="button"
                className="detalhe-arrow detalhe-arrow--next"
                onClick={irParaProximaImagem}
                aria-label="Próxima imagem"
              >
                <i className="fa-solid fa-chevron-right" aria-hidden="true"></i>
              </button>

              <div className="detalhe-dots" aria-label="Selecionar imagem">
                {imagens.map((imagem, indice) => (
                  <button
                    key={imagem.src}
                    type="button"
                    className={indice === imagemAtual ? "is-active" : ""}
                    onClick={() => setImagemAtual(indice)}
                    aria-label={`Ver imagem ${indice + 1}`}
                    aria-current={indice === imagemAtual ? "true" : undefined}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Informações da ONG */}
        <article className="detalhe-card">
          <span className="card-badge">{ong.categoriaPrincipal}</span>

          <h1 id="titulo-ong">{ong.nome}</h1>

          <p className="local">
            <i className="fa-solid fa-location-dot" aria-hidden="true"></i>

            {ong.localizacao}
          </p>

          <div className="descricao">
            <p>{ong.descricao}</p>
          </div>

          {/* Categorias */}
          {ong.categorias?.length > 0 && (
            <div className="detalhe-categorias">
              <h2>Áreas de atuação</h2>

              <div className="categorias-lista">
                {ong.categorias.map((categoria) => (
                  <span className="categoria-tag" key={categoria}>
                    {categoria}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Localização */}
          <div className="mapa">
            <iframe
              title={`Localização da ${ong.nome}`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                ong.localizacao,
              )}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          <a
            className="btn-mapa"
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              ong.localizacao,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa-solid fa-location-arrow" aria-hidden="true"></i>
            Ver no Google Maps
          </a>

          {/* Redes sociais */}
          <div className="social-actions" id="social-actions">
            {ong.instagram && (
              <a
                href={ong.instagram}
                className="social-btn"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Instagram da ${ong.nome}`}
              >
                <i className="fa-brands fa-instagram" aria-hidden="true"></i>
              </a>
            )}

            {ong.facebook && (
              <a
                href={ong.facebook}
                className="social-btn"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Facebook da ${ong.nome}`}
              >
                <i className="fa-brands fa-facebook" aria-hidden="true"></i>
              </a>
            )}

            {ong.site && (
              <a
                href={ong.site}
                className="social-btn"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Site da ${ong.nome}`}
              >
                <i className="fa-solid fa-globe" aria-hidden="true"></i>
              </a>
            )}
          </div>

          <a href="/" className="btn btn--secondary">
            <i className="fa-solid fa-arrow-left" aria-hidden="true"></i>
            Voltar para ONGs
          </a>
        </article>
      </div>
    </main>
  );
}

export default DetalhesOng;
