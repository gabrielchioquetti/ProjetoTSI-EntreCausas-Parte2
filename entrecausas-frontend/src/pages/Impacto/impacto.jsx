import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import BackToTop from "../../components/Acessibilidade/BackToTop";
import VLibras from "../../components/Acessibilidade/VLibras";
import UserWay from "../../components/Acessibilidade/UserWay";

function Impacto() {
  return (
    <div className="page-impacto">
      <a href="#conteudo-principal" className="skip-link">
        Pular para o conteúdo principal
      </a>

      <div id="site">
        <Header />

        <div id="nav-hover-zone" aria-hidden="true"></div>

        <main id="conteudo-principal">
          <section
            id="hero"
            className="impacto-pagina-hero"
            aria-labelledby="titulo-impacto-pagina"
          >
            <div className="impacto-page-inner">
              <div className="impacto-page-intro">
                <p className="impacto-page-eyebrow">
                  Por que esse projeto importa?
                </p>

                <h1 id="titulo-impacto-pagina">
                  Conectar causas é fortalecer a cidade
                </h1>

                <p className="impacto-page-lead">
                  Cada ONG carrega uma causa que merece ser vista, lembrada e
                  apoiada. Ao fazer parte dessa vitrine, sua instituição amplia
                  sua presença, aproxima pessoas do seu propósito e fortalece o
                  impacto social que já realiza na cidade.
                </p>
              </div>

              <div
                className="impacto-benefits-grid"
                role="list"
                aria-label="Benefícios do projeto"
              >
                <a
                  href="#mais-visibilidade"
                  className="impacto-benefit-card impacto-benefit-card--link"
                  role="listitem"
                  aria-label="Ir para a seção Mais visibilidade"
                >
                  <div className="impacto-benefit-icon" aria-hidden="true">
                    <i className="fa-solid fa-eye"></i>
                  </div>

                  <h2>Mais visibilidade</h2>

                  <p>
                    As ONGs passam a ser encontradas com mais facilidade pela
                    população.
                  </p>
                </a>

                <a
                  href="#encontrar-causas"
                  className="impacto-benefit-card impacto-benefit-card--link"
                  role="listitem"
                  aria-label="Ir para a seção Encontrar causas"
                >
                  <div className="impacto-benefit-icon" aria-hidden="true">
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </div>

                  <h2>Encontrar causas com facilidade</h2>

                  <p>
                    Moradores podem descobrir causas sociais de forma simples,
                    organizada e acessível.
                  </p>
                </a>

                <a
                  href="#mais-voluntarios"
                  className="impacto-benefit-card impacto-benefit-card--link"
                  role="listitem"
                  aria-label="Ir para a seção Mais voluntários interessados"
                >
                  <div className="impacto-benefit-icon" aria-hidden="true">
                    <i className="fa-solid fa-hand-holding-heart"></i>
                  </div>

                  <h2>Mais voluntários interessados</h2>

                  <p>
                    Pessoas dispostas a ajudar conseguem encontrar ONGs com as
                    quais se identificam.
                  </p>
                </a>

                <a
                  href="#imagem-fortalecida"
                  className="impacto-benefit-card impacto-benefit-card--link"
                  role="listitem"
                  aria-label="Ir para a seção Imagem fortalecida"
                >
                  <div className="impacto-benefit-icon" aria-hidden="true">
                    <i className="fa-solid fa-shield-halved"></i>
                  </div>

                  <h2>Imagem mais fortalecida</h2>

                  <p>
                    Uma apresentação clara transmite mais seriedade, confiança e
                    profissionalismo.
                  </p>
                </a>

                <a
                  href="#mais-aproximação"
                  className="impacto-benefit-card impacto-benefit-card--link"
                  role="listitem"
                >
                  <div className="impacto-benefit-icon" aria-hidden="true">
                    <i className="fa-solid fa-users"></i>
                  </div>

                  <h2>Mais aproximação com a comunidade</h2>

                  <p>
                    O site aproxima instituições, moradores e apoiadores em um
                    só lugar.
                  </p>
                </a>

                <a
                  href="#apoio-empresas"
                  className="impacto-benefit-card impacto-benefit-card--link"
                  role="listitem"
                >
                  <div className="impacto-benefit-icon" aria-hidden="true">
                    <i className="fa-solid fa-handshake-angle"></i>
                  </div>

                  <h2>Apoio de empresas e parceiros</h2>

                  <p>
                    Empresas podem encontrar iniciativas locais para apoiar,
                    participar e se conectar.
                  </p>
                </a>

                <a
                  href="#informacoes-organizadas"
                  className="impacto-benefit-card impacto-benefit-card--link"
                  role="listitem"
                >
                  <div className="impacto-benefit-icon" aria-hidden="true">
                    <i className="fa-solid fa-rectangle-list"></i>
                  </div>

                  <h2>Informações organizadas</h2>

                  <p>
                    Dados importantes das ONGs ficam reunidos de forma acessível
                    e padronizada.
                  </p>
                </a>

                <a
                  href="#valorização-causas"
                  className="impacto-benefit-card impacto-benefit-card--link"
                  role="listitem"
                >
                  <div className="impacto-benefit-icon" aria-hidden="true">
                    <i className="fa-solid fa-map-location-dot"></i>
                  </div>

                  <h2>Valorização das causas locais</h2>

                  <p>
                    O projeto destaca o trabalho social da cidade e incentiva
                    maior participação.
                  </p>
                </a>
              </div>
            </div>
          </section>

          <section
            id="mais-visibilidade"
            className="impacto-detail-section"
            aria-labelledby="titulo-mais-visibilidade"
          >
            <div className="impacto-detail-inner">
              <div className="impacto-detail-spotlight">
                <div className="impacto-detail-copy">
                  <p className="impacto-detail-eyebrow">
                    <i className="fa-solid fa-eye" aria-hidden="true"></i>
                    Maior visibilidade
                  </p>

                  <h2 id="titulo-mais-visibilidade">
                    Sua ONG merece ser vista por mais pessoas
                  </h2>

                  <p className="impacto-detail-text">
                    Muitas ONGs realizam trabalhos importantes todos os dias,
                    mas acabam sendo pouco conhecidas pela população. Estar
                    presente em uma vitrine digital ajuda sua instituição a
                    ganhar mais reconhecimento, alcançar novos públicos e
                    mostrar com clareza a causa que defende.
                  </p>
                </div>

                <div className="impacto-detail-media">
                  <img
                    src="/img/impacto/mais_visibilidade/willian_2000-help-1265227.jpg"
                    alt="Voluntários reunidos em uma ação comunitária ao ar livre"
                  />
                </div>
              </div>

              <div
                className="impacto-detail-grid"
                role="list"
                aria-label="Resultados da maior visibilidade"
              >
                <article className="impacto-detail-card" role="listitem">
                  <h3>Mais pessoas conhecendo sua causa</h3>

                  <p>
                    Sua ONG passa a ter um espaço próprio para apresentar sua
                    história, missão, projetos e formas de atuação.
                  </p>
                </article>

                <article className="impacto-detail-card" role="listitem">
                  <h3>Presença digital mais organizada</h3>

                  <p>
                    As informações ficam reunidas em um ambiente acessível,
                    facilitando que moradores encontrem e entendam o trabalho da
                    instituição.
                  </p>
                </article>

                <article className="impacto-detail-card" role="listitem">
                  <h3>Reconhecimento pelo trabalho realizado</h3>

                  <p>
                    A vitrine ajuda a valorizar as ações sociais que muitas
                    vezes acontecem longe dos olhos da comunidade.
                  </p>
                </article>

                <article className="impacto-detail-card" role="listitem">
                  <h3>Mais chances de conexão</h3>

                  <p>
                    Com maior visibilidade, sua ONG pode ser descoberta por
                    voluntários, apoiadores, empresas e pessoas interessadas em
                    contribuir.
                  </p>
                </article>
              </div>
            </div>
          </section>


          <section
            id="encontrar-causas"
            className="impacto-discovery-section"
            aria-labelledby="titulo-encontrar-causas"
          >
            <div className="impacto-discovery-inner">
              <div className="impacto-discovery-media">
                <img
                  src="/img/impacto/encontrar_causas/encontrar_causas.jpg"
                  alt="Celular exibindo categorias de causas sociais em uma vitrine digital"
                />
              </div>

              <div className="impacto-discovery-copy">
                <p className="impacto-discovery-eyebrow">
                  <i
                    className="fa-solid fa-magnifying-glass"
                    aria-hidden="true"
                  ></i>
                  Encontre causas
                </p>

                <h2 id="titulo-encontrar-causas">
                  Encontre causas com facilidade
                </h2>

                <p className="impacto-discovery-text">
                  Descubra causas sociais de forma simples e encontre
                  oportunidades reais para gerar impacto na sua comunidade.
                  Conecte-se a iniciativas locais, acompanhe projetos e faça a
                  diferença onde ela mais importa.
                </p>

                <a href="/#titulo-descobrir" className="impacto-discovery-cta">
                  Explorar causas
                  <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
                </a>
              </div>
            </div>
          </section>

          {/* =====================================================
          MAIS VOLUNTÁRIOS
      ====================================================== */}

          <section
            id="mais-voluntarios"
            className="impacto-volunteer-section"
            aria-labelledby="titulo-mais-voluntarios"
          >
            <div className="impacto-volunteer-inner">
              <div className="impacto-volunteer-copy">
                <p className="impacto-volunteer-eyebrow">
                  <i
                    className="fa-solid fa-hand-holding-heart"
                    aria-hidden="true"
                  ></i>
                  Mais voluntários interessados
                </p>

                <h2 id="titulo-mais-voluntarios">
                  Mais voluntários interessados
                </h2>

                <p className="impacto-volunteer-lead">
                  Conectamos pessoas a causas que fazem a diferença. Divulgue
                  sua iniciativa e alcance voluntários engajados com sua missão.
                </p>

                <div
                  className="impacto-volunteer-points"
                  role="list"
                  aria-label="Benefícios para captar voluntários"
                >
                  <div className="impacto-volunteer-point" role="listitem">
                    <div
                      className="impacto-volunteer-point-icon"
                      aria-hidden="true"
                    >
                      <i className="fa-solid fa-bullhorn"></i>
                    </div>

                    <div>
                      <h3>Divulgue sua causa</h3>

                      <p>
                        Publique sua iniciativa e mostre para pessoas que querem
                        ajudar.
                      </p>
                    </div>
                  </div>

                  <div className="impacto-volunteer-point" role="listitem">
                    <div
                      className="impacto-volunteer-point-icon"
                      aria-hidden="true"
                    >
                      <i className="fa-solid fa-users"></i>
                    </div>

                    <div>
                      <h3>Alcance mais pessoas</h3>

                      <p>
                        Sua causa aparece para voluntários interessados na sua
                        região.
                      </p>
                    </div>
                  </div>

                  <div className="impacto-volunteer-point" role="listitem">
                    <div
                      className="impacto-volunteer-point-icon"
                      aria-hidden="true"
                    >
                      <i className="fa-solid fa-heart"></i>
                    </div>

                    <div>
                      <h3>Transforme juntos</h3>

                      <p>
                        Mais mãos, mais impacto e uma comunidade melhor para
                        todos.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="impacto-volunteer-actions">
                  <a
                    href="/#titulo-fale-conosco"
                    className="impacto-volunteer-cta"
                  >
                    Divulgar minha iniciativa
                    <i
                      className="fa-solid fa-arrow-right"
                      aria-hidden="true"
                    ></i>
                  </a>
                </div>
              </div>

              <div
                className="impacto-volunteer-grid"
                role="list"
                aria-label="Perfis de voluntários interessados"
              >
                <article className="impacto-volunteer-card" role="listitem">
                  <div
                    className="impacto-volunteer-card-icon"
                    aria-hidden="true"
                  >
                    <i className="fa-solid fa-graduation-cap"></i>
                  </div>

                  <h3>Estudantes</h3>

                  <p>
                    Buscam oportunidades para aprender, contribuir com a
                    comunidade e adquirir experiência prática.
                  </p>
                </article>

                <article className="impacto-volunteer-card" role="listitem">
                  <div
                    className="impacto-volunteer-card-icon"
                    aria-hidden="true"
                  >
                    <i className="fa-solid fa-briefcase"></i>
                  </div>

                  <h3>Trabalhos</h3>

                  <p>
                    Compartilham conhecimento e habilidades para apoiar projetos
                    e iniciativas sociais.
                  </p>
                </article>

                <article className="impacto-volunteer-card" role="listitem">
                  <div
                    className="impacto-volunteer-card-icon"
                    aria-hidden="true"
                  >
                    <i className="fa-solid fa-house"></i>
                  </div>

                  <h3>Moradores</h3>

                  <p>
                    Pessoas que desejam participar ativamente da transformação
                    da própria comunidade.
                  </p>
                </article>

                <article className="impacto-volunteer-card" role="listitem">
                  <div
                    className="impacto-volunteer-card-icon"
                    aria-hidden="true"
                  >
                    <i className="fa-solid fa-people-group"></i>
                  </div>

                  <h3>Famílias</h3>

                  <p>
                    Pais e responsáveis que procuram atividades de impacto
                    social para realizar em conjunto.
                  </p>
                </article>

                <article className="impacto-volunteer-card" role="listitem">
                  <div
                    className="impacto-volunteer-card-icon"
                    aria-hidden="true"
                  >
                    <i className="fa-solid fa-leaf"></i>
                  </div>

                  <h3>Defensores</h3>

                  <p>
                    Interessados em ações de sustentabilidade, preservação e
                    conscientização ambiental.
                  </p>
                </article>

                <article className="impacto-volunteer-card" role="listitem">
                  <div
                    className="impacto-volunteer-card-icon"
                    aria-hidden="true"
                  >
                    <i className="fa-solid fa-hand-holding-heart"></i>
                  </div>

                  <h3>Apoiadores</h3>

                  <p>
                    Voluntários engajados em educação, saúde, assistência social
                    e inclusão.
                  </p>
                </article>
              </div>
            </div>
          </section>

          {/* =====================================================
          IMAGEM FORTALECIDA
      ====================================================== */}

          <section
            id="imagem-fortalecida"
            className="impacto-image-section"
            aria-labelledby="titulo-imagem-fortalecida"
          >
            <div className="impacto-image-inner">
              <div className="impacto-image-header">
                <p className="impacto-image-eyebrow">
                  <i
                    className="fa-solid fa-shield-halved"
                    aria-hidden="true"
                  ></i>
                  Fortalecimento de imagem
                </p>

                <h2 id="titulo-imagem-fortalecida">
                  Fortaleça a imagem da sua iniciativa
                </h2>

                <p className="impacto-image-lead">
                  Apresente sua causa de forma profissional, aumente sua
                  visibilidade e construa confiança com voluntários, parceiros e
                  apoiadores.
                </p>
              </div>

              <div
                className="impacto-image-grid"
                role="list"
                aria-label="Benefícios de fortalecer a imagem da ONG"
              >
                <article className="impacto-image-card" role="listitem">
                  <div className="impacto-image-card-media">
                    <img
                      src="/img/impacto/imagem_fortalecida/confianca.png"
                      alt="Pessoas reunidas em uma ação coletiva representando confiança e parceria"
                    />
                  </div>

                  <div className="impacto-image-card-copy">
                    <div className="impacto-image-card-icon" aria-hidden="true">
                      <i className="fa-solid fa-handshake-angle"></i>
                    </div>

                    <h3>Mais confiança</h3>

                    <p>
                      Informações claras e um perfil completo aproximam
                      voluntários, parceiros e apoiadores da sua iniciativa.
                    </p>
                  </div>
                </article>

                <article className="impacto-image-card" role="listitem">
                  <div className="impacto-image-card-media">
                    <img
                      src="/img/impacto/imagem_fortalecida/reconhecimento.png"
                      alt="Imagem simbolizando reconhecimento do impacto social realizado pela ONG"
                    />
                  </div>

                  <div className="impacto-image-card-copy">
                    <div className="impacto-image-card-icon" aria-hidden="true">
                      <i className="fa-solid fa-globe"></i>
                    </div>

                    <h3>Impacto reconhecido</h3>

                    <p>
                      Mostre suas ações, compartilhe conquistas e fortaleça sua
                      presença na comunidade, gerando ainda mais oportunidades.
                    </p>
                  </div>
                </article>

                <article className="impacto-image-card" role="listitem">
                  <div className="impacto-image-card-media">
                    <img
                      src="/img/impacto/imagem_fortalecida/credibilidade.png"
                      alt="Pessoa apresentando um projeto social com postura profissional e acolhedora"
                    />
                  </div>

                  <div className="impacto-image-card-copy">
                    <div className="impacto-image-card-icon" aria-hidden="true">
                      <i className="fa-solid fa-star"></i>
                    </div>

                    <h3>Mais credibilidade</h3>

                    <p>
                      Apresente sua iniciativa de forma profissional e transmita
                      seriedade e transparência para quem conhece sua causa.
                    </p>
                  </div>
                </article>

                <article className="impacto-image-card" role="listitem">
                  <div className="impacto-image-card-media">
                    <img
                      src="/img/impacto/imagem_fortalecida/visibilidade.png"
                      alt="Tela digital exibindo uma iniciativa social para ampliar sua visibilidade"
                    />
                  </div>

                  <div className="impacto-image-card-copy">
                    <div className="impacto-image-card-icon" aria-hidden="true">
                      <i className="fa-solid fa-bullhorn"></i>
                    </div>

                    <h3>Maior visibilidade</h3>

                    <p>
                      Seja encontrado por mais pessoas interessadas no que você
                      faz e divulgue sua causa para a comunidade certa.
                    </p>
                  </div>
                </article>
              </div>
            </div>
          </section>

          {/* =====================================================
          APROXIMAÇÃO COM A COMUNIDADE
      ====================================================== */}

          <section
            id="mais-aproximação"
            className="impacto-community-section"
            aria-labelledby="titulo-mais-aproximação"
          >
            <div className="impacto-community-inner">
              <div className="impacto-community-header">
                <p className="impacto-community-eyebrow">
                  <i className="fa-solid fa-users" aria-hidden="true"></i>
                  Aproximação com a comunidade
                </p>

                <h2 id="titulo-mais-aproximação">
                  Um encontro real entre quem faz e quem vive na cidade
                </h2>

                <p className="impacto-community-lead">
                  O projeto aproxima instituições, moradores e empresas em um
                  mesmo ambiente, criando laços reais entre quem oferece apoio e
                  quem busca participar.
                </p>
              </div>

              <div
                className="impacto-community-grid"
                role="list"
                aria-label="Formas de aproximação com a comunidade"
              >
                <article className="impacto-community-card" role="listitem">
                  <div className="impacto-community-card-media">
                    <img
                      src="/img/impacto/mais_aproximação/instituicoes.png"
                      alt="Representantes de instituições sociais reunidos em encontro comunitário"
                    />
                  </div>

                  <div className="impacto-community-card-copy">
                    <div
                      className="impacto-community-card-icon"
                      aria-hidden="true"
                    >
                      <i className="fa-solid fa-building-ngo"></i>
                    </div>

                    <h3>Instituições em evidência</h3>

                    <p>
                      ONGs e projetos sociais conquistam um espaço próprio para
                      serem descobertos pela própria comunidade.
                    </p>
                  </div>
                </article>

                <article className="impacto-community-card" role="listitem">
                  <div className="impacto-community-card-media">
                    <img
                      src="/img/impacto/mais_aproximação/moradores.png"
                      alt="Moradores da cidade participando de uma atividade comunitária ao ar livre"
                    />
                  </div>

                  <div className="impacto-community-card-copy">
                    <div
                      className="impacto-community-card-icon"
                      aria-hidden="true"
                    >
                      <i className="fa-solid fa-house-chimney-user"></i>
                    </div>

                    <h3>Moradores no centro da ação</h3>

                    <p>
                      Quem mora na cidade descobre causas próximas e encontra
                      caminhos reais para se envolver.
                    </p>
                  </div>
                </article>

                <article className="impacto-community-card" role="listitem">
                  <div className="impacto-community-card-media">
                    <img
                      src="/img/impacto/mais_aproximação/apoiadores.jpg"
                      alt="Apoiadores colaborando com iniciativa social local"
                    />
                  </div>

                  <div className="impacto-community-card-copy">
                    <div
                      className="impacto-community-card-icon"
                      aria-hidden="true"
                    >
                      <i className="fa-solid fa-heart-circle-plus"></i>
                    </div>

                    <h3>Empresas e parceiros conectados</h3>

                    <p>
                      Negócios locais encontram rapidamente iniciativas
                      alinhadas aos seus valores e propósitos.
                    </p>
                  </div>
                </article>

                <article className="impacto-community-card" role="listitem">
                  <div className="impacto-community-card-media">
                    <img src="/img/impacto/mais_aproximação/rede.jpg" alt="" />
                  </div>

                  <div className="impacto-community-card-copy">
                    <div
                      className="impacto-community-card-icon"
                      aria-hidden="true"
                    >
                      <i className="fa-solid fa-network-wired"></i>
                    </div>

                    <h3>Solidariedade que se espalha</h3>

                    <p>
                      Quanto mais gente participa, mais forte fica a rede de
                      apoio que sustenta a cidade.
                    </p>
                  </div>
                </article>
              </div>
            </div>
          </section>

          {/* =====================================================
          APOIO DE EMPRESAS
      ====================================================== */}

          <section
            id="apoio-empresas"
            className="impacto-partners-section"
            aria-labelledby="titulo-apoio-empresas"
          >
            <div className="impacto-partners-inner">
              <div className="impacto-partners-copy">
                <p className="impacto-partners-eyebrow">
                  <i
                    className="fa-solid fa-handshake-angle"
                    aria-hidden="true"
                  ></i>
                  Apoio de empresas e parceiros
                </p>

                <h2 id="titulo-apoio-empresas">
                  Quando empresas olham para causas locais, a cidade ganha força
                </h2>

                <p className="impacto-partners-lead">
                  Uma vitrine onde negócios e parceiros sociais descobrem
                  iniciativas que transformam a comunidade e constroem legado.
                </p>

                <div
                  className="impacto-partners-points"
                  role="list"
                  aria-label="Benefícios para empresas parceiras"
                >
                  <div className="impacto-partners-point" role="listitem">
                    <div
                      className="impacto-partners-point-icon"
                      aria-hidden="true"
                    >
                      <i className="fa-solid fa-magnifying-glass"></i>
                    </div>

                    <div>
                      <h3>Descubra iniciativas locais</h3>

                      <p>
                        Conheça projetos sociais da cidade que dialogam com os
                        valores da sua empresa.
                      </p>
                    </div>
                  </div>

                  <div className="impacto-partners-point" role="listitem">
                    <div
                      className="impacto-partners-point-icon"
                      aria-hidden="true"
                    >
                      <i className="fa-solid fa-handshake"></i>
                    </div>

                    <div>
                      <h3>Construa parcerias significativas</h3>

                      <p>
                        Conecte-se a causas reais e estabeleça relações que
                        deixam marcas positivas.
                      </p>
                    </div>
                  </div>

                  <div className="impacto-partners-point" role="listitem">
                    <div
                      className="impacto-partners-point-icon"
                      aria-hidden="true"
                    >
                      <i className="fa-solid fa-chart-line"></i>
                    </div>

                    <div>
                      <h3>Amplie seu impacto social</h3>

                      <p>
                        Demonstre responsabilidade social na prática e contribua
                        para o desenvolvimento local.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="impacto-partners-grid"
                role="list"
                aria-label="Formas de apoio disponíveis para empresas"
              >
                <article className="impacto-partners-card" role="listitem">
                  <div
                    className="impacto-partners-card-icon"
                    aria-hidden="true"
                  >
                    <i className="fa-solid fa-coins"></i>
                  </div>

                  <h3>Patrocínio</h3>

                  <p>
                    Contribuição financeira que viabiliza projetos e gera
                    transformação real na cidade.
                  </p>
                </article>

                <article className="impacto-partners-card" role="listitem">
                  <div
                    className="impacto-partners-card-icon"
                    aria-hidden="true"
                  >
                    <i className="fa-solid fa-box-open"></i>
                  </div>

                  <h3>Doação de recursos</h3>

                  <p>
                    Materiais, equipamentos e insumos que fortalecem o dia a dia
                    das iniciativas sociais.
                  </p>
                </article>

                <article className="impacto-partners-card" role="listitem">
                  <div
                    className="impacto-partners-card-icon"
                    aria-hidden="true"
                  >
                    <i className="fa-solid fa-chalkboard-user"></i>
                  </div>

                  <h3>Capacitação profissional</h3>

                  <p>
                    Compartilhamento de conhecimento técnico para potencializar
                    as equipes das ONGs.
                  </p>
                </article>

                <article className="impacto-partners-card" role="listitem">
                  <div
                    className="impacto-partners-card-icon"
                    aria-hidden="true"
                  >
                    <i className="fa-solid fa-people-carry-box"></i>
                  </div>

                  <h3>Voluntariado corporativo</h3>

                  <p>
                    Engajamento da equipe em ações e eventos ao lado das ONGs
                    parceiras.
                  </p>
                </article>

                <article className="impacto-partners-card" role="listitem">
                  <div
                    className="impacto-partners-card-icon"
                    aria-hidden="true"
                  >
                    <i className="fa-solid fa-award"></i>
                  </div>

                  <h3>Reconhecimento social</h3>

                  <p>
                    Fortalece a imagem da empresa como agente de transformação
                    positiva na comunidade.
                  </p>
                </article>
              </div>
            </div>
          </section>

          {/* =====================================================
          INFORMAÇÕES ORGANIZADAS
      ====================================================== */}

          <section
            id="informacoes-organizadas"
            className="impacto-info-section"
            aria-labelledby="titulo-informacoes-organizadas"
          >
            <div className="impacto-info-inner">
              <div className="impacto-info-spotlight">
                <div className="impacto-info-copy">
                  <p className="impacto-info-eyebrow">
                    <i
                      className="fa-solid fa-rectangle-list"
                      aria-hidden="true"
                    ></i>
                    Informações organizadas
                  </p>

                  <h2 id="titulo-informacoes-organizadas">
                    Perfil completo: tudo que importa, sem enrolação
                  </h2>

                  <p className="impacto-info-text">
                    Cada ONG tem um espaço claro com missão, área de atuação,
                    contato e formas de contribuir. Sem informações soltas —
                    apenas o essencial para você conhecer e decidir se envolver.
                  </p>
                </div>

                <div className="impacto-info-media">
                  <img
                    src="/img/impacto/informacoes_organizadas/informacoes.png"
                    alt="Interface digital organizada com informações de uma ONG exibidas de forma clara"
                  />
                </div>
              </div>

              <div
                className="impacto-info-grid"
                role="list"
                aria-label="Tipos de informações organizadas na plataforma"
              >
                <article className="impacto-info-card" role="listitem">
                  <h3>Missão e história</h3>

                  <p>
                    A trajetória, o propósito e os valores que movem cada
                    instituição.
                  </p>
                </article>

                <article className="impacto-info-card" role="listitem">
                  <h3>Área de atuação</h3>

                  <p>
                    A causa defendida e o público atendido, de forma direta e
                    transparente.
                  </p>
                </article>

                <article className="impacto-info-card" role="listitem">
                  <h3>Canais de contato</h3>

                  <p>
                    Informações acessíveis para que qualquer pessoa possa se
                    conectar facilmente.
                  </p>
                </article>

                <article className="impacto-info-card" role="listitem">
                  <h3>Como contribuir</h3>

                  <p>
                    Orientações práticas para apoiar cada ONG — com tempo,
                    recursos ou parcerias.
                  </p>
                </article>
              </div>
            </div>
          </section>

          {/* =====================================================
          VALORIZAÇÃO DAS CAUSAS LOCAIS
      ====================================================== */}

          <section
            id="valorização-causas"
            className="impacto-local-section"
            aria-labelledby="titulo-valorização-causas"
          >
            <div className="impacto-local-inner">
              <div className="impacto-local-media">
                <img
                  src="/img/impacto/valorização/valorização.png"
                  alt="Vista da cidade com pessoas participando de ação social no espaço público"
                />
              </div>

              <div className="impacto-local-copy">
                <p className="impacto-local-eyebrow">
                  <i
                    className="fa-solid fa-map-location-dot"
                    aria-hidden="true"
                  ></i>
                  Valorização das causas locais
                </p>

                <h2 id="titulo-valorização-causas">
                  Iluminando quem transforma a cidade silenciosamente
                </h2>

                <p className="impacto-local-text">
                  Muito trabalho social acontece longe dos holofotes. Este
                  projeto existe para dar visibilidade a essas iniciativas,
                  reconhecer quem faz a diferença e inspirar novas pessoas a se
                  juntarem.
                </p>

                <a href="/#titulo-descobrir" className="impacto-local-cta">
                  Conhecer as causas locais
                  <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
                </a>
              </div>
            </div>
          </section>
        </main>

        <Footer />

        <BackToTop />

        <VLibras />

        <UserWay />
      </div>
    </div>
  );
}

export default Impacto;
