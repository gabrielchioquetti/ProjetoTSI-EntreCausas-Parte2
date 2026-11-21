import { useEffect, useState } from "react";

import Footer from "../../components/Footer/Footer.jsx";
import { apiFetch } from "../../services/Api.js";

const ITENS_POR_PAGINA = 6;

const operacoes = ["INSERT", "UPDATE"];
const tabelas = ["solicitacao"];

const classeOperacao = {
  INSERT: "border-green-200 bg-green-50 text-green-800",
  UPDATE: "border-blue-200 bg-blue-50 text-blue-800",
};

const formatoDataHora = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "medium",
});

// Formata a data recebida do backend.
function formatarDataHora(dataHora) {
  if (!dataHora) {
    return "Não informado";
  }

  const data = new Date(
    /(?:Z|[+-]\d{2}:\d{2})$/.test(dataHora) ? dataHora : `${dataHora}-03:00`,
  );

  return Number.isNaN(data.getTime())
    ? "Data inválida"
    : formatoDataHora.format(data);
}

function formatarCampo(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return "Não informado";
  }

  if (typeof valor === "object") {
    return JSON.stringify(valor);
  }

  return String(valor);
}

// Consulta os registros utilizando a API centralizada.
async function consultarAuditoria(parametros, signal) {
  const query = new URLSearchParams();

  Object.entries(parametros).forEach(([chave, valor]) => {
    if (valor !== "" && valor !== null && valor !== undefined) {
      query.set(chave, String(valor));
    }
  });

  return apiFetch(`/api/auditoria?${query.toString()}`, {
    method: "GET",
    signal,
  });
}

function CartaoResumo({ titulo, total, icone, cor }) {
  return (
    <article className="flex items-center gap-4 rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
      <span
        className={`flex h-12 w-12 items-center justify-center rounded-xl ${cor}`}
        aria-hidden="true"
      >
        <i className={`fa-solid ${icone} text-lg`} />
      </span>

      <div>
        <p className="text-sm font-semibold text-base-content/60">{titulo}</p>

        <p className="text-2xl font-black text-base-content">{total}</p>
      </div>
    </article>
  );
}

