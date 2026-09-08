function Impacto() {
  return (
    <section id="impacto" aria-labelledby="titulo-impacto">
      <div className="section-inner section-inner--wide">
        <div className="impacto-shell impacto-shell--static">
          {/* Imagem */}
          <div className="impacto-visual">
            <img
              src="/img/carrossel/instituto-nosso-lar/fotografia-Instituto-Nosso-Lar-Horizontal-Desktop.jpg"
              alt="Pessoas reunidas em uma ação coletiva de apoio comunitario"
            />
          </div>

          {/* Conteúdo */}
          <div className="impacto-copy impacto-copy--static">
            <div className="impacto-header">
              <h2 id="titulo-impacto">Impacto</h2>
            </div>

            <p className="impacto-headline">
              Mais visibilidade para a sua causa.
            </p>

            <p className="impacto-text">
              Cada projeto desenvolvido fortalece comunidades, gera novas
              oportunidades e promove mudanças reais na vida de quem mais
              precisa. Através de ações sociais, apoio contínuo e iniciativas
              transformadoras, construímos caminhos mais justos, fortalecemos
              vínculos e levamos esperança para pessoas, famílias e comunidades
              inteiras. Nosso impacto vai além da ajuda imediata — ele cria
              desenvolvimento, autonomia e um futuro com mais dignidade para
              todos.
            </p>

            <a href="/impacto" className="impacto-cta">
              Conheça nosso impacto real
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Impacto;
