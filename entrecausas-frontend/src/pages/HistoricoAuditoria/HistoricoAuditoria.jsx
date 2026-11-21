import { useMemo, useState } from "react";
import Footer from "../../components/Footer/Footer.jsx";

const registrosAuditoria = [
  {
    id: 501,
    dataHora: "2026-11-20T14:22:00-03:00",
    operacao: "UPDATE",
    tabela: "solicitacao",
    registroId: 84,
    acao: "Aprovou o cadastro da ONG Instituto Caminhos",
    ator: { nome: "Marina Costa", perfil: "ADMINISTRADOR", id: 12 },
    dadosAnteriores: {
      status: "PENDENTE",
      idAdministrador: null,
      motivoRejeicao: null,
    },
    dadosNovos: {
      status: "APROVADO",
      idAdministrador: 12,
      motivoRejeicao: null,
    },
  },
  {
    id: 500,
    dataHora: "2026-11-20T14:21:58-03:00",
    operacao: "INSERT",
    tabela: "ong",
    registroId: 29,
    acao: "Cadastro publicado após aprovação",
    ator: { nome: "Marina Costa", perfil: "ADMINISTRADOR", id: 12 },
    dadosAnteriores: null,
    dadosNovos: {
      nome: "Instituto Caminhos",
      cidade: "Itapetininga",
      status: "ATIVA",
    },
  },
  {
    id: 499,
    dataHora: "2026-11-20T13:46:11-03:00",
    operacao: "INSERT",
    tabela: "solicitacao",
    registroId: 84,
    acao: "Enviou cadastro da ONG Instituto Caminhos para análise",
    ator: { nome: "Rafael Nunes", perfil: "USUARIO", id: 208 },
    dadosAnteriores: null,
    dadosNovos: {
      tipoSolicitacao: "CADASTRO",
      idOng: 29,
      status: "PENDENTE",
    },
  },
  {
    id: 498,
    dataHora: "2026-11-20T11:05:42-03:00",
    operacao: "UPDATE",
    tabela: "usuario",
    registroId: 4,
    acao: "Alterou o perfil de usuário para administrador",
    ator: { nome: "Conta Master", perfil: "MASTER", id: 1 },
    dadosAnteriores: { funcao: "USUARIO" },
    dadosNovos: { funcao: "ADMINISTRADOR" },
  },
  {
    id: 497,
    dataHora: "2026-11-19T16:38:09-03:00",
    operacao: "UPDATE",
    tabela: "solicitacao",
    registroId: 82,
    acao: "Rejeitou o cadastro da ONG Patas Unidas",
    ator: { nome: "Marina Costa", perfil: "ADMINISTRADOR", id: 12 },
    dadosAnteriores: {
      status: "PENDENTE",
      idAdministrador: null,
      motivoRejeicao: null,
    },
    dadosNovos: {
      status: "REJEITADO",
      idAdministrador: 12,
      motivoRejeicao: "Documentação incompleta.",
    },
  },
  {
    id: 496,
    dataHora: "2026-11-19T15:22:31-03:00",
    operacao: "INSERT",
    tabela: "ong_categoria",
    registroId: 63,
    acao: "Vinculou categoria à ONG Rede Aprender",
    ator: { nome: "Marina Costa", perfil: "ADMINISTRADOR", id: 12 },
    dadosAnteriores: null,
    dadosNovos: { idOng: 27, categoria: "Educação" },
  },
  {
    id: 495,
    dataHora: "2026-11-19T15:20:03-03:00",
    operacao: "UPDATE",
    tabela: "ong",
    registroId: 27,
    acao: "Atualizou dados da ONG Rede Aprender",
    ator: { nome: "Marina Costa", perfil: "ADMINISTRADOR", id: 12 },
    dadosAnteriores: { telefone: "(15) 3000-0000", cidade: "Tatuí" },
    dadosNovos: { telefone: "(15) 3000-0012", cidade: "Itapetininga" },
  },
  {
    id: 494,
    dataHora: "2026-11-18T10:14:55-03:00",
    operacao: "DELETE",
    tabela: "imagem",
    registroId: 136,
    acao: "Removeu imagem recusada da ONG Sementes do Amanhã",
    ator: { nome: "Conta Master", perfil: "MASTER", id: 1 },
    dadosAnteriores: {
      idOng: 24,
      arquivo: "documento-antigo.jpg",
      motivo: "Arquivo duplicado",
    },
    dadosNovos: null,
  },
  {
    id: 493,
    dataHora: "2026-11-18T09:52:17-03:00",
    operacao: "INSERT",
    tabela: "usuario",
    registroId: 208,
    acao: "Criou uma conta de usuário",
    ator: { nome: "Rafael Nunes", perfil: "USUARIO", id: 208 },
    dadosAnteriores: null,
    dadosNovos: { nome: "Rafael Nunes", funcao: "USUARIO" },
  },
  {
    id: 492,
    dataHora: "2026-11-17T17:03:28-03:00",
    operacao: "UPDATE",
    tabela: "solicitacao",
    registroId: 80,
    acao: "Aprovou edição da ONG Casa do Bem",
    ator: { nome: "Marina Costa", perfil: "ADMINISTRADOR", id: 12 },
    dadosAnteriores: { status: "PENDENTE", tipoSolicitacao: "EDICAO" },
    dadosNovos: {
      status: "APROVADO",
      tipoSolicitacao: "EDICAO",
      idAdministrador: 12,
    },
  },
  {
    id: 491,
    dataHora: "2026-11-17T13:40:00-03:00",
    operacao: "DELETE",
    tabela: "ong",
    registroId: 18,
    acao: "Excluiu ONG após aprovação da solicitação",
    ator: { nome: "Conta Master", perfil: "MASTER", id: 1 },
    dadosAnteriores: {
      nome: "Projeto Viver",
      status: "EXCLUSAO_APROVADA",
    },
    dadosNovos: null,
  },
  {
    id: 490,
    dataHora: "2026-11-16T08:18:43-03:00",
    operacao: "UPDATE",
    tabela: "descricao",
    registroId: 72,
    acao: "Atualizou a descrição da ONG Casa do Bem",
    ator: { nome: "Joana Lima", perfil: "ONG", id: 34 },
    dadosAnteriores: { tipo: "RESUMO", texto: "Apoio à comunidade." },
    dadosNovos: {
      tipo: "RESUMO",
      texto: "Apoio e atividades para famílias da comunidade.",
    },
  },
];

