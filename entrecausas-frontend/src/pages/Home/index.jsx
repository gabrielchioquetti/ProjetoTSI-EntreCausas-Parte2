import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import Header from "../../components/Header/Header";
import Hero from "../../components/Hero/Hero";
import Ongs from "../../components/Ongs/Ongs";
import Impacto from "../../components/Impacto/Impacto";
import Footer from "../../components/Footer/Footer";
import BackToTop from "../../components/Acessibilidade/BackToTop";
import VLibras from "../../components/Acessibilidade/VLibras";
import UserWay from "../../components/Acessibilidade/UserWay";
import QuemSomos from "../../components/QuemSomos/quemSomos";

function Home() {
  const { state } = useLocation();
  const cadastroOngResultado = state?.cadastroOngResultado;
  const [resultadoCadastroAguardando, setResultadoCadastroAguardando] =
    useState(null);

  useEffect(() => {
    if (!cadastroOngResultado) {
      return undefined;
    }

    const temporizador = setTimeout(
      () => setResultadoCadastroAguardando(cadastroOngResultado),
      2000,
    );

    return () => clearTimeout(temporizador);
  }, [cadastroOngResultado]);

  return (
    <div id="site">
      <Header />
      <main>
        {cadastroOngResultado &&
          resultadoCadastroAguardando === cadastroOngResultado && (
          <div
            role="alert"
            className={`alert fixed bottom-6 right-6 z-[100] w-[calc(100%-3rem)] max-w-md shadow-lg ${
              cadastroOngResultado.tipo === "success"
                ? "alert-success"
                : "alert-error"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {cadastroOngResultado.tipo === "success" ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                />
              )}
            </svg>
            <span>{cadastroOngResultado.mensagem}</span>
          </div>
        )}
        <Hero />
        <QuemSomos />
        <Ongs />
        <Impacto />
      </main>

      <Footer />
      <BackToTop />
      <VLibras />
      <UserWay />
    </div>
  );
}

export default Home;

/*

<>
      <a href="#conteudo-principal" className="skip-link">
        Pular para o conteúdo principal
      </a>
      <div id="site">
        <Header />
        <div id="nav-hover-zone" aria-hidden="true"></div>
        <main id="conteudo-principal">
          <Hero />
          <Ongs />
          <Impacto />
        </main>
        <Footer />
        <BackToTop />
        <VLibras />
        <UserWay />
      </div>
    </>

*/
