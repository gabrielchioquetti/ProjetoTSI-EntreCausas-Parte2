import { useCallback, useEffect, useState } from "react";
import { Link, Outlet } from "react-router";

import Footer from "../../components/Footer/Footer";
import { useAdminSolicitacoes } from "../../contexts/useAdminSolicitacoes";

const imagensFundo = [
  "../../img/carrossel/instituto-nosso-lar/fotografia-Instituto-Nosso-Lar-Horizontal-Desktop.jpg",
  "../../img/carrossel/instituto-nosso-lar/fotografia-Instituto-Nosso-Lar-Vertical-Mobile.jpg",
  "../../img/carrossel/sos-animais/fotografia-SOS-Animais-Vertical-Mobile.jpg",
];

const configuracaoStatus = {
  pendente: {
    titulo: "Histórico de Solicitações",
    descricao: "Solicitações aguardando análise da equipe administrativa.",
    label: "Pendente",
    classe: "border-amber-200 bg-amber-50 text-amber-800",
  },
  aprovada: {
    titulo: "Solicitações Aprovadas",
    descricao: "Organizações com solicitação de cadastro aprovada.",
    label: "Aprovada",
    classe: "border-green-200 bg-green-50 text-green-800",
  },
  reprovada: {
    titulo: "Solicitações Reprovadas",
    descricao: "Organizações com solicitação de cadastro reprovada.",
    label: "Reprovada",
    classe: "border-red-200 bg-red-50 text-red-800",
  },
};

export function AdminSolicitacoesLayout() {
  return <Outlet />;
}

function mascararCnpj(cnpj) {
  const digitos = String(cnpj || "").replace(/\D/g, "");

  if (digitos.length !== 14) {
    return "Não informado";
  }

  return `${digitos.slice(0, 2)}.${digitos.slice(2, 5)}.***.****-**`;
}

