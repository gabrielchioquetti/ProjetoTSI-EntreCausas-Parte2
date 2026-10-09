import { useEffect, useState } from "react";
import CampoFormulario from "../../components/Form/CampoFormulario";
import Header from "../../components/Header/Header";
import OngsCarrosel from "../../components/Ongs/OngsCarrossel";
import Footer from "../../components/Footer/Footer";
import { apiFetch } from "../../services/Api.js";

const imagens = [
  "../../img/carrossel/instituto-nosso-lar/fotografia-Instituto-Nosso-Lar-Horizontal-Desktop.jpg",
  "../../img/carrossel/instituto-nosso-lar/fotografia-Instituto-Nosso-Lar-Vertical-Mobile.jpg",
  "../../img/carrossel/sos-animais/fotografia-SOS-Animais-Vertical-Mobile.jpg",
];

function Login() {
  const [imagemAtual, setImagemAtual] = useState(0);

  // Estados dos campos e das mensagens do formulário.
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [carregando, setCarregando] = useState(false);

  // Controla a troca automática das imagens.
  useEffect(() => {
    const intervalo = setInterval(() => {
      setImagemAtual((imagemAnterior) =>
        imagemAnterior === imagens.length - 1 ? 0 : imagemAnterior + 1,
      );
    }, 5000);

    return () => clearInterval(intervalo);
  }, []);

  // Envia as credenciais para o backend.
  async function handleLogin(event) {
    event.preventDefault();

    setErro("");
    setSucesso("");
    setCarregando(true);

    try {
      const usuario = await apiFetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          senha,
        }),
      });

      // Confirma o login sem expor informações sensíveis.
      setSucesso(`Login realizado com sucesso. Bem-vindo, ${usuario.nome}!`);

      // Limpa a senha após o login.
      setSenha("");
    } catch (error) {
      setErro(error.message || "Não foi possível realizar o login.");
    } finally {
      setCarregando(false);
    }
  }

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
              gap-12
              lg:flex-row-reverse
            "
          >
            {/* ========================= */}
            {/* TEXTO */}
            {/* ========================= */}

            <div className="flex-1 text-center lg:text-left">
              <div className="mb-5 flex items-center justify-center gap-3 lg:justify-start">
                <span className="h-[3px] w-10 rounded-full bg-primary"></span>

                <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
                  Área restrita
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
                Bem-vindo ao <span className="text-primary">EntreCausas.</span>
              </h1>

              <p
                className="
                  mx-auto
                  max-w-xl
                  py-6
                  text-lg
                  leading-8
                  text-white/75
                  lg:mx-0
                "
              >
                Acesse sua conta para gerenciar conteúdos, acompanhar sua
                organização e ajudar a fortalecer causas que transformam a
                comunidade.
              </p>

              <div className="mt-3 flex items-start justify-center gap-3 text-left lg:justify-start">
                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-white/10
                    text-primary
                    backdrop-blur-md
                  "
                >
                  <i className="fa-solid fa-shield-halved"></i>
                </div>

                <p className="max-w-md text-sm leading-6 text-white/65">
                  Sua área de acesso é protegida e destinada à administração dos
                  conteúdos cadastrados na plataforma.
                </p>
              </div>
            </div>

            {/* ========================= */}
            {/* CARD LOGIN */}
            {/* ========================= */}

            <div
              className="
                card
                w-full
                max-w-md
                shrink-0
                rounded-3xl
                border
                border-white/20
                bg-base-100
                shadow-2xl
              "
            >
              <div className="card-body p-8 md:p-10">
                <div className="mb-4">
                  <h2 className="text-3xl font-black text-base-content">
                    Entrar
                  </h2>

                  <p className="mt-2 text-sm text-base-content/55">
                    Informe seus dados para continuar.
                  </p>
                </div>

                <form className="space-y-5" onSubmit={handleLogin}>
                  <CampoFormulario
                    label="E-mail"
                    id="email"
                    type="email"
                    placeholder="seuemail@email.com"
                    autoComplete="email"
                    value={email}
                    onChange={(evento) => setEmail(evento.target.value)}
                    required
                  />

                  <CampoFormulario
                    label="Senha"
                    id="senha"
                    type="password"
                    placeholder="Digite sua senha"
                    autoComplete="current-password"
                    value={senha}
                    onChange={(evento) => setSenha(evento.target.value)}
                    required
                  />

                  {/* Mensagens de erro e sucesso do login. */}
                  {erro && (
                    <p className="text-sm text-error" role="alert">
                      {erro}
                    </p>
                  )}

                  {sucesso && (
                    <p className="text-sm text-success" role="status">
                      {sucesso}
                    </p>
                  )}

                  <div className="flex justify-end">
                    <a
                      href="/recuperar-senha"
                      className="text-sm font-semibold text-primary hover:underline"
                    >
                      Esqueceu sua senha?
                    </a>
                  </div>

                  <button
                    type="submit"
                    disabled={carregando}
                    className="
                      btn
                      btn-primary
                      mt-2
                      h-12
                      w-full
                      rounded-xl
                      text-base
                      font-bold
                    "
                  >
                    {carregando ? "Entrando..." : "Entrar"}

                    {!carregando && (
                      <i
                        className="fa-solid fa-arrow-right ml-2"
                        aria-hidden="true"
                      ></i>
                    )}
                  </button>
                </form>
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

export default Login;
