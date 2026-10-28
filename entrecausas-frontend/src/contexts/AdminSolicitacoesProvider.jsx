import { useMemo, useState } from "react";
import listaOngs from "../data/ongs";
import { AdminSolicitacoesContext } from "./adminSolicitacoesContext";

const statusInicialPorOng = {
  1: "pendente",
  2: "aprovada",
  3: "reprovada",
  4: "pendente",
  5: "aprovada",
  6: "reprovada",
  7: "pendente",
  8: "aprovada",
  9: "pendente",
};

function criarSolicitacoesDemonstracao() {
  return listaOngs.map((ong) => ({
    ...ong,
    status: statusInicialPorOng[ong.id] || "pendente",
    justificativaReprovacao: "",
  }));
}

export function AdminSolicitacoesProvider({ children }) {
  const [solicitacoes, setSolicitacoes] = useState(
    criarSolicitacoesDemonstracao,
  );
  const [notificacao, setNotificacao] = useState("");

  function atualizarStatus(id, status, justificativa = "") {
    setSolicitacoes((atuais) =>
      atuais.map((solicitacao) =>
        solicitacao.id === id
          ? { ...solicitacao, status, justificativaReprovacao: justificativa }
          : solicitacao,
      ),
    );

    setNotificacao(
      status === "aprovada"
        ? "Demonstração: ONG aprovada visualmente. Nenhum dado foi salvo."
        : "Demonstração: solicitação reprovada visualmente. Nenhum dado foi salvo.",
    );
  }

  const contexto = useMemo(
    () => ({ solicitacoes, atualizarStatus }),
    [solicitacoes],
  );

  return (
    <AdminSolicitacoesContext.Provider value={contexto}>
      {children}
      {notificacao && (
        <div
          role="status"
          aria-live="polite"
          className="alert alert-success fixed right-4 top-4 z-[120] w-[min(26rem,calc(100%-2rem))] border border-secondary bg-base-100 text-sm text-base-content shadow-lg"
        >
          <i className="fa-solid fa-circle-info text-primary" aria-hidden="true" />
          <span>{notificacao}</span>
          <button
            type="button"
            aria-label="Fechar notificação"
            title="Fechar"
            onClick={() => setNotificacao("")}
            className="btn btn-ghost btn-xs"
          >
            <i className="fa-solid fa-xmark" aria-hidden="true" />
          </button>
        </div>
      )}
    </AdminSolicitacoesContext.Provider>
  );
}
