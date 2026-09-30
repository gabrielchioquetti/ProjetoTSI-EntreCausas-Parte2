import { useEffect, useState } from "react";

import Header from "../../components/Header/Header";
import FormularioPost from "../../components/FormularioPost/FormularioPost";
import Footer from "../../components/Footer/Footer";
import OngsCarrossel from "../../components/Ongs/OngsCarrossel";
import BackToTop from "../../components/Acessibilidade/BackToTop";
import VLibras from "../../components/Acessibilidade/VLibras";
import UserWay from "../../components/Acessibilidade/UserWay";

const imagens = [
  "../../img/carrossel/instituto-nosso-lar/fotografia-Instituto-Nosso-Lar-Horizontal-Desktop.jpg",
  "../../img/carrossel/instituto-nosso-lar/fotografia-Instituto-Nosso-Lar-Vertical-Mobile.jpg",
  "../../img/carrossel/sos-animais/fotografia-SOS-Animais-Vertical-Mobile.jpg",
];

function FormularioPostPage() {
  const [imagemAtual, setImagemAtual] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setImagemAtual((imagemAnterior) =>
        imagemAnterior === imagens.length - 1 ? 0 : imagemAnterior + 1,
      );
    }, 5000);

    return () => clearInterval(intervalo);
  }, []);

  function publicarPost(dados) {
    console.log("Dados enviados:", dados);
  }

  function cancelarPost() {
    window.location.href = "/";
  }

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      {/* ACESSIBILIDADE */}
      <a
        href="#conteudo-principal"
        className="
          sr-only
          focus:not-sr-only
          focus:fixed
          focus:left-4
          focus:top-4
          focus:z-[9999]
          focus:rounded-lg
          focus:bg-base-100
          focus:px-4
          focus:py-3
          focus:text-primary
          focus:shadow-xl
        "
      >
        Pular para o conteúdo principal
      </a>

      <div id="site">
        <Header />

        <main
          id="conteudo-principal"
          className="relative overflow-hidden py-16 lg:py-20"
        >
          {/* ======================================== */}
          {/* CARROSSEL DE FUNDO */}
          {/* ======================================== */}

          <div className="absolute inset-0">
            {imagens.map((imagem, indice) => (
              <img
                key={imagem}
                src={imagem}
                alt=""
                aria-hidden="true"
                className={`
                  absolute
                  inset-0
                  h-full
                  w-full
                  object-cover
                  transition-opacity
                  duration-1000

                  ${indice === imagemAtual ? "opacity-100" : "opacity-0"}
                `}
              />
            ))}
          </div>

          {/* Overlay escuro */}
          <div className="absolute inset-0 bg-black/65"></div>

          {/* ======================================== */}
          {/* CONTEÚDO */}
          {/* ======================================== */}

          <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-10">
            {/* CABEÇALHO */}
            <div className="mb-10 max-w-3xl">
              <div className="mb-4 flex items-center gap-3">
                <span className="h-[3px] w-10 rounded-full bg-primary"></span>

                <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
                  Nova publicação
                </span>
              </div>

              <h1
                id="titulo-formulario-post"
                className="
                  text-4xl
                  font-black
                  leading-tight
                  tracking-tight
                  text-white
                  md:text-5xl
                  lg:text-6xl
                "
              >
                Compartilhe uma iniciativa que{" "}
                <span className="text-primary">transforma.</span>
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/75">
                Cadastre uma nova publicação e ajude a dar mais visibilidade ao
                trabalho da sua organização.
              </p>
            </div>

            {/* FORMULÁRIO */}
            <FormularioPost onSubmit={publicarPost} onCancel={cancelarPost} />

            {/* BOLINHAS DO CARROSSEL */}
            <div className="mt-8 flex justify-center gap-2">
              {imagens.map((imagem, indice) => (
                <button
                  key={imagem}
                  type="button"
                  onClick={() => setImagemAtual(indice)}
                  aria-label={`Exibir imagem ${indice + 1}`}
                  className={`
                    rounded-full
                    transition-all
                    duration-300

                    ${
                      indice === imagemAtual
                        ? "h-2.5 w-8 bg-primary"
                        : "h-2.5 w-2.5 bg-white/50 hover:bg-white"
                    }
                  `}
                />
              ))}
            </div>
          </div>
        </main>

        <OngsCarrossel />
        <Footer />

        <BackToTop />
        <VLibras />
        <UserWay />
      </div>
    </div>
  );
}

export default FormularioPostPage;