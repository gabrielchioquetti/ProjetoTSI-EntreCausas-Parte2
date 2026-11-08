const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// Obtém o token CSRF necessário para requisições que alteram dados.
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

// Realiza requisições à API mantendo a sessão autenticada.
export async function apiFetch(endpoint, options = {}) {
  const metodo = (options.method || "GET").toUpperCase();

  const headers = new Headers(options.headers || {});

  const metodosSeguros = ["GET", "HEAD", "OPTIONS", "TRACE"];

  // Envia o token CSRF nas requisições que modificam dados.
  if (!metodosSeguros.includes(metodo)) {
    headers.set("X-XSRF-TOKEN", await obterTokenCsrf());
  }

  const resposta = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    method: metodo,
    headers,
    credentials: "include",
  });

  // Respostas sem conteúdo, como HTTP 204.
  if (resposta.status === 204) {
    return null;
  }

  const tipoConteudo = resposta.headers.get("content-type") || "";

  // Identifica respostas JSON ou texto.
  const dados = tipoConteudo.includes("application/json")
    ? await resposta.json().catch(() => null)
    : await resposta
        .text()
        .then((texto) => (texto ? { mensagem: texto } : null));

  // Trata os erros retornados pelo backend.
  if (!resposta.ok) {
    const erro = new Error(
      dados?.mensagem ||
        dados?.detail ||
        "Não foi possível realizar a operação.",
    );

    // Permite identificar o código HTTP no frontend.
    erro.status = resposta.status;

    // Preserva os detalhes de validação retornados pela API.
    erro.detalhes = dados?.detalhes || {};

    throw erro;
  }

  return dados;
}