import { useContext } from "react";
import { AdminSolicitacoesContext } from "./adminSolicitacoesContext";

export function useAdminSolicitacoes() {
  const contexto = useContext(AdminSolicitacoesContext);

  if (!contexto) {
    throw new Error(
      "useAdminSolicitacoes deve ser usado dentro de AdminSolicitacoesProvider.",
    );
  }

  return contexto;
}
