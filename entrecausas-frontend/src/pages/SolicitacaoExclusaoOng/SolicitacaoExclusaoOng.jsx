import { useEffect, useState } from "react";
import CampoFormulario from "../../components/Form/CampoFormulario";
import Footer from "../../components/Footer/Footer";
import OngsCarrossel from "../../components/Ongs/OngsCarrossel";

const imagens = [
  "../../img/carrossel/instituto-nosso-lar/fotografia-Instituto-Nosso-Lar-Horizontal-Desktop.jpg",
  "../../img/carrossel/instituto-nosso-lar/fotografia-Instituto-Nosso-Lar-Vertical-Mobile.jpg",
  "../../img/carrossel/sos-animais/fotografia-SOS-Animais-Vertical-Mobile.jpg",
];

function SolicitacaoExclusaoOng() {
  const [imagemAtual, setImagemAtual] = useState(0);
  const [motivo, setMotivo] = useState("");
  const [detalhes, setDetalhes] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    const intervalo = setInterval(() => {
      setImagemAtual((anterior) =>
        anterior === imagens.length - 1 ? 0 : anterior + 1,
      );
    }, 5000);

    return () => clearInterval(intervalo);
  }, []);

  useEffect(() => {
    if (!modalAberto) {
      return undefined;
    }

    function fecharComEscape(event) {
      if (event.key === "Escape") {
        setModalAberto(false);
      }
    }

    window.addEventListener("keydown", fecharComEscape);
    return () => window.removeEventListener("keydown", fecharComEscape);
  }, [modalAberto]);

  function solicitarExclusao(event) {
    event.preventDefault();
    setMensagem("");
    setModalAberto(true);
  }

  function confirmarSolicitacao() {
    setModalAberto(false);
    setMensagem(
      "Esta tela é um protótipo: sua solicitação não foi enviada e nenhum dado foi excluído.",
    );
  }

  return (
    <main>
      <section className="relative min-h-screen overflow-hidden py-12 lg:py-16">
        <div className="absolute inset-0" aria-hidden="true">
          {imagens.map((imagem, indice) => (
            <img
              key={imagem}
              src={imagem}
              alt=""
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                indice === imagemAtual ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>
        <div
          className="absolute inset-0 bg-black/65"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
          <div className="grid items-start gap-10 lg:grid-cols-[1fr_0.9fr] lg:gap-16">
            <div className="pt-4 text-white">
              <div className="mb-5 flex items-center gap-3">
                <span className="h-[3px] w-10 rounded-full bg-primary" />
                <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
                  Gerenciamento da organização
                </span>
              </div>

              <h1 className="text-4xl font-black leading-tight tracking-tight md:text-5xl lg:text-6xl">
                Solicitar exclusão da{" "}
                <span className="text-primary">ONG.</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-white/75">
                Conte o motivo e explique melhor sua decisão. A solicitação
                será encaminhada para análise de um administrador.
              </p>

              <div className="mt-8 flex max-w-xl items-start gap-4 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-md">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-primary">
                  <i className="fa-solid fa-heart" aria-hidden="true" />
                </span>
                <p className="text-sm leading-6 text-white/80">
                  A EntreCausas valoriza a diversidade e o respeito à
                  comunidade LGBTQIA+. Se sua organização atua nessa causa,
                  seus projetos e informações também deixarão de estar
                  disponíveis na plataforma após a exclusão.
                </p>
              </div>
            </div>

            <div className="card w-full rounded-3xl border border-white/20 bg-base-100 shadow-2xl">
              <div className="card-body p-6 md:p-8">
                <h2 className="text-2xl font-black text-base-content">
                  Motivo da exclusão
                </h2>
                <p className="mb-2 text-sm leading-6 text-base-content/60">
                  As informações ajudarão a equipe a compreender sua solicitação.
                </p>

                <div
                  role="note"
                  className="alert mb-2 border border-warning/40 bg-warning/10 text-sm"
                >
                  A exclusão é permanente. Antes de confirmar, revise as
                  informações e considere que não será possível recuperá-las.
                </div>

                <form onSubmit={solicitarExclusao} className="space-y-5">
                  <CampoFormulario
                    label="Qual é o motivo da solicitação?"
                    id="motivo-exclusao"
                    textarea
                    placeholder="Descreva brevemente o motivo"
                    value={motivo}
                    onChange={(event) => {
                      setMotivo(event.target.value);
                      setMensagem("");
                    }}
                    required
                  />
                  <CampoFormulario
                    label="Por que deseja excluir a organização?"
                    id="detalhes-exclusao"
                    textarea
                    placeholder="Conte um pouco mais sobre sua decisão"
                    value={detalhes}
                    onChange={(event) => {
                      setDetalhes(event.target.value);
                      setMensagem("");
                    }}
                    required
                  />

                  {mensagem && (
                    <p
                      role="status"
                      className="rounded-xl border border-warning/40 bg-warning/10 p-3 text-sm text-base-content"
                    >
                      {mensagem}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="btn h-12 w-full rounded-xl border-0 bg-error text-base font-bold text-error-content hover:bg-error/90"
                  >
                    Solicitar exclusão
                    <i
                      className="fa-solid fa-trash ml-2"
                      aria-hidden="true"
                    />
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-center gap-2">
            {imagens.map((imagem, indice) => (
              <button
                key={imagem}
                type="button"
                onClick={() => setImagemAtual(indice)}
                aria-label={`Exibir imagem ${indice + 1}`}
                aria-pressed={indice === imagemAtual}
                className={`rounded-full transition-all duration-300 ${
                  indice === imagemAtual
                    ? "h-2.5 w-8 bg-primary"
                    : "h-2.5 w-2.5 bg-white/50 hover:bg-white"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      <OngsCarrossel />
      <Footer />

      {modalAberto && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setModalAberto(false);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirmar-exclusao-titulo"
            aria-describedby="confirmar-exclusao-descricao"
            className="w-full max-w-lg rounded-3xl bg-base-100 p-6 shadow-2xl md:p-8"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-error/10 text-xl text-error">
              <i className="fa-solid fa-triangle-exclamation" aria-hidden="true" />
            </div>
            <h2
              id="confirmar-exclusao-titulo"
              className="text-2xl font-black text-base-content"
            >
              Confirmar solicitação?
            </h2>
            <div
              id="confirmar-exclusao-descricao"
              className="mt-4 space-y-3 text-sm leading-6 text-base-content/70"
            >
              <p>
                Um administrador analisará sua solicitação e, se ela for
                aprovada, realizará a exclusão da organização.
              </p>
              <p>
                A exclusão removerá permanentemente os dados da ONG da
                plataforma, incluindo cadastro, descrições, endereço, fotos e
                projetos. Essas informações não poderão ser recuperadas.
              </p>
              <p>
                O compromisso com o respeito à comunidade LGBTQIA+ e às causas
                sociais permanece. A exclusão remove a presença da organização
                na plataforma, não a importância da causa que ela representa.
              </p>
              <p className="rounded-xl border border-warning/40 bg-warning/10 p-3 font-semibold text-base-content">
                Protótipo visual: a solicitação ainda não será enviada ao
                administrador e nenhum dado será excluído.
              </p>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setModalAberto(false)}
                className="btn btn-ghost rounded-xl"
              >
                Voltar e revisar
              </button>
              <button
                type="button"
                onClick={confirmarSolicitacao}
                className="btn rounded-xl border-0 bg-error text-error-content hover:bg-error/90"
              >
                Confirmar solicitação
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default SolicitacaoExclusaoOng;
