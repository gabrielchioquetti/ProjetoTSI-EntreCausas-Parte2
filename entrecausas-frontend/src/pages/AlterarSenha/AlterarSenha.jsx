import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import CampoFormulario from "../../components/Form/CampoFormulario";
import OngsCarrossel from "../../components/Ongs/OngsCarrossel";
import Footer from "../../components/Footer/Footer";

const imagens = [
  "../../img/carrossel/instituto-nosso-lar/fotografia-Instituto-Nosso-Lar-Horizontal-Desktop.jpg",
  "../../img/carrossel/instituto-nosso-lar/fotografia-Instituto-Nosso-Lar-Vertical-Mobile.jpg",
  "../../img/carrossel/sos-animais/fotografia-SOS-Animais-Vertical-Mobile.jpg",
];

function AlterarSenha() {
  const navigate = useNavigate();
  const [imagemAtual, setImagemAtual] = useState(0);
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmacaoSenha, setConfirmacaoSenha] = useState("");
  const [erroConfirmacao, setErroConfirmacao] = useState("");
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    const intervalo = setInterval(() => {
      setImagemAtual((anterior) =>
        anterior === imagens.length - 1 ? 0 : anterior + 1,
      );
    }, 5000);

    return () => clearInterval(intervalo);
  }, []);

  function enviarFormulario(event) {
    event.preventDefault();
    setErroConfirmacao("");
    setMensagem("");

    if (novaSenha !== confirmacaoSenha) {
      setErroConfirmacao("A confirmação deve ser igual à nova senha.");
      return;
    }

    setMensagem(
      "As senhas foram conferidas nesta tela. A alteração ainda não está conectada ao backend.",
    );
    event.currentTarget.reset();
    setNovaSenha("");
    setConfirmacaoSenha("");
  }

  return (
    <main>
      <section className="relative min-h-screen overflow-hidden">
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

        <div
          className="absolute inset-0 bg-black/65"
          aria-hidden="true"
        />

        <div className="hero relative z-10 min-h-screen px-6">
          <div className="hero-content w-full max-w-6xl flex-col gap-12 lg:flex-row-reverse">
            <div className="flex-1 text-center lg:text-left">
              <div className="mb-5 flex items-center justify-center gap-3 lg:justify-start">
                <span className="h-[3px] w-10 rounded-full bg-primary" />
                <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
                  Segurança da conta
                </span>
              </div>

              <h1 className="text-4xl font-black leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
                Cuide da sua senha no{" "}
                <span className="text-primary">EntreCausas.</span>
              </h1>

              <p className="mx-auto max-w-xl py-6 text-lg leading-8 text-white/75 lg:mx-0">
                Atualize sua senha para manter sua conta protegida.
              </p>

              <div className="mt-3 flex items-start justify-center gap-3 text-left lg:justify-start">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-primary backdrop-blur-md">
                  <i className="fa-solid fa-shield-halved" aria-hidden="true" />
                </div>
                <p className="max-w-md text-sm leading-6 text-white/65">
                  Use uma senha segura e não compartilhe seus dados de acesso.
                </p>
              </div>
            </div>

            <div className="card w-full max-w-md shrink-0 rounded-3xl border border-white/20 bg-base-100 shadow-2xl">
              <div className="card-body p-8 md:p-10">
                <div className="mb-4">
                  <h2 className="text-3xl font-black text-base-content">
                    Alterar senha
                  </h2>
                  <p className="mt-2 text-sm text-base-content/55">
                    Informe sua senha atual e escolha uma nova.
                  </p>
                </div>

                <div
                  role="note"
                  className="alert mb-2 border border-secondary bg-secondary/50 text-sm"
                >
                  Protótipo visual: a senha atual não será validada e a nova
                  senha não será salva.
                </div>

                <form onSubmit={enviarFormulario} className="space-y-5">
                  <CampoFormulario
                    label="Senha atual"
                    id="senhaAtual"
                    type="password"
                    placeholder="Digite sua senha atual"
                    autoComplete="current-password"
                    required
                  />

                  <CampoFormulario
                    label="Nova senha"
                    id="novaSenha"
                    type="password"
                    placeholder="Digite sua nova senha"
                    autoComplete="new-password"
                    minLength={8}
                    title="A nova senha deve ter pelo menos 8 caracteres."
                    value={novaSenha}
                    onChange={(event) => {
                      setNovaSenha(event.target.value);
                      setErroConfirmacao("");
                      setMensagem("");
                    }}
                    required
                  />

                  <CampoFormulario
                    label="Confirmar nova senha"
                    id="confirmarSenha"
                    type="password"
                    placeholder="Digite a nova senha novamente"
                    autoComplete="new-password"
                    minLength={8}
                    erro={erroConfirmacao}
                    value={confirmacaoSenha}
                    onChange={(event) => {
                      setConfirmacaoSenha(event.target.value);
                      setErroConfirmacao("");
                      setMensagem("");
                    }}
                    required
                  />

                  {mensagem && (
                    <p
                      role="status"
                      className="rounded-xl border border-secondary bg-secondary/50 p-3 text-sm text-base-content"
                    >
                      {mensagem}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="btn btn-primary mt-2 h-12 w-full rounded-xl text-base font-bold"
                  >
                    Atualizar senha
                    <i
                      className="fa-solid fa-arrow-right ml-2"
                      aria-hidden="true"
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="btn btn-ghost h-11 w-full rounded-xl font-semibold"
                  >
                    Voltar
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {imagens.map((imagem, indice) => (
            <button
              key={imagem}
              type="button"
              onClick={() => setImagemAtual(indice)}
              aria-label={`Exibir imagem ${indice + 1}`}
              aria-pressed={indice === imagemAtual}
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
      </section>

      <OngsCarrossel />
      <Footer />
    </main>
  );
}

export default AlterarSenha;