function StatusBadge({ status }) {
  const configuracao = configuracaoStatus[status];

  if (!configuracao) {
    return null;
  }

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${configuracao.classe}`}
    >
      {configuracao.label}
    </span>
  );
}

function CampoDetalhe({ titulo, valor }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-bold uppercase tracking-wide text-base-content/50">
        {titulo}
      </dt>

      <dd className="mt-1 break-words text-sm text-base-content">
        {valor || "Não informado"}
      </dd>
    </div>
  );
}

function SecaoDetalhes({ titulo, children }) {
  return (
    <section className="border-t border-base-300 pt-5">
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-primary">
        {titulo}
      </h3>

      {children}
    </section>
  );
}

function ModalDetalhes({ ong, onClose, onUpdateStatus }) {
  const [modo, setModo] = useState("detalhes");
  const [justificativa, setJustificativa] = useState("");
  const [erroJustificativa, setErroJustificativa] = useState("");
  const [erroAnalise, setErroAnalise] = useState("");
  const [salvando, setSalvando] = useState(false);

  // Somente solicitações pendentes podem ser analisadas.
  const podeAnalisar = ong.status === "pendente";

  const executarAnalise = useCallback(
    async (status, motivo = "") => {
      if (salvando || ong.status !== "pendente") {
        return;
      }

      setSalvando(true);
      setErroAnalise("");

      try {
        // Aguarda o backend confirmar a análise antes de fechar o modal.
        await onUpdateStatus(ong.id, status, motivo);
        onClose();
      } catch (erro) {
        setErroAnalise(erro.message || "Não foi possível salvar a análise.");
      } finally {
        setSalvando(false);
      }
    },
    [ong.id, ong.status, onClose, onUpdateStatus, salvando],
  );

  useEffect(() => {
    function fecharComEscape(event) {
      if (event.key === "Escape" && !salvando) {
        onClose();
      }
    }

    window.addEventListener("keydown", fecharComEscape);

    return () => {
      window.removeEventListener("keydown", fecharComEscape);
    };
  }, [onClose, salvando]);

  async function reprovarSolicitacao(event) {
    event.preventDefault();

    if (!podeAnalisar) {
      return;
    }

    const texto = justificativa.trim();

    if (!texto) {
      setErroJustificativa("Informe uma justificativa para reprovar.");
      return;
    }

    await executarAnalise("reprovada", texto);
  }

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-3 sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !salvando) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="detalhes-solicitacao-titulo"
        className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-base-300 p-5 sm:p-6">
          <div className="flex min-w-0 items-center gap-4">
            <img
              src={ong.imagens?.[0]?.src || "/img/default/ongs.png"}
              alt={ong.imagens?.[0]?.alt || `Logo de ${ong.nome}`}
              className="h-14 w-14 shrink-0 rounded-xl border border-base-300 object-cover"
              onError={(event) => {
                if (
                  !event.currentTarget.src.endsWith("/img/default/ongs.png")
                ) {
                  event.currentTarget.src = "/img/default/ongs.png";
                }
              }}
            />

            <div className="min-w-0">
              <h2
                id="detalhes-solicitacao-titulo"
                className="truncate text-xl font-black text-base-content sm:text-2xl"
              >
                {ong.nome}
              </h2>

              <div className="mt-1">
                <StatusBadge status={ong.status} />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={salvando}
            aria-label="Fechar detalhes"
            title="Fechar"
            className="btn btn-ghost btn-sm btn-square shrink-0"
          >
            <i className="fa-solid fa-xmark" aria-hidden="true" />
          </button>
        </header>

        <div className="overflow-y-auto p-5 sm:p-6">
          {modo === "detalhes" ? (
            <div className="space-y-5">
              <SecaoDetalhes titulo="Dados institucionais">
                <dl className="grid gap-4 sm:grid-cols-2">
                  <CampoDetalhe titulo="Nome da organização" valor={ong.nome} />

                  <CampoDetalhe
                    titulo="Categoria principal"
                    valor={ong.categoriaPrincipal}
                  />

                  <CampoDetalhe
                    titulo="Áreas de atuação"
                    valor={ong.categorias?.join(", ")}
                  />
                </dl>
              </SecaoDetalhes>

              <SecaoDetalhes titulo="Documentação e identificação">
                <dl className="grid gap-4 sm:grid-cols-2">
                  <CampoDetalhe
                    titulo="CNPJ"
                    valor={ong.cnpj ? mascararCnpj(ong.cnpj) : null}
                  />
                </dl>
              </SecaoDetalhes>

              <SecaoDetalhes titulo="Contatos e redes sociais">
                <dl className="grid gap-4 sm:grid-cols-2">
                  <CampoDetalhe titulo="Telefone" valor={ong.telefone} />

                  <CampoDetalhe titulo="Instagram" valor={ong.instagram} />
                </dl>
              </SecaoDetalhes>

              <SecaoDetalhes titulo="Endereço e área de atuação">
                <dl className="grid gap-4 sm:grid-cols-2">
                  <CampoDetalhe
                    titulo="Localização cadastrada"
                    valor={ong.localizacao}
                  />

                  <CampoDetalhe titulo="CEP" valor={ong.cep} />

                  <CampoDetalhe titulo="Logradouro" valor={ong.logradouro} />

                  <CampoDetalhe titulo="Número" valor={ong.numero} />

                  <CampoDetalhe titulo="Complemento" valor={ong.complemento} />

                  <CampoDetalhe titulo="Bairro" valor={ong.bairro} />

                  <CampoDetalhe titulo="Cidade" valor={ong.cidade} />

                  <CampoDetalhe titulo="Estado" valor={ong.estado} />
                </dl>
              </SecaoDetalhes>

              <SecaoDetalhes titulo="Descrição da organização">
                <p className="text-sm leading-6 text-base-content/75">
                  {ong.descricao || "Não informado"}
                </p>
              </SecaoDetalhes>

              <SecaoDetalhes titulo="Imagens cadastradas">
                {ong.imagens?.length ? (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {ong.imagens.map((imagem) => (
                      <img
                        key={imagem.id || imagem.src}
                        src={imagem.src}
                        alt={imagem.alt || `Imagem de ${ong.nome}`}
                        className="h-32 w-full rounded-xl border border-base-300 object-cover"
                        onError={(event) => {
                          if (
                            !event.currentTarget.src.endsWith(
                              "/img/default/ongs.png",
                            )
                          ) {
                            event.currentTarget.src = "/img/default/ongs.png";
                          }
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-base-content/60">
                    Nenhuma imagem informada.
                  </p>
                )}
              </SecaoDetalhes>

              {ong.justificativaReprovacao && (
                <SecaoDetalhes titulo="Justificativa da reprovação">
                  <p className="text-sm leading-6 text-base-content/75">
                    {ong.justificativaReprovacao}
                  </p>
                </SecaoDetalhes>
              )}
            </div>
          ) : (
            <form onSubmit={reprovarSolicitacao} className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-base-content">
                  Justificativa da reprovação
                </h3>

                <p className="mt-1 text-sm text-base-content/60">
                  Explique o motivo para registrar a decisão.
                </p>
              </div>

              <label
                htmlFor="justificativa-reprovacao"
                className="block text-sm font-bold text-base-content"
              >
                Justificativa
              </label>

              <textarea
                id="justificativa-reprovacao"
                value={justificativa}
                disabled={salvando}
                onChange={(event) => {
                  setJustificativa(event.target.value);
                  setErroJustificativa("");
                  setErroAnalise("");
                }}
                aria-invalid={Boolean(erroJustificativa)}
                aria-describedby={
                  erroJustificativa ? "erro-justificativa" : undefined
                }
                className={`textarea min-h-36 w-full rounded-xl border bg-base-100 ${
                  erroJustificativa ? "border-error" : "border-base-300"
                }`}
                placeholder="Descreva a justificativa"
              />

              {erroJustificativa && (
                <p
                  id="erro-justificativa"
                  role="alert"
                  className="text-sm text-error"
                >
                  {erroJustificativa}
                </p>
              )}

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={salvando}
                  onClick={() => {
                    setModo("detalhes");
                    setErroAnalise("");
                  }}
                  className="btn btn-ghost rounded-xl"
                >
                  Voltar aos detalhes
                </button>

                <button
                  type="submit"
                  disabled={salvando || !podeAnalisar}
                  className="btn rounded-xl border-0 bg-error text-error-content hover:bg-error/90"
                >
                  {salvando ? (
                    <>
                      <span className="loading loading-spinner loading-sm" />
                      Salvando...
                    </>
                  ) : (
                    "Registrar reprovação"
                  )}
                </button>
              </div>
            </form>
          )}

          {erroAnalise && (
            <div role="alert" className="alert alert-error mt-4 text-sm">
              <i
                className="fa-solid fa-circle-exclamation"
                aria-hidden="true"
              />

              <span>{erroAnalise}</span>
            </div>
          )}
        </div>

        {modo === "detalhes" && (
          <footer className="flex flex-col-reverse gap-3 border-t border-base-300 p-5 sm:flex-row sm:justify-between sm:p-6">
            <button
              type="button"
              disabled={salvando}
              onClick={onClose}
              className="btn btn-ghost rounded-xl"
            >
              Voltar à lista
            </button>

            {/* Somente solicitações pendentes podem ser analisadas. */}
            {podeAnalisar && (
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  disabled={salvando}
                  onClick={() => {
                    setModo("reprovar");
                    setErroAnalise("");
                  }}
                  title="Reprovar solicitação"
                  className="btn rounded-xl border border-error/30 bg-base-100 text-error hover:bg-error/5"
                >
                  <i className="fa-solid fa-xmark" aria-hidden="true" />
                  Reprovar
                </button>

                <button
                  type="button"
                  disabled={salvando}
                  onClick={() => executarAnalise("aprovada")}
                  title="Aprovar solicitação"
                  className="btn btn-primary rounded-xl"
                >
                  {salvando ? (
                    <span className="loading loading-spinner loading-sm" />
                  ) : (
                    <i className="fa-solid fa-check" aria-hidden="true" />
                  )}

                  {salvando ? "Salvando..." : "Aprovar"}
                </button>
              </div>
            )}
          </footer>
        )}
      </section>
    </div>
  );
}

export function AdminSolicitacoesPage({ status }) {
  const {
    solicitacoes,
    atualizarStatus,
    carregarSolicitacoes,
    carregando,
    erro,
  } = useAdminSolicitacoes();

  const [imagemAtual, setImagemAtual] = useState(0);
  const [ongSelecionada, setOngSelecionada] = useState(null);

  const configuracao = configuracaoStatus[status];

  const solicitacoesFiltradas = solicitacoes.filter(
    (solicitacao) => solicitacao.status === status,
  );

  const contadores = [
    {
      status: "pendente",
      titulo: "Pendentes",
      icon: "fa-clock",
      to: "/admin/solicitacoes",
      classes: "border-t-amber-400 text-amber-700",
    },
    {
      status: "aprovada",
      titulo: "Aprovadas",
      icon: "fa-circle-check",
      to: "/admin/solicitacoes/aprovadas",
      classes: "border-t-primary text-primary",
    },
    {
      status: "reprovada",
      titulo: "Reprovadas",
      icon: "fa-circle-xmark",
      to: "/admin/solicitacoes/reprovadas",
      classes: "border-t-error text-error",
    },
  ].map((contador) => ({
    ...contador,
    total: solicitacoes.filter(
      (solicitacao) => solicitacao.status === contador.status,
    ).length,
  }));

  useEffect(() => {
    const intervalo = setInterval(() => {
      setImagemAtual((anterior) =>
        anterior === imagensFundo.length - 1 ? 0 : anterior + 1,
      );
    }, 5000);

    return () => clearInterval(intervalo);
  }, []);

  if (!configuracao) {
    return (
      <>
        <main className="min-h-[calc(100vh-5rem)] px-4 py-10 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-7xl rounded-xl border border-base-300 bg-base-100 p-6">
            <h1 className="text-xl font-bold text-base-content">
              Categoria de solicitações inválida
            </h1>

            <Link to="/admin/solicitacoes" className="btn btn-primary mt-4">
              Voltar às solicitações
            </Link>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <main className="relative min-h-[calc(100vh-5rem)] overflow-hidden px-4 py-10 sm:px-6 lg:px-10">
        <div className="absolute inset-0" aria-hidden="true">
          {imagensFundo.map((imagem, indice) => (
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

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-7">
            <p className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-primary">
              <span className="h-[3px] w-8 rounded-full bg-primary" />
              Painel administrativo
            </p>

            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              {configuracao.titulo}
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/75 sm:text-base">
              {configuracao.descricao}
            </p>
          </div>

          <nav
            aria-label="Resumo das solicitações por status"
            className="mb-5 grid gap-3 sm:grid-cols-3"
          >
            {contadores.map((contador) => {
              const desabilitado =
                contador.status !== "pendente" && contador.total === 0;

              const conteudo = (
                <>
                  <span>
                    <span className="block text-sm font-semibold text-base-content/65">
                      {contador.titulo}
                    </span>

                    <span className="mt-1 block text-3xl font-black text-base-content">
                      {contador.total}
                    </span>
                  </span>

                  <i
                    className={`fa-solid ${contador.icon} text-xl`}
                    aria-hidden="true"
                  />
                </>
              );

              const className = `flex items-center justify-between gap-4 rounded-xl border border-base-300 border-t-4 bg-base-100 px-5 py-4 shadow-sm ${contador.classes} ${
                desabilitado
                  ? "cursor-not-allowed opacity-50"
                  : "transition hover:-translate-y-0.5 hover:shadow-md"
              }`;

              return desabilitado ? (
                <span
                  key={contador.status}
                  aria-disabled="true"
                  title={`Não há solicitações ${contador.titulo.toLowerCase()} no momento.`}
                  className={className}
                >
                  {conteudo}
                </span>
              ) : (
                <Link
                  key={contador.status}
                  to={contador.to}
                  aria-current={status === contador.status ? "page" : undefined}
                  aria-label={`${contador.titulo}: ${contador.total}. Abrir solicitações ${contador.titulo.toLowerCase()}`}
                  className={className}
                >
                  {conteudo}
                </Link>
              );
            })}
          </nav>

          <section className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
            <div className="flex flex-col gap-3 border-b border-base-300 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-bold text-base-content">
                  {configuracao.label}{" "}
                  <span className="font-normal text-base-content/55">
                    ({solicitacoesFiltradas.length})
                  </span>
                </h2>

                <p className="mt-1 text-xs text-base-content/55">
                  Abra os detalhes para analisar uma organização e registrar uma
                  decisão.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={carregarSolicitacoes}
                  disabled={carregando}
                  className="btn btn-sm rounded-lg border-base-300 bg-base-100"
                >
                  <i
                    className={`fa-solid fa-rotate-right ${
                      carregando ? "animate-spin" : ""
                    }`}
                    aria-hidden="true"
                  />
                  Atualizar
                </button>

                <Link
                  to="/admin/solicitacoes"
                  className="btn btn-sm rounded-lg border-base-300 bg-base-100"
                >
                  Ver pendentes
                </Link>
              </div>
            </div>

            {erro && (
              <div className="p-5">
                <div role="alert" className="alert alert-error">
                  <i
                    className="fa-solid fa-circle-exclamation"
                    aria-hidden="true"
                  />

                  <span>{erro}</span>

                  <button
                    type="button"
                    onClick={carregarSolicitacoes}
                    disabled={carregando}
                    className="btn btn-sm"
                  >
                    Tentar novamente
                  </button>
                </div>
              </div>
            )}

            {carregando && (
              <div
                role="status"
                aria-live="polite"
                className="flex items-center justify-center gap-3 p-10 text-base-content/70"
              >
                <span className="loading loading-spinner loading-md" />
                Carregando solicitações...
              </div>
            )}

            {!carregando && !erro && (
              <div className="overflow-x-auto">
                <table className="table table-zebra min-w-[860px]">
                  <thead className="bg-base-200 text-xs uppercase tracking-wide text-base-content/70">
                    <tr>
                      <th>ONG</th>
                      <th>CNPJ</th>
                      <th>Contato</th>
                      <th>Status</th>
                      <th className="text-right">Ações</th>
                    </tr>
                  </thead>

                  <tbody>
                    {solicitacoesFiltradas.map((ong) => (
                      <tr key={ong.id} className="hover">
                        <td>
                          <div className="flex min-w-[15rem] items-center gap-3">
                            <div className="avatar">
                              <div className="h-11 w-11 rounded-xl border border-base-300 bg-base-200">
                                <img
                                  src={
                                    ong.imagens?.[0]?.src ||
                                    "/img/default/ongs.png"
                                  }
                                  alt={
                                    ong.imagens?.[0]?.alt ||
                                    `Logo de ${ong.nome}`
                                  }
                                  onError={(event) => {
                                    if (
                                      !event.currentTarget.src.endsWith(
                                        "/img/default/ongs.png",
                                      )
                                    ) {
                                      event.currentTarget.src =
                                        "/img/default/ongs.png";
                                    }
                                  }}
                                />
                              </div>
                            </div>

                            <div className="min-w-0">
                              <p className="truncate font-bold text-base-content">
                                {ong.nome}
                              </p>

                              <p className="max-w-56 truncate text-xs text-base-content/55">
                                {ong.localizacao ||
                                  ong.categoriaPrincipal ||
                                  "Organização"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="whitespace-nowrap text-sm text-base-content/70">
                          {mascararCnpj(ong.cnpj)}
                        </td>

                        <td className="max-w-48 truncate text-sm text-base-content/70">
                          {contatoDaOng(ong)}
                        </td>

                        <td>
                          <StatusBadge status={ong.status} />
                        </td>

                        <td className="text-right">
                          <button
                            type="button"
                            title="Visualizar detalhes da ONG"
                            aria-label={`Visualizar detalhes de ${ong.nome}`}
                            onClick={() => setOngSelecionada(ong)}
                            className="btn btn-ghost btn-sm btn-square text-primary"
                          >
                            <i className="fa-solid fa-eye" aria-hidden="true" />
                          </button>
                        </td>
                      </tr>
                    ))}

                    {solicitacoesFiltradas.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-12 text-center">
                          <i
                            className="fa-solid fa-inbox mb-3 text-3xl text-base-content/30"
                            aria-hidden="true"
                          />

                          <p className="font-semibold text-base-content">
                            Nenhuma solicitação nesta categoria
                          </p>

                          <p className="mt-1 text-sm text-base-content/55">
                            As organizações serão exibidas aqui conforme o
                            status.
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>

                  <tfoot className="bg-base-200/70 text-xs text-base-content/60">
                    <tr>
                      <th colSpan={5} className="font-medium">
                        {solicitacoesFiltradas.length} solicitação(ões) nesta
                        visualização
                      </th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </section>

          <div className="mt-8 flex justify-center gap-2">
            {imagensFundo.map((imagem, indice) => (
              <button
                key={imagem}
                type="button"
                onClick={() => setImagemAtual(indice)}
                aria-label={`Exibir imagem de fundo ${indice + 1}`}
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
      </main>

      <Footer />

      {ongSelecionada && (
        <ModalDetalhes
          ong={ongSelecionada}
          onClose={() => setOngSelecionada(null)}
          onUpdateStatus={atualizarStatus}
        />
      )}
    </>
  );
}

function contatoDaOng(ong) {
  return ong.telefone || ong.instagram || "Não informado";
}
