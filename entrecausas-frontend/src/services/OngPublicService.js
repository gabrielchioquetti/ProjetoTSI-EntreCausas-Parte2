import { apiFetch } from "./Api";

// =========================================================
// ADAPTAÇÃO DOS DADOS DA API
// =========================================================

export function adaptarOng(dados) {
  const categorias = (dados.categorias || [])
    .map((categoria) => categoria.nomeCategoria)
    .filter(Boolean);

  const descricoes = dados.descricoes || [];

  const descricaoCurta = descricoes.find(
    (descricao) => descricao.tipoDescricao === "RESUMO",
  );

  const descricaoCompleta = descricoes.find(
    (descricao) => descricao.tipoDescricao === "SOBRE",
  );

  const endereco = dados.endereco;

  const localizacao = endereco
    ? [endereco.cidade, endereco.estado].filter(Boolean).join(" - ")
    : "";

  const API_URL = (
    import.meta.env.VITE_API_URL || "http://localhost:8080"
  ).replace(/\/$/, "");

  const imagens = (dados.imagens || []).map((imagem) => ({
    src: imagem.caminho
      ? `${API_URL}${imagem.caminho}`
      : "/img/default/ongs.png",
    alt: imagem.textoAlternativo || `Imagem da ONG ${dados.nome}`,
  }));

  return {
    id: dados.idOng,
    nome: dados.nome,
    instagram: dados.instagram,
    categoriaPrincipal: categorias[0] || "",
    categorias,
    descricao: descricaoCurta?.texto || descricaoCompleta?.texto || "",
    descricaoCompleta: descricaoCompleta?.texto || "",
    localizacao,
    imagens,
  };
}

// =========================================================
// LISTAGEM PÚBLICA DAS ONGS
// =========================================================

export async function listarOngsPublicas() {
  const dados = await apiFetch("/api/ongs");

  if (!Array.isArray(dados)) {
    throw new Error("Formato inválido na resposta da API de ONGs.");
  }

  return dados.map(adaptarOng);
}