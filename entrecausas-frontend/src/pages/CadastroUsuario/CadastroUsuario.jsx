import { useEffect, useState } from "react";
import CampoFormulario from "../../components/Form/CampoFormulario";
import Header from "../../components/Header/Header";
import OngsCarrosel from "../../components/Ongs/OngsCarrossel";
import Footer from "../../components/Footer/Footer";
import CampoDocumento from "../../components/Form/CampoDocumento";
import CampoTelefone from "../../components/Form/CampoTelefone";

const imagens = [
  "../../img/carrossel/instituto-nosso-lar/fotografia-Instituto-Nosso-Lar-Horizontal-Desktop.jpg",
  "../../img/carrossel/instituto-nosso-lar/fotografia-Instituto-Nosso-Lar-Vertical-Mobile.jpg",
  "../../img/carrossel/sos-animais/fotografia-SOS-Animais-Vertical-Mobile.jpg",
];

function CadastroUsuario() {
  const [imagemAtual, setImagemAtual] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setImagemAtual((imagemAnterior) =>
        imagemAnterior === imagens.length - 1 ? 0 : imagemAnterior + 1,
      );
    }, 5000);

    return () => clearInterval(intervalo);
  }, []);

  return (
    <main>
      <Header />
      <section className="relative min-h-screen overflow-hidden">
        {/* ========================= */}
        {/* CARROSSEL DE FUNDO */}
        {/* ========================= */}
        <div className="absolute inset-0">
          {imagens.map((imagem, index) => (
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
              ${index === imagemAtual ? "opacity-100" : "opacity-0"}
            `}
            />
          ))}
        </div>
        {/* ESCURECIMENTO */}
        <div className="absolute inset-0 bg-black/65"></div>
        {/* ========================= */}
        {/* CONTEÚDO */}
        {/* ========================= */}
        <div
          className="
              hero
              relative
              z-10
              min-h-screen
              px-6
            "
        >
          <div
            className="
                  hero-content
                  w-full
                  max-w-6xl
                  flex-col
                  gap-5
                  items-start
                "
          >
            {/* ========================= */}
            {/* TEXTO */}
            {/* ========================= */}

            {/* ========================= */}
            {/* CARD CADASTRO */}
            {/* ========================= */}

            <div
              className="
    hero
    relative
    z-10
    min-h-screen
    px-3
  "
            >
              <div
                className="
      hero-content
      w-full
      max-w-7xl
      flex-col
      items-center
      justify-center
      gap-5
    "
              >
                {/* ========================= */}
                {/* TEXTO */}
                {/* ========================= */}

                <div
                  className="
        w-full
        max-w-4xl
        px-6
        text-center
        md:px-10
      "
                >
                  <div className="mb-5 flex items-center justify-center gap-3">
                    <span className="h-[3px] w-10 rounded-full bg-primary"></span>

                    <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
                      Área de cadastro
                    </span>
                  </div>

                  <h1
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
                    Faça parte do{" "}
                    <span className="text-primary">EntreCausas.</span>
                  </h1>

                  <p
                    className="
                    mx-auto
                    max-w-xl
                    py-6
                    text-lg
                    leading-8
                    text-white/75
                    lg:m"
                  >
                    Crie sua conta para acessar a plataforma, conhecer
                    organizações, acompanhar conteúdos e se aproximar de causas
                    que transformam a comunidade.
                  </p>
                </div>

                {/* ========================= */}
                {/* CARD CADASTRO */}
                {/* ========================= */}

                <div
                  className="
        card
        w-full
        max-w-4xl
        rounded-3xl
        border
        border-white/20
        bg-base-100
        shadow-2x
      "
                >
                  <div className="card-body p-8 md:p-10 lg:p-12">
                    <div className="mb-6">
                      <h2 className="text-3xl font-black text-base-content">
                        Cadastrar
                      </h2>

                      <p className="mt-2 text-sm text-base-content/55">
                        Informe seus dados para continuar.
                      </p>
                    </div>

                    {/* ========================= */}
                    {/* FORMULÁRIO */}
                    {/* ========================= */}

                    <form className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      {/* NOME */}
                      <div className="md:col-span-2">
                        <CampoFormulario
                          label="Nome"
                          id="nome"
                          type="text"
                          placeholder="Maria Souza"
                          autoComplete="name"
                          required
                        />
                      </div>

                      {/* E-MAIL */}
                      <div className="md:col-span-2">
                        <CampoFormulario
                          label="E-mail"
                          id="email"
                          type="email"
                          placeholder="seuemail@email.com"
                          autoComplete="email"
                          required
                        />
                      </div>

                      {/* CPF */}
                      <CampoDocumento tipo="cpf" required />

                      {/* TELEFONE */}
                      <CampoTelefone required />

                      {/* SENHA */}
                      <CampoFormulario
                        label="Senha"
                        id="senha"
                        type="password"
                        placeholder="Digite sua senha"
                        autoComplete="new-password"
                        required
                      />

                      {/* CONFIRMAR SENHA */}
                      <CampoFormulario
                        label="Confirmar senha"
                        id="confirmarSenha"
                        type="password"
                        placeholder="Digite sua senha novamente"
                        autoComplete="new-password"
                        required
                      />

                      {/* BOTÃO */}
                      <button
                        type="submit"
                        className="
              btn
              btn-primary
              h-12
              w-full
              rounded-xl
              text-base
              font-bold
              md:col-span-2
            "
                      >
                        Cadastrar
                        <i
                          className="fa-solid fa-arrow-right ml-2"
                          aria-hidden="true"
                        ></i>
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* ========================= */}
        {/* INDICADORES DO CARROSSEL */}
        {/* ========================= */}
        <div
          className="
          absolute
          bottom-6
          left-1/2
          z-20
          flex
          -translate-x-1/2
          gap-2
        "
        >
          {imagens.map((imagem, index) => (
            <button
              key={imagem}
              type="button"
              onClick={() => setImagemAtual(index)}
              aria-label={`Exibir imagem ${index + 1}`}
              className={`
              rounded-full
              transition-all
              duration-300
              ${
                index === imagemAtual
                  ? "h-2.5 w-8 bg-primary"
                  : "h-2.5 w-2.5 bg-white/50 hover:bg-white"
              }
            `}
            />
          ))}
        </div>
      </section>
      <OngsCarrosel />
      <Footer />
    </main>
  );
}
export default CadastroUsuario;