function SecaoDados({ titulo, dados, semDados }) {
  return (
    <section className="rounded-2xl border border-base-300 bg-base-100 p-4 sm:p-5">
      <h3 className="mb-4 flex items-center gap-2 font-bold text-base-content">
        <i className="fa-solid fa-code text-primary" aria-hidden="true" />
        {titulo}
      </h3>

      {dados ? (
        <dl className="space-y-3">
          {Object.entries(dados).map(([chave, valor]) => (
            <div
              key={chave}
              className="grid gap-1 border-b border-base-200 pb-3 last:border-0 last:pb-0 sm:grid-cols-[minmax(8rem,0.7fr)_2fr] sm:gap-4"
            >
              <dt className="break-words text-xs font-bold uppercase tracking-wide text-base-content/55">
                {chave}
              </dt>

              <dd className="break-words text-sm text-base-content">
                {formatarCampo(valor)}
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="text-sm text-base-content/60">{semDados}</p>
      )}
    </section>
  );
}

export default function HistoricoAuditoria() {
  const [filtros, setFiltros] = useState({
    dataInicial: "",
    dataFinal: "",
    operacao: "",
    tabela: "",
  });

  const [pagina, setPagina] = useState(1);
  const [registroSelecionado, setRegistroSelecionado] = useState(null);

  const [registrosPagina, setRegistrosPagina] = useState([]);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(1);

  const [resumoOperacoes, setResumoOperacoes] = useState({
    INSERT: null,
    UPDATE: null,
  });

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [recarregar, setRecarregar] = useState(0);

  // Consulta os registros com filtros e paginação no backend.
  useEffect(() => {
    const controller = new AbortController();

    async function carregarRegistros() {
      setCarregando(true);
      setErro("");
      setRegistrosPagina([]);

      try {
        const resposta = await consultarAuditoria(
          {
            pagina: pagina - 1,
            tamanho: ITENS_POR_PAGINA,
            ...filtros,
          },
          controller.signal,
        );

        if (controller.signal.aborted) {
          return;
        }

        setRegistrosPagina(resposta.content ?? []);
        setTotalRegistros(resposta.totalElements ?? 0);
        setTotalPaginas(Math.max(1, resposta.totalPages ?? 1));
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setErro(error.message);
        setRegistrosPagina([]);
        setTotalRegistros(0);
        setTotalPaginas(1);
      } finally {
        if (!controller.signal.aborted) {
          setCarregando(false);
        }
      }
    }

    carregarRegistros();

    return () => controller.abort();
  }, [pagina, filtros, recarregar]);

  // Consulta os totais globais das operações.
  useEffect(() => {
    const controller = new AbortController();

    async function carregarResumo() {
      setResumoOperacoes({
        INSERT: null,
        UPDATE: null,
      });

      try {
        const [insercoes, atualizacoes] = await Promise.all([
          consultarAuditoria(
            {
              pagina: 0,
              tamanho: 1,
              operacao: "INSERT",
            },
            controller.signal,
          ),
          consultarAuditoria(
            {
              pagina: 0,
              tamanho: 1,
              operacao: "UPDATE",
            },
            controller.signal,
          ),
        ]);

        if (controller.signal.aborted) {
          return;
        }

        setResumoOperacoes({
          INSERT: insercoes.totalElements ?? 0,
          UPDATE: atualizacoes.totalElements ?? 0,
        });
      } catch {
        if (!controller.signal.aborted) {
          setResumoOperacoes({
            INSERT: null,
            UPDATE: null,
          });
        }
      }
    }

    carregarResumo();

    return () => controller.abort();
  }, [recarregar]);

  function atualizarFiltro(campo, valor) {
    setFiltros((atuais) => ({
      ...atuais,
      [campo]: valor,
    }));

    setPagina(1);
  }

  function limparFiltros() {
    setFiltros({
      dataInicial: "",
      dataFinal: "",
      operacao: "",
      tabela: "",
    });

    setPagina(1);
  }

  function atualizarRegistros() {
    setRecarregar((atual) => atual + 1);
  }

  return (
    <>
      <main className="min-h-[calc(100vh-5rem)] bg-base-200/50 px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <header className="mb-7">
            <p className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-primary">
              <span className="h-[3px] w-8 rounded-full bg-primary" />
              Administração
            </p>

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h1 className="text-3xl font-black tracking-tight text-base-content sm:text-4xl">
                  Histórico de Auditoria
                </h1>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-base-content/65 sm:text-base">
                  Acompanhe operações realizadas, registros afetados e quem
                  executou cada ação.
                </p>
              </div>

              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={atualizarRegistros}
                disabled={carregando}
              >
                <i className="fa-solid fa-rotate" aria-hidden="true" />
                Atualizar
              </button>
            </div>
          </header>

          <div
            role="note"
            className="alert mb-6 border border-secondary bg-base-100 text-sm text-base-content shadow-sm"
          >
            <i
              className="fa-solid fa-circle-info text-primary"
              aria-hidden="true"
            />

            <span>
              O histórico apresenta registros reais de criação e alteração de
              status das solicitações de ONGs, armazenados automaticamente pelas
              triggers do banco de dados.
            </span>
          </div>

          <section
            aria-label="Resumo das operações"
            className="mb-6 grid gap-4 sm:grid-cols-2"
          >
            {operacoes.map((operacao) => (
              <CartaoResumo
                key={operacao}
                titulo={`${operacao} registrados`}
                total={resumoOperacoes[operacao] ?? "—"}
                icone={
                  operacao === "INSERT" ? "fa-circle-plus" : "fa-pen-to-square"
                }
                cor={
                  operacao === "INSERT"
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
                }
              />
            ))}
          </section>

          <section className="mb-6 rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-bold text-base-content">Filtros</h2>

                <p className="text-xs text-base-content/55">
                  Refine os registros por período, operação ou tabela.
                </p>
              </div>

              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={limparFiltros}
              >
                <i className="fa-solid fa-rotate-left" aria-hidden="true" />
                Limpar filtros
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <label className="form-control">
                <span className="label-text mb-1.5 text-xs font-bold">
                  Data inicial
                </span>

                <input
                  type="date"
                  className="input input-bordered w-full"
                  value={filtros.dataInicial}
                  max={filtros.dataFinal || undefined}
                  onChange={(event) =>
                    atualizarFiltro("dataInicial", event.target.value)
                  }
                />
              </label>

              <label className="form-control">
                <span className="label-text mb-1.5 text-xs font-bold">
                  Data final
                </span>

                <input
                  type="date"
                  className="input input-bordered w-full"
                  value={filtros.dataFinal}
                  min={filtros.dataInicial || undefined}
                  onChange={(event) =>
                    atualizarFiltro("dataFinal", event.target.value)
                  }
                />
              </label>

              <label className="form-control">
                <span className="label-text mb-1.5 text-xs font-bold">
                  Operação
                </span>

                <select
                  className="select select-bordered w-full"
                  value={filtros.operacao}
                  onChange={(event) =>
                    atualizarFiltro("operacao", event.target.value)
                  }
                >
                  <option value="">Todas as operações</option>

                  {operacoes.map((operacao) => (
                    <option key={operacao} value={operacao}>
                      {operacao}
                    </option>
                  ))}
                </select>
              </label>

              <label className="form-control">
                <span className="label-text mb-1.5 text-xs font-bold">
                  Tabela afetada
                </span>

                <select
                  className="select select-bordered w-full"
                  value={filtros.tabela}
                  onChange={(event) =>
                    atualizarFiltro("tabela", event.target.value)
                  }
                >
                  <option value="">Todas as tabelas</option>

                  {tabelas.map((tabela) => (
                    <option key={tabela} value={tabela}>
                      {tabela}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-base-300 px-5 py-4">
              <div>
                <h2 className="font-bold text-base-content">Registros</h2>

                <p className="text-xs text-base-content/55">
                  {totalRegistros}{" "}
                  {totalRegistros === 1
                    ? "registro encontrado"
                    : "registros encontrados"}
                </p>
              </div>

              <span className="text-xs text-base-content/55">
                Página {pagina} de {totalPaginas}
              </span>
            </div>

            {erro ? (
              <div role="alert" className="p-8 text-center">
                <i
                  className="fa-solid fa-triangle-exclamation mb-3 text-2xl text-error"
                  aria-hidden="true"
                />

                <p className="font-semibold text-base-content">
                  Erro ao carregar auditoria
                </p>

                <p className="mt-1 text-sm text-base-content/60">{erro}</p>

                <button
                  type="button"
                  className="btn btn-primary btn-sm mt-4"
                  onClick={atualizarRegistros}
                >
                  Tentar novamente
                </button>
              </div>
            ) : carregando ? (
              <div
                className="flex flex-col items-center justify-center gap-3 p-10"
                role="status"
              >
                <span className="loading loading-spinner loading-lg text-primary" />

                <p className="text-sm text-base-content/60">
                  Carregando registros de auditoria...
                </p>
              </div>
            ) : registrosPagina.length === 0 ? (
              <div className="p-8 text-center">
                <i
                  className="fa-solid fa-magnifying-glass mb-3 text-2xl text-base-content/35"
                  aria-hidden="true"
                />

                <p className="font-semibold text-base-content">
                  Nenhum registro encontrado
                </p>

                <p className="mt-1 text-sm text-base-content/60">
                  Tente ajustar ou limpar os filtros.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-zebra min-w-[980px]">
                  <thead className="bg-base-200 text-xs uppercase tracking-wide text-base-content/70">
                    <tr>
                      <th>Data e hora</th>
                      <th>Operação</th>
                      <th>Tabela</th>
                      <th>ID do registro</th>
                      <th>Responsável</th>
                      <th className="text-right">Detalhes</th>
                    </tr>
                  </thead>

                  <tbody>
                    {registrosPagina.map((registro) => (
                      <tr key={registro.id} className="hover">
                        <td className="whitespace-nowrap text-sm">
                          {formatarDataHora(registro.dataHora)}
                        </td>

                        <td>
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${
                              classeOperacao[registro.operacao] ?? ""
                            }`}
                          >
                            {registro.operacao}
                          </span>
                        </td>

                        <td>
                          <code className="rounded bg-base-200 px-2 py-1 text-xs">
                            {registro.tabela}
                          </code>
                        </td>

                        <td className="font-mono text-sm">
                          #{registro.registroId}
                        </td>

                        <td>
                          <p className="font-semibold">
                            {registro.ator?.nome ?? "Não identificado"}
                          </p>

                          <p className="text-xs text-base-content/55">
                            {registro.ator?.perfil ?? "Perfil não disponível"}
                          </p>
                        </td>

                        <td className="text-right">
                          <button
                            type="button"
                            className="btn btn-sm rounded-lg border-base-300 bg-base-100"
                            onClick={() => setRegistroSelecionado(registro)}
                            aria-label={`Ver detalhes do registro ${registro.id}`}
                          >
                            <i className="fa-solid fa-eye" aria-hidden="true" />
                            Visualizar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <footer className="flex flex-col gap-3 border-t border-base-300 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-base-content/55">
                Exibindo {registrosPagina.length} de {totalRegistros} registros
                filtrados
              </p>

              <div className="join self-end sm:self-auto">
                <button
                  type="button"
                  className="btn btn-sm join-item"
                  onClick={() => setPagina((atual) => Math.max(1, atual - 1))}
                  disabled={carregando || pagina <= 1}
                  aria-label="Página anterior"
                >
                  <i className="fa-solid fa-chevron-left" aria-hidden="true" />
                  Anterior
                </button>

                <button
                  type="button"
                  className="btn btn-sm join-item"
                  onClick={() =>
                    setPagina((atual) => Math.min(totalPaginas, atual + 1))
                  }
                  disabled={carregando || pagina >= totalPaginas}
                  aria-label="Próxima página"
                >
                  Próxima
                  <i className="fa-solid fa-chevron-right" aria-hidden="true" />
                </button>
              </div>
            </footer>
          </section>
        </div>
      </main>

      <Footer />

      {registroSelecionado && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-3 sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setRegistroSelecionado(null);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="detalhes-auditoria-titulo"
            className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-white/20 bg-base-100 shadow-2xl"
          >
            <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-base-300 bg-base-100 px-5 py-4 sm:px-7">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
                  Registro #{registroSelecionado.id}
                </p>

                <h2
                  id="detalhes-auditoria-titulo"
                  className="mt-1 text-xl font-black text-base-content sm:text-2xl"
                >
                  Detalhes da operação
                </h2>
              </div>

              <button
                type="button"
                className="btn btn-ghost btn-sm btn-square"
                onClick={() => setRegistroSelecionado(null)}
                aria-label="Fechar detalhes"
              >
                <i className="fa-solid fa-xmark" aria-hidden="true" />
              </button>
            </header>

            <div className="space-y-5 p-5 sm:p-7">
              <dl className="grid gap-4 rounded-2xl bg-base-200/60 p-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <dt className="text-xs font-bold uppercase text-base-content/50">
                    Data e hora
                  </dt>

                  <dd className="mt-1 text-sm font-semibold">
                    {formatarDataHora(registroSelecionado.dataHora)}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-bold uppercase text-base-content/50">
                    Operação
                  </dt>

                  <dd className="mt-1">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${
                        classeOperacao[registroSelecionado.operacao] ?? ""
                      }`}
                    >
                      {registroSelecionado.operacao}
                    </span>
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-bold uppercase text-base-content/50">
                    Tabela e ID afetados
                  </dt>

                  <dd className="mt-1 text-sm font-semibold">
                    {registroSelecionado.tabela} #
                    {registroSelecionado.registroId}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-bold uppercase text-base-content/50">
                    Responsável
                  </dt>

                  <dd className="mt-1 text-sm font-semibold">
                    {registroSelecionado.ator?.nome ?? "Não identificado"}
                  </dd>

                  <dd className="text-xs text-base-content/60">
                    {registroSelecionado.ator?.perfil ??
                      "Perfil não disponível"}{" "}
                    · ID {registroSelecionado.ator?.id ?? "Não informado"}
                  </dd>
                </div>

                <div className="sm:col-span-2 lg:col-span-4">
                  <dt className="text-xs font-bold uppercase text-base-content/50">
                    Ação
                  </dt>

                  <dd className="mt-1 text-sm text-base-content">
                    {registroSelecionado.acao}
                  </dd>
                </div>
              </dl>

              <div className="grid gap-4 lg:grid-cols-2">
                <SecaoDados
                  titulo="Dados anteriores"
                  dados={registroSelecionado.dadosAnteriores}
                  semDados="Não há dados anteriores registrados para este evento."
                />

                <SecaoDados
                  titulo="Dados novos"
                  dados={registroSelecionado.dadosNovos}
                  semDados="Não há novos dados registrados para este evento."
                />
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}