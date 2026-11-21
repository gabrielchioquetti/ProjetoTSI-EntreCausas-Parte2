import { apiFetch } from "./Api";

/**
 * Cadastra um novo usuário.
 * O backend espera multipart/form-data, com os dados na parte "usuario".
 */
export async function cadastrarUsuario(dados) {
  const formData = new FormData();

  formData.append(
    "usuario",
    new Blob([JSON.stringify(dados)], { type: "application/json" }),
  );

  return apiFetch("/api/usuarios", {
    method: "POST",
    body: formData,
  });
}

/**
 * Lista todos os usuários.
 * Acesso exclusivo do MASTER.
 */
export async function listarUsuarios() {
  return apiFetch("/api/usuarios");
}

/**
 * Promove um usuário comum a administrador.
 * Acesso exclusivo do MASTER.
 */
export async function promoverUsuario(id) {
  return apiFetch(`/api/usuarios/${id}/promover`, {
    method: "PUT",
  });
}

/**
 * Rebaixa um administrador para usuário comum.
 * Acesso exclusivo do MASTER.
 */
export async function rebaixarUsuario(id) {
  return apiFetch(`/api/usuarios/${id}/rebaixar`, {
    method: "PUT",
  });
}