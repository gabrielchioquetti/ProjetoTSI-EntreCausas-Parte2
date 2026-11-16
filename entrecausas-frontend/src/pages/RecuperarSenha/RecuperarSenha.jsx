import { useEffect, useState } from "react";
import { Link } from "react-router";
import CampoFormulario from "../../components/Form/CampoFormulario.jsx";
import OngsCarrossel from "../../components/Ongs/OngsCarrossel";
import Footer from "../../components/Footer/Footer";

const imagens = [
  "../../img/carrossel/instituto-nosso-lar/fotografia-Instituto-Nosso-Lar-Horizontal-Desktop.jpg",
  "../../img/carrossel/instituto-nosso-lar/fotografia-Instituto-Nosso-Lar-Vertical-Mobile.jpg",
  "../../img/carrossel/sos-animais/fotografia-SOS-Animais-Vertical-Mobile.jpg",
];

const mensagemIntegracaoPendente =
  "A recuperação de senha ainda não está disponível: o backend não possui os serviços necessários.";

function RecuperarSenha() {
  const [imagemAtual, setImagemAtual] = useState(0);
  const etapa = 1;
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [erroConfirmacao, setErroConfirmacao] = useState("");

  useEffect(() => {
    const intervalo = setInterval(() => {
      setImagemAtual((anterior) =>
        anterior === imagens.length - 1 ? 0 : anterior + 1,
      );
    }, 5000);

    return () => clearInterval(intervalo);
  }, []);

  function solicitarCodigo(event) {
    event.preventDefault();
    setErro(mensagemIntegracaoPendente);
  }

  function validarCodigo(event) {
    event.preventDefault();
    setErro(mensagemIntegracaoPendente);
  }

  function redefinirSenha(event) {
    event.preventDefault();
    setErro("");
    setErroConfirmacao("");

    if (novaSenha.length < 8 || novaSenha.length > 50) {
      setErro("A senha deve conter entre 8 e 50 caracteres.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setErroConfirmacao("A confirmação deve ser igual à nova senha.");
      return;
    }

    setErro(mensagemIntegracaoPendente);
  }

  const etapas = [
    { numero: 1, titulo: "E-mail" },
    { numero: 2, titulo: "Código" },
    { numero: 3, titulo: "Nova senha" },
  ];

  return (
    <main>
      <section className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0">
          {imagens.map((imagem, index) => (
            <img
              key={imagem}
              src={imagem}
              alt=""
              aria-hidden="true"
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                index === imagemAtual ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-black/65" aria-hidden="true" />

        <div className="hero relative z-10 min-h-screen px-6 py-12">
          <div className="hero-content w-full max-w-6xl flex-col gap-12 lg:flex-row-reverse">
            <div className="card w-full max-w-md shrink-0 rounded-3xl border border-white/20 bg-base-100 shadow-2xl">
              <div className="card-body p-8 md:p-10">
                <div className="mb-2">
                  <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-primary">
                    Segurança da conta
                  </p>
                  <h1 className="text-3xl font-black text-base-content">
                    Recuperar senha
                  </h1>
                  <p className="mt-2 text-sm leading-6 text-base-content/60">
                    Siga as etapas para criar uma nova senha.
                  </p>
                </div>

                <ol
                  aria-label="Etapas da recuperação de senha"
                  className="steps steps-horizontal my-4 w-full"
                >
                  {etapas.map((item) => (
                    <li
                      key={item.numero}
                      className={`step text-xs ${
                        etapa >= item.numero ? "step-primary" : ""
                      }`}
                    >
                      {item.titulo}
                    </li>
                  ))}
                </ol>

                <div
                  role="note"
                  className="alert mb-2 border border-secondary bg-secondary/50 text-sm"
                >
                  A tela está pronta, mas o envio do código, a validação e a
                  redefinição dependem de serviços ainda ausentes no backend.
                </div>

                {etapa === 1 && (
                  <form className="space-y-5" onSubmit={solicitarCodigo}>
                    <CampoFormulario
                      label="E-mail"
                      id="email-recuperacao"
                      type="email"
                      placeholder="seuemail@email.com"
                      autoComplete="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        setErro("");
                      }}
                      required
                    />
                    <p className="text-xs leading-5 text-base-content/55">
                      Quando integrado, o sistema informará o mesmo resultado
                      independentemente de o e-mail estar cadastrado.
                    </p>
                    {erro && (
                      <p role="alert" className="text-sm text-error">
                        {erro}
                      </p>
                    )}
                    <button
                      type="submit"
                      className="btn btn-primary h-12 w-full rounded-xl text-base font-bold"
                    >
                      Solicitar código
                      <i
                        className="fa-solid fa-arrow-right ml-2"
                        aria-hidden="true"
                      />
                    </button>
                  </form>
                )}

                {etapa === 2 && (
                  <form className="space-y-5" onSubmit={validarCodigo}>
                    <p className="text-sm leading-6 text-base-content/65">
                      Informe o código de cinco dígitos enviado para{" "}
                      <strong>{email}</strong>.
                    </p>
                    <CampoFormulario
                      label="Código de recuperação"
                      id="token-recuperacao"
                      type="text"
                      placeholder="00000"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={5}
                      minLength={5}
                      pattern="[0-9]{5}"
                      value={token}
                      onChange={(event) => {
                        setToken(event.target.value.replace(/\D/g, "").slice(0, 5));
                        setErro("");
                      }}
                      required
                    />
                    {erro && (
                      <p role="alert" className="text-sm text-error">
                        {erro}
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={token.length !== 5}
                      className="btn btn-primary h-12 w-full rounded-xl text-base font-bold"
                    >
                      Validar código
                    </button>
                  </form>
                )}

                {etapa === 3 && (
                  <form className="space-y-5" onSubmit={redefinirSenha}>
                    <CampoFormulario
                      label="Nova senha"
                      id="nova-senha-recuperacao"
                      type="password"
                      placeholder="Digite sua nova senha"
                      autoComplete="new-password"
                      minLength={8}
                      maxLength={50}
                      title="A senha deve conter entre 8 e 50 caracteres."
                      value={novaSenha}
                      onChange={(event) => {
                        setNovaSenha(event.target.value);
                        setErro("");
                        setErroConfirmacao("");
                      }}
                      required
                    />
                    <CampoFormulario
                      label="Confirmar nova senha"
                      id="confirmar-nova-senha-recuperacao"
                      type="password"
                      placeholder="Digite a nova senha novamente"
                      autoComplete="new-password"
                      minLength={8}
                      maxLength={50}
                      erro={erroConfirmacao}
                      value={confirmarSenha}
                      onChange={(event) => {
                        setConfirmarSenha(event.target.value);
                        setErro("");
                        setErroConfirmacao("");
                      }}
                      required
                    />
                    {novaSenha &&
                      confirmarSenha &&
                      novaSenha !== confirmarSenha &&
                      !erroConfirmacao && (
                        <p role="status" className="text-sm text-error">
                          As senhas não coincidem.
                        </p>
                      )}
                    {erro && (
                      <p role="alert" className="text-sm text-error">
                        {erro}
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={
                        novaSenha.length < 8 ||
                        novaSenha.length > 50 ||
                        novaSenha !== confirmarSenha
                      }
                      className="btn btn-primary h-12 w-full rounded-xl text-base font-bold"
                    >
                      Redefinir senha
                    </button>
                  </form>
                )}

                <Link
                  to="/login"
                  className="btn btn-ghost h-11 w-full rounded-xl font-semibold"
                >
                  Voltar ao login
                </Link>
              </div>
            </div>

            <div className="flex-1 text-center lg:text-left">
              <div className="mb-5 flex items-center justify-center gap-3 lg:justify-start">
                <span className="h-[3px] w-10 rounded-full bg-primary" />
                <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
                  Acesso seguro
                </span>
              </div>
              <h2 className="text-4xl font-black leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
                Sua conta, protegida no{" "}
                <span className="text-primary">EntreCausas.</span>
              </h2>
              <p className="mx-auto max-w-xl py-6 text-lg leading-8 text-white/75 lg:mx-0">
                Crie uma nova senha para voltar a acompanhar organizações e
                fortalecer causas que transformam a comunidade.
              </p>
              <div className="mt-3 flex items-start justify-center gap-3 text-left lg:justify-start">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-primary backdrop-blur-md">
                  <i className="fa-solid fa-shield-halved" aria-hidden="true" />
                </div>
                <p className="max-w-md text-sm leading-6 text-white/65">
                  Nunca compartilhe seu código de recuperação. Ele deve expirar
                  e ser usado uma única vez.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {imagens.map((imagem, index) => (
            <button
              key={imagem}
              type="button"
              onClick={() => setImagemAtual(index)}
              aria-label={`Exibir imagem ${index + 1}`}
              aria-pressed={index === imagemAtual}
              className={`rounded-full transition-all duration-300 ${
                index === imagemAtual
                  ? "h-2.5 w-8 bg-primary"
                  : "h-2.5 w-2.5 bg-white/50 hover:bg-white"
              }`}
            />
          ))}
        </div>
      </section>

      <OngsCarrossel />
      <Footer />
    </main>
  );
}

export default RecuperarSenha;
