import { apiFetch } from "./Api";

/**
 * Cadastra um novo usuário.
 *
 * O backend espera multipart/form-data,
 * com os dados do usuário na parte "usuario".
 */
export async function cadastrarUsuario(dados) {
  const formData = new FormData();

  formData.append(
    "usuario",
    new Blob(
      [JSON.stringify(dados)],
      { type: "application/json" }
    )
  );

  return apiFetch("/api/usuarios", {
    method: "POST",
    body: formData,
  });
}