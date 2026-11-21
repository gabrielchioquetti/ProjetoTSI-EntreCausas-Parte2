import { useEffect, useRef, useState } from "react";

import Footer from "../../components/Footer/Footer";
import OngsCarrossel from "../../components/Ongs/OngsCarrossel";
import { apiFetch } from "../../services/Api.js";
import { useAuth } from "../../contexts/AuthContext.jsx";

const imagens = [
  "../../img/carrossel/instituto-nosso-lar/fotografia-Instituto-Nosso-Lar-Horizontal-Desktop.jpg",
  "../../img/carrossel/instituto-nosso-lar/fotografia-Instituto-Nosso-Lar-Vertical-Mobile.jpg",
  "../../img/carrossel/sos-animais/fotografia-SOS-Animais-Vertical-Mobile.jpg",
];

function ExcluirConta() {
  const { usuario, carregando, encerrarSessaoLocal } = useAuth();

  const [imagemAtual, setImagemAtual] = useState(0);
  const [senhaAtual, setSenhaAtual] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [confirmacao, setConfirmacao] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [exclusaoConcluida, setExclusaoConcluida] = useState(false);

  const envioEmAndamento = useRef(false);

  const funcao = usuario?.funcaoNome?.toUpperCase();

  const podeExcluir = funcao === "USUARIO" || funcao === "ADMINISTRADOR";

  const formularioBloqueado =
    carregando || !usuario || !podeExcluir || enviando || exclusaoConcluida;

  // Alterna as imagens do carrossel.
  useEffect(() => {
    const intervalo = setInterval(() => {
      setImagemAtual((anterior) =>
        anterior === imagens.length - 1 ? 0 : anterior + 1,
      );
    }, 5000);

    return () => clearInterval(intervalo);
  }, []);

  // Permite fechar o modal utilizando Escape.
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

    return () => {
      window.removeEventListener("keydown", fecharComEscape);
    };
  }, [modalAberto, enviando]);

  // Valida o formulário antes de solicitar a confirmação.
  function solicitarExclusao(event) {
    event.preventDefault();

    if (formularioBloqueado) {
      return;
    }

    setMensagem("");

    if (!senhaAtual.trim()) {
      setMensagem("Informe sua senha atual.");
      return;
    }

    if (!confirmacao) {
      setMensagem("Confirme que você compreende as consequências da exclusão.");
      return;
    }

    setModalAberto(true);
  }

  // Exclui a conta somente após a confirmação.
  async function confirmarExclusao() {
    if (
      formularioBloqueado ||
      envioEmAndamento.current ||
      !senhaAtual.trim() ||
      !confirmacao
    ) {
      return;
    }

    envioEmAndamento.current = true;
    setEnviando(true);
    setMensagem("");

    try {
      await apiFetch(`/api/usuarios/${usuario.idUsuario}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senhaAtual,
        }),
      });

      // A exclusão foi confirmada pelo backend.
      setExclusaoConcluida(true);
      setModalAberto(false);
      setSenhaAtual("");
      setConfirmacao(false);

      // O backend já encerra as sessões da conta excluída.
      // Invalida verificações antigas e limpa a autenticação local.
      encerrarSessaoLocal();

      // Retorna à página inicial.
      window.location.replace("/");
    } catch (error) {
      setModalAberto(false);

      setMensagem(
        error.message || "Não foi possível excluir sua conta. Tente novamente.",
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
                  Gerenciamento da conta
                </span>
              </div>

              <h1 className="text-4xl font-black leading-tight tracking-tight md:text-5xl lg:text-6xl">
                Excluir minha <span className="text-primary">conta.</span>
              </h1>

              <p className="mt-5 max-w-xl text-lg leading-8 text-white/75">
                Sentimos muito por sua decisão de deixar o EntreCausas. Antes de
                continuar, leia atentamente as informações sobre a exclusão da
                sua conta.
              </p>

              <div className="mt-8 flex max-w-xl items-start gap-4 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-md">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-primary">
                  <i className="fa-solid fa-heart" aria-hidden="true" />
                </span>

                <p className="text-sm leading-6 text-white/80">
                  A EntreCausas valoriza a diversidade, a solidariedade e o
                  respeito à comunidade LGBTQIA+. Sua participação foi
                  importante para fortalecer as causas sociais presentes na
                  plataforma.
                </p>
              </div>
            </div>

            <div className="card w-full rounded-3xl border border-white/20 bg-base-100 shadow-2xl">
              <div className="card-body p-6 md:p-8">
                <h2 className="text-2xl font-black text-base-content">
                  Confirmação de exclusão
                </h2>

                <p className="mb-2 text-sm leading-6 text-base-content/60">
                  Para proteger sua conta, precisamos confirmar sua identidade
                  antes de realizar a exclusão.
                </p>

                <div
                  role="note"
                  className="alert mb-2 border border-warning/40 bg-warning/10 text-sm"
                >
                  A exclusão é permanente. Sua conta será desativada, seus dados
                  pessoais serão anonimizados e você perderá o acesso ao
                  EntreCausas. Os registros históricos necessários serão
                  preservados.
                </div>

                {carregando ? (
                  <div
                    className="flex items-center gap-3 rounded-xl border border-base-300 bg-base-200 p-4 text-sm"
                    role="status"
                  >
                    <span className="loading loading-spinner loading-sm text-primary" />
                    Carregando sua conta...
                  </div>
                ) : (
                  usuario &&
                  podeExcluir && (
                    <div className="rounded-xl border border-base-300 bg-base-200 p-4 text-sm">
                      <p className="font-semibold text-base-content">
                        Conta selecionada
                      </p>

                      <p className="mt-1 text-base-content/70">
                        {usuario.nome}
                      </p>

                      <p className="mt-1 text-base-content/60">
                        {usuario.email}
                      </p>
                    </div>
                  )
                )}

                {!carregando && !usuario && !exclusaoConcluida && (
                  <p
                    role="alert"
                    className="rounded-xl border border-warning/40 bg-warning/10 p-3 text-sm text-base-content"
                  >
                    É necessário estar autenticado para excluir sua conta.
                  </p>
                )}

                {!carregando && usuario && !podeExcluir && (
                  <p
                    role="alert"
                    className="rounded-xl border border-warning/40 bg-warning/10 p-3 text-sm text-base-content"
                  >
                    Esta funcionalidade não está disponível para sua função de
                    acesso.
                  </p>
                )}

                <form onSubmit={solicitarExclusao} className="space-y-5">
                  <div>
                    <label
                      htmlFor="senha-exclusao-conta"
                      className="mb-2 block text-sm font-semibold text-base-content"
                    >
                      Senha atual
                    </label>

                    <div className="relative">
                      <input
                        id="senha-exclusao-conta"
                        type={mostrarSenha ? "text" : "password"}
                        value={senhaAtual}
                        onChange={(event) => {
                          setSenhaAtual(event.target.value);
                          setMensagem("");
                        }}
                        placeholder="Digite sua senha atual"
                        autoComplete="current-password"
                        required
                        disabled={formularioBloqueado}
                        className="input input-bordered h-12 w-full rounded-xl pr-12"
                      />

                      <button
                        type="button"
                        onClick={() => setMostrarSenha((anterior) => !anterior)}
                        disabled={formularioBloqueado}
                        aria-label={
                          mostrarSenha ? "Ocultar senha" : "Mostrar senha"
                        }
                        className="absolute inset-y-0 right-3 flex items-center text-base-content/60 hover:text-base-content"
                      >
                        <i
                          className={`fa-solid ${
                            mostrarSenha ? "fa-eye-slash" : "fa-eye"
                          }`}
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </div>

                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-base-300 p-4">
                    <input
                      type="checkbox"
                      checked={confirmacao}
                      onChange={(event) => {
                        setConfirmacao(event.target.checked);
                        setMensagem("");
                      }}
                      disabled={formularioBloqueado}
                      className="checkbox checkbox-error mt-0.5"
                    />

                    <span className="text-sm leading-6 text-base-content/70">
                      Estou ciente de que minha conta será desativada, meus
                      dados pessoais serão anonimizados e não poderei recuperar
                      o acesso a esta conta.
                    </span>
                  </label>

                  {mensagem && (
                    <p
                      role="alert"
                      className="rounded-xl border border-warning/40 bg-warning/10 p-3 text-sm text-base-content"
                    >
                      {mensagem}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={formularioBloqueado}
                    className="btn h-12 w-full rounded-xl border-0 bg-error text-base font-bold text-error-content hover:bg-error/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {enviando ? "Excluindo conta..." : "Excluir minha conta"}

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
            aria-labelledby="confirmar-exclusao-conta-titulo"
            aria-describedby="confirmar-exclusao-conta-descricao"
            className="w-full max-w-lg rounded-3xl bg-base-100 p-6 shadow-2xl md:p-8"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-error/10 text-xl text-error">
              <i
                className="fa-solid fa-triangle-exclamation"
                aria-hidden="true"
              />
            </div>

            <h2
              id="confirmar-exclusao-conta-titulo"
              className="text-2xl font-black text-base-content"
            >
              Confirmar exclusão da conta?
            </h2>

            <div
              id="confirmar-exclusao-conta-descricao"
              className="mt-4 space-y-3 text-sm leading-6 text-base-content/70"
            >
              <p>
                Ao confirmar, sua conta será desativada imediatamente. Esta
                operação não depende da aprovação de um administrador.
              </p>

              <p>
                Seus dados pessoais serão anonimizados e você perderá o acesso à
                conta. O histórico de solicitações e os vínculos necessários
                serão preservados no sistema.
              </p>

              <p>
                Se você possui uma organização cadastrada, os registros
                relacionados a ela não serão apagados automaticamente por esta
                operação.
              </p>

              <p className="rounded-xl border border-warning/40 bg-warning/10 p-3 font-semibold text-base-content">
                Esta ação não poderá ser desfeita. Você será desconectado após a
                confirmação.
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
                onClick={confirmarExclusao}
                disabled={enviando}
                className="btn rounded-xl border-0 bg-error text-error-content hover:bg-error/90 disabled:opacity-50"
              >
                {enviando ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />
                    Excluindo...
                  </>
                ) : (
                  "Confirmar exclusão"
                )}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default ExcluirConta;