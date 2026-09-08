import { useMemo } from "react";

import Header from "../../components/Header/Header";
import DetalhesOng from "../../components/DetalhesOng/DetalhesOng";
import listaOngs from "../../data/ongs";
import Footer from "../../components/Footer/Footer";
import BackToTop from "../../components/Acessibilidade/BackToTop";
import VLibras from "../../components/Acessibilidade/VLibras";
import UserWay from "../../components/Acessibilidade/UserWay";

function Detalhes() {
  const parametros = new URLSearchParams(window.location.search);

  const id = Number(parametros.get("id"));

  const ong = useMemo(() => {
    return listaOngs.find((item) => item.id === id);
  }, [id]);

  return (
    <>
      <body className="page-interna">
        <a href="#conteudo-principal" className="skip-link">
          Pular para o conteúdo principal
        </a>
        <div id="site">
          <Header />
          <div id="nav-hover-zone" aria-hidden="true"></div>
          <main id="conteudo-principal">
            <DetalhesOng ong={ong} />
          </main>
          <Footer />
          <BackToTop />
          <VLibras />
          <UserWay />
        </div>
      </body>
    </>
  );
}

export default Detalhes;
