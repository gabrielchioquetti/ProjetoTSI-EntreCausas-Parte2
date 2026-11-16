import { useEffect, useRef, useState } from "react";

import CampoFormulario from "../../components/Form/CampoFormulario";
import Footer from "../../components/Footer/Footer";
import OngsCarrossel from "../../components/Ongs/OngsCarrossel";
import { apiFetch } from "../../services/Api.js";

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
  const [tipoMensagem, setTipoMensagem] = useState("erro");

  // Dados da organização vinculada à sessão autenticada.
  const [ong, setOng] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [solicitacaoEnviada, setSolicitacaoEnviada] = useState(false);
  const envioEmAndamento = useRef(false);

  const solicitacaoPendente =
    ong?.statusSolicitacao?.toUpperCase() === "PENDENTE";

  const exclusaoPendente =
    solicitacaoPendente && ong?.tipoSolicitacao?.toUpperCase() === "EXCLUSAO";

  const formularioBloqueado =
    carregando || !ong || solicitacaoPendente || solicitacaoEnviada || enviando;

  useEffect(() => {
    const intervalo = setInterval(() => {
      setImagemAtual((anterior) =>
        anterior === imagens.length - 1 ? 0 : anterior + 1,
      );
    }, 5000);

    return () => clearInterval(intervalo);
  }, []);

  // Consulta a ONG pertencente ao usuário autenticado.
  useEffect(() => {
    let ativo = true;

    async function carregarMinhaOng() {
      setCarregando(true);
      setMensagem("");

      try {
        const dados = await apiFetch("/api/ongs/minha");

        if (!ativo) return;

        // O backend retorna HTTP 204 quando não existe ONG.
        setOng(dados);
      } catch (error) {
        if (!ativo) return;

        setOng(null);
        setTipoMensagem("erro");
        setMensagem(
          error.message ||
            "Não foi possível carregar os dados da sua organização.",
        );
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarMinhaOng();

    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    if (!modalAberto || enviando) {
      return undefined;
    }

    function fecharComEscape(event) {
      if (event.key === "Escape") {
        setModalAberto(false);
      }
    }

    window.addEventListener("keydown", fecharComEscape);

    return () => window.removeEventListener("keydown", fecharComEscape);
  }, [modalAberto, enviando]);

  function solicitarExclusao(event) {
    event.preventDefault();

    if (formularioBloqueado) {
      return;
    }

    setMensagem("");

    if (!motivo.trim() || !detalhes.trim()) {
      setTipoMensagem("erro");
      setMensagem("Informe o motivo e os detalhes da solicitação de exclusão.");
      return;
    }

    setModalAberto(true);
  }

  // Envia a solicitação somente após a confirmação do usuário.
  async function confirmarSolicitacao() {
    if (formularioBloqueado || envioEmAndamento.current) {
      return;
    }

    envioEmAndamento.current = true;
    setEnviando(true);
    setMensagem("");

    try {
      await apiFetch(`/api/ongs/${ong.idOng}/solicitar-exclusao`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          motivoExclusao: motivo.trim(),
          detalhesExclusao: detalhes.trim(),
        }),
      });

      setSolicitacaoEnviada(true);
      setModalAberto(false);
      setTipoMensagem("sucesso");
      setMensagem(
        "Sua solicitação de exclusão foi enviada com sucesso e está aguardando análise administrativa. A organização continuará disponível enquanto a solicitação estiver pendente.",
      );

      // Atualiza localmente o estado da última solicitação.
      setOng((anterior) =>
        anterior
          ? {
              ...anterior,
              statusSolicitacao: "PENDENTE",
              tipoSolicitacao: "EXCLUSAO",
            }
          : anterior,
      );
    } catch (error) {
      setModalAberto(false);
      setTipoMensagem("erro");
      setMensagem(
        error.message || "Não foi possível enviar a solicitação de exclusão.",
      );
    } finally {
      envioEmAndamento.current = false;
      setEnviando(false);
    }
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

        <div className="absolute inset-0 bg-black/65" aria-hidden="true" />

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
                Solicitar exclusão da <span className="text-primary">ONG.</span>
              </h1>

              <p className="mt-5 max-w-xl text-lg leading-8 text-white/75">
                Conte o motivo e explique melhor sua decisão. A solicitação será
                encaminhada para análise de um administrador.
              </p>

              <div className="mt-8 flex max-w-xl items-start gap-4 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-md">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-primary">
                  <i className="fa-solid fa-heart" aria-hidden="true" />
                </span>

                <p className="text-sm leading-6 text-white/80">
                  A EntreCausas valoriza a diversidade e o respeito à comunidade
                  LGBTQIA+. Se sua organização atua nessa causa, seus projetos e
                  informações também deixarão de estar disponíveis na plataforma
                  após a aprovação da exclusão.
                </p>
              </div>
            </div>

            <div className="card w-full rounded-3xl border border-white/20 bg-base-100 shadow-2xl">
              <div className="card-body p-6 md:p-8">
                <h2 className="text-2xl font-black text-base-content">
                  Motivo da exclusão
                </h2>

                <p className="mb-2 text-sm leading-6 text-base-content/60">
                  As informações ajudarão a equipe a compreender sua
                  solicitação.
                </p>

                <div
                  role="note"
                  className="alert mb-2 border border-warning/40 bg-warning/10 text-sm"
                >
                  A exclusão depende da aprovação de um administrador. Se
                  aprovada, a ONG será desativada e deixará de aparecer
                  publicamente no EntreCausas. Os registros serão preservados
                  conforme as regras do sistema.
                </div>

                {carregando ? (
                  <div
                    className="flex items-center gap-3 rounded-xl border border-base-300 bg-base-200 p-4 text-sm"
                    role="status"
                  >
                    <span className="loading loading-spinner loading-sm text-primary" />
                    Carregando sua organização...
                  </div>
                ) : (
                  ong && (
                    <div className="rounded-xl border border-base-300 bg-base-200 p-4 text-sm">
                      <p className="font-semibold text-base-content">
                        Organização selecionada
                      </p>

                      <p className="mt-1 text-base-content/70">{ong.nome}</p>
                    </div>
                  )
                )}

                {!carregando && !ong && !mensagem && (
                  <p
                    role="status"
                    className="rounded-xl border border-warning/40 bg-warning/10 p-3 text-sm text-base-content"
                  >
                    Você não possui uma organização cadastrada para solicitar a
                    exclusão.
                  </p>
                )}

                {solicitacaoPendente && (
                  <p
                    role="status"
                    className="rounded-xl border border-warning/40 bg-warning/10 p-3 text-sm text-base-content"
                  >
                    {exclusaoPendente
                      ? "Sua solicitação de exclusão está aguardando análise. Não é necessário enviá-la novamente."
                      : "Sua organização já possui uma solicitação pendente. Aguarde a análise antes de solicitar a exclusão."}
                  </p>
                )}

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
                    disabled={formularioBloqueado}
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
                    disabled={formularioBloqueado}
                  />

                  {mensagem && (
                    <p
                      role={tipoMensagem === "erro" ? "alert" : "status"}
                      className={`rounded-xl border p-3 text-sm text-base-content ${
                        tipoMensagem === "sucesso"
                          ? "border-success/40 bg-success/10"
                          : "border-warning/40 bg-warning/10"
                      }`}
                    >
                      {mensagem}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={formularioBloqueado}
                    className="btn h-12 w-full rounded-xl border-0 bg-error text-base font-bold text-error-content hover:bg-error/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {enviando
                      ? "Enviando solicitação..."
                      : solicitacaoEnviada || exclusaoPendente
                        ? "Solicitação enviada"
                        : "Solicitar exclusão"}

                    <i className="fa-solid fa-trash ml-2" aria-hidden="true" />
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
            if (!enviando && event.target === event.currentTarget) {
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
              <i
                className="fa-solid fa-triangle-exclamation"
                aria-hidden="true"
              />
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
                aprovada, realizará a desativação da organização.
              </p>

              <p>
                Após a aprovação, a ONG deixará de aparecer publicamente no
                EntreCausas. Seus dados e o histórico das solicitações
                permanecerão armazenados conforme as regras do sistema.
              </p>

              <p>
                O compromisso com o respeito à comunidade LGBTQIA+ e às causas
                sociais permanece. A exclusão remove a presença pública da
                organização na plataforma, não a importância da causa que ela
                representa.
              </p>

              <p className="rounded-xl border border-warning/40 bg-warning/10 p-3 font-semibold text-base-content">
                Ao confirmar, sua solicitação será enviada para análise. A ONG
                não será desativada imediatamente.
              </p>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setModalAberto(false)}
                disabled={enviando}
                className="btn btn-ghost rounded-xl"
              >
                Voltar e revisar
              </button>

              <button
                type="button"
                onClick={confirmarSolicitacao}
                disabled={enviando}
                className="btn rounded-xl border-0 bg-error text-error-content hover:bg-error/90 disabled:opacity-50"
              >
                {enviando ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />
                    Enviando...
                  </>
                ) : (
                  "Confirmar solicitação"
                )}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default SolicitacaoExclusaoOng;