const operacoes = ["INSERT", "UPDATE", "DELETE"];

const classeOperacao = {
  INSERT: "border-green-200 bg-green-50 text-green-800",
  UPDATE: "border-blue-200 bg-blue-50 text-blue-800",
  DELETE: "border-red-200 bg-red-50 text-red-800",
};

const formatoDataHora = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "medium",
});

function formatarDataHora(dataHora) {
  return formatoDataHora.format(new Date(dataHora));
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
  const itensPorPagina = 6;

  const tabelas = useMemo(
    () => [...new Set(registrosAuditoria.map((registro) => registro.tabela))].sort(),
    [],
  );

  const registrosFiltrados = useMemo(
    () =>
      registrosAuditoria.filter((registro) => {
        const data = registro.dataHora.slice(0, 10);

        return (
          (!filtros.dataInicial || data >= filtros.dataInicial) &&
          (!filtros.dataFinal || data <= filtros.dataFinal) &&
          (!filtros.operacao || registro.operacao === filtros.operacao) &&
          (!filtros.tabela || registro.tabela === filtros.tabela)
        );
      }),
    [filtros],
  );

  const totalPaginas = Math.max(
    1,
    Math.ceil(registrosFiltrados.length / itensPorPagina),
  );
  const registrosPagina = registrosFiltrados.slice(
    (pagina - 1) * itensPorPagina,
    pagina * itensPorPagina,
  );
  const resumoOperacoes = operacoes.map((operacao) => ({
    operacao,
    total: registrosAuditoria.filter(
      (registro) => registro.operacao === operacao,
    ).length,
  }));

  function atualizarFiltro(campo, valor) {
    setFiltros((atuais) => ({ ...atuais, [campo]: valor }));
    setPagina(1);
  }

  function limparFiltros() {
    setFiltros({ dataInicial: "", dataFinal: "", operacao: "", tabela: "" });
    setPagina(1);
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
              <span className="badge badge-outline h-auto gap-2 px-3 py-2 text-xs font-semibold">
                <i className="fa-solid fa-flask text-primary" aria-hidden="true" />
                Dados demonstrativos
              </span>
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
              Esta tela usa registros fictícios para demonstração; ainda não
              está conectada às triggers ou a uma API de auditoria.
            </span>
          </div>

          <section
            aria-label="Resumo das operações"
            className="mb-6 grid gap-4 sm:grid-cols-3"
          >
            {resumoOperacoes.map(({ operacao, total }) => (
              <CartaoResumo
                key={operacao}
                titulo={`${operacao} registrados`}
                total={total}
                icone={
                  operacao === "INSERT"
                    ? "fa-circle-plus"
                    : operacao === "UPDATE"
                      ? "fa-pen-to-square"
                      : "fa-trash-can"
                }
                cor={
                  operacao === "INSERT"
                    ? "bg-green-100 text-green-700"
                    : operacao === "UPDATE"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-red-100 text-red-700"
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
                  {registrosFiltrados.length}{" "}
                  {registrosFiltrados.length === 1
                    ? "registro encontrado"
                    : "registros encontrados"}
                </p>
              </div>
              <span className="text-xs text-base-content/55">
                Página {pagina} de {totalPaginas}
              </span>
            </div>

            {registrosPagina.length === 0 ? (
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
                            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${classeOperacao[registro.operacao]}`}
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
                          <p className="font-semibold">{registro.ator.nome}</p>
                          <p className="text-xs text-base-content/55">
                            {registro.ator.perfil}
                          </p>
                        </td>
                        <td className="text-right">
                          <button
                            type="button"
                            className="btn btn-sm rounded-lg border-base-300 bg-base-100"
                            onClick={() => setRegistroSelecionado(registro)}
                            aria-label={`Ver detalhes do registro ${registro.id}`}
                          >
                            <i
                              className="fa-solid fa-eye"
                              aria-hidden="true"
                            />
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
                Exibindo {registrosPagina.length} de {registrosFiltrados.length}{" "}
                registros filtrados
              </p>
              <div className="join self-end sm:self-auto">
                <button
                  type="button"
                  className="btn btn-sm join-item"
                  onClick={() => setPagina((atual) => Math.max(1, atual - 1))}
                  disabled={pagina <= 1}
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
                  disabled={pagina >= totalPaginas}
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
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${classeOperacao[registroSelecionado.operacao]}`}
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
                    {registroSelecionado.ator.nome}
                  </dd>
                  <dd className="text-xs text-base-content/60">
                    {registroSelecionado.ator.perfil} · ID{" "}
                    {registroSelecionado.ator.id}
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
                  semDados="Não havia dados anteriores (registro inserido)."
                />
                <SecaoDados
                  titulo="Dados novos"
                  dados={registroSelecionado.dadosNovos}
                  semDados="Não há novos dados (registro removido)."
                />
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
