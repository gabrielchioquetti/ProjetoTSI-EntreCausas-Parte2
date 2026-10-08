import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Header from "../../components/Header/Header";
import CadastroOng from "../../components/FormularioOng/CadastroOng";
import DescricaoOng from "../../components/FormularioOng/DescricaoOng";
import EnderecoOng from "../../components/FormularioOng/EnderecoOng";

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

const passosCadastro = ["Dados da ONG", "Descrição", "Endereço"];

function FormularioPostPage() {
  const navigate = useNavigate();
  const [imagemAtual, setImagemAtual] = useState(0);
  const [passoAtual, setPassoAtual] = useState(0);
  const [dadosCadastro, setDadosCadastro] = useState({});

  useEffect(() => {
    const intervalo = setInterval(() => {
      setImagemAtual((imagemAnterior) =>
        imagemAnterior === imagens.length - 1 ? 0 : imagemAnterior + 1,
      );
    }, 5000);

    return () => clearInterval(intervalo);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [passoAtual]);

  function concluirCadastro(dadosEndereco) {
    const dadosCompletos = { ...dadosCadastro, ...dadosEndereco };
    navigate("/", {
      state: {
        cadastroOngResultado: {
          tipo: "success",
          mensagem: `Cadastro de ${dadosCompletos.nome} concluído com sucesso!`,
        },
      },
    });
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
          className="relative overflow-hidden py-8 lg:py-10"
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
            <div className="mb-5 max-w-3xl">
              <div className="mb-2 flex items-center gap-3">
                <span className="h-[3px] w-10 rounded-full bg-primary"></span>

                <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
                  Cadastro de ONG
                </span>
              </div>

              <h1
                id="titulo-cadastro-ong"
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
                Faça parte de uma rede que{" "}
                <span className="text-primary">transforma.</span>
              </h1>

              <p className="mt-2.5 max-w-2xl text-lg leading-8 text-white/75">
                Cadastre os dados da sua organização para fazer parte da
                EntreCausas.
              </p>
            </div>

            <div
              aria-label={`Etapa ${passoAtual + 1} de ${passosCadastro.length}: ${passosCadastro[passoAtual]}`}
              className="mb-5"
            >
              <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                <span className="font-bold uppercase tracking-[0.14em] text-primary">
                  Etapa {passoAtual + 1}/{passosCadastro.length}
                </span>
                <span className="text-white/75">
                  {passosCadastro[passoAtual]}
                </span>
              </div>
              <div
                role="progressbar"
                aria-label="Progresso do cadastro"
                aria-valuemin={1}
                aria-valuemax={passosCadastro.length}
                aria-valuenow={passoAtual + 1}
                className="h-1.5 overflow-hidden rounded-full bg-white/25"
              >
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{
                    width: `${((passoAtual + 1) / passosCadastro.length) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            <div hidden={passoAtual !== 0}>
              <CadastroOng
                onNext={(dados) => {
                  setDadosCadastro((anteriores) => ({ ...anteriores, ...dados }));
                  setPassoAtual(1);
                }}
                onCancel={cancelarPost}
              />
            </div>
            <div hidden={passoAtual !== 1}>
              <DescricaoOng
                onNext={(dados) => {
                  setDadosCadastro((anteriores) => ({ ...anteriores, ...dados }));
                  setPassoAtual(2);
                }}
                onBack={() => setPassoAtual(0)}
              />
            </div>
            <div hidden={passoAtual !== 2}>
              <EnderecoOng
                onSubmit={concluirCadastro}
                onBack={() => setPassoAtual(1)}
              />
            </div>

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
