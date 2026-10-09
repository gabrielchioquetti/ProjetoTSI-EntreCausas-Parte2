const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

/**
 * Obtém o token CSRF fornecido pelo backend.
 *
 * O token protege as requisições que alteram dados.
 */
async function obterTokenCsrf() {
  const resposta = await fetch(`${API_URL}/api/auth/csrf`, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  const dados = await resposta.json().catch(() => null);

  if (!resposta.ok || !dados?.token) {
    throw new Error("Não foi possível validar a segurança da requisição.");
  }

  return dados.token;
}

/**
 * Realiza uma requisição para o backend.
 *
 * Centraliza o envio da sessão, a proteção CSRF,
 * o tratamento das respostas e os erros da API.
 */
export async function apiFetch(endpoint, options = {}) {
  const metodo = (options.method || "GET").toUpperCase();

  const headers = new Headers(options.headers || {});

  // Métodos que não modificam dados não exigem token CSRF.
  const metodosSeguros = ["GET", "HEAD", "OPTIONS", "TRACE"];

  if (!metodosSeguros.includes(metodo)) {
    const tokenCsrf = await obterTokenCsrf();

    headers.set("X-XSRF-TOKEN", tokenCsrf);
  }

  const resposta = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    method: metodo,
    headers,

    // Envia o cookie da sessão ao backend.
    credentials: "include",
  });

  // Trata respostas sem conteúdo, como o logout.
  if (resposta.status === 204) {
    return null;
  }

  // Aceita JSON e respostas textuais.
  const tipoConteudo = resposta.headers.get("content-type") || "";

  const dados = tipoConteudo.includes("application/json")
    ? await resposta.json().catch(() => null)
    : await resposta
        .text()
        .then((texto) => (texto ? { mensagem: texto } : null));

  // Converte erros HTTP em exceções.
  if (!resposta.ok) {
    const erro = new Error(
      dados?.mensagem ||
        dados?.detail ||
        "Não foi possível realizar a operação.",
    );

    // Preserva os erros específicos dos campos.
    erro.detalhes = dados?.detalhes || {};

    throw erro;
  }

  return dados;
}
