import { useMemo } from "react";
import { useLocation } from "react-router";

import DetalhesOng from "../../components/DetalhesOng/DetalhesOng";
import listaOngs from "../../data/ongs";
import Footer from "../../components/Footer/Footer";

import BackToTop from "../../components/Acessibilidade/BackToTop";
import VLibras from "../../components/Acessibilidade/VLibras";
import UserWay from "../../components/Acessibilidade/UserWay";
import Ongs from "../../components/Ongs/Ongs";

function Detalhes() {
  const { pathname, search } = useLocation();
  const parametros = new URLSearchParams(search);

  const id =
    pathname === "/minha-organizacao"
      ? 3
      : Number(parametros.get("id"));

  const ong = useMemo(() => {
    return listaOngs.find((item) => item.id === id);
  }, [id]);

  return (
    <div className="page-interna min-h-screen bg-base-100">
      {/* Acessibilidade */}
      <a
        href="#conteudo-principal"
        className="
          sr-only
          focus:not-sr-only
          focus:fixed
          focus:left-4
          focus:top-4
          focus:z-[9999]
          focus:rounded-md
          focus:bg-base-100
          focus:px-4
          focus:py-2
          focus:text-primary
          focus:shadow-lg
        "
      >
        Pular para o conteúdo principal
      </a>

      <div id="site">
        <div id="nav-hover-zone" aria-hidden="true"></div>

        {/* ÚNICO MAIN DA PÁGINA */}
        <main id="conteudo-principal">
          <DetalhesOng key={ong?.id ?? "not-found"} ong={ong} />
        </main>
        <Ongs />
        <Footer />

        <BackToTop />
        <VLibras />
        <UserWay />
      </div>
    </div>
  );
}

export default Detalhes;
