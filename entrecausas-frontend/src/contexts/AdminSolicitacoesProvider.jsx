import { useCallback, useEffect, useMemo, useState } from "react";
import { apiFetch } from "../services/Api.js";
import { useAuth } from "./AuthContext.jsx";
import { AdminSolicitacoesContext } from "./adminSolicitacoesContext";

// Endereço do backend utilizado para carregar as imagens.
const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:8080"
).replace(/\/$/, "");

// Normaliza os status retornados pelo backend.
function normalizarStatus(nomeStatus = "") {
  const status = String(nomeStatus || "")
    .trim()
    .toUpperCase();

  if (status === "APROVADO") return "aprovada";
  if (status === "REJEITADO") return "reprovada";

  return "pendente";
}

// Converte o nome da categoria para a identificação visual.
function normalizarCategoria(nome = "") {
  const categoria = String(nome || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const categorias = {
    educacao: "Educacao",
    solidariedade: "Solidariedade",
    cultura: "Cultura",
    animais: "Animais",
    "causa animal": "Animais",
    "meio ambiente": "MeioAmbiente",
    saude: "Saude",
    esporte: "Esporte",
  };

  return categorias[categoria] || nome;
}

// Constrói a URL da imagem armazenada no backend.
function obterUrlImagem(caminho) {
  if (!caminho) return "";

  if (/^https?:\/\//i.test(caminho)) {
    return caminho;
  }

  return `${API_URL}/${String(caminho).replace(/^\/+/, "")}`;
}

// Converte os dados básicos da solicitação.
function converterSolicitacao(solicitacao) {
  return {
    id: solicitacao.idSolicitacao,
    idOng: solicitacao.idOng,
    nome: solicitacao.nomeOng,
    idUsuario: solicitacao.idUsuario,
    nomeUsuario: solicitacao.nomeUsuario,
    idAdministrador: solicitacao.idAdministrador,
    nomeAdministrador: solicitacao.nomeAdministrador,
    idStatus: solicitacao.idStatus,
    status: normalizarStatus(solicitacao.nomeStatus),
    justificativaReprovacao: solicitacao.motivoRejeicao || "",
    dataAnalise: solicitacao.dataAnalise,
  };
}

// Converte os detalhes administrativos da ONG.
function converterDetalhesOng(detalhes) {
  const endereco = detalhes.endereco || {};

  const categorias = (detalhes.categorias || []).map((categoria) =>
    normalizarCategoria(categoria.nomeCategoria),
  );

  const descricoes = detalhes.descricoes || [];

  const descricaoCompleta = descricoes.find(
    (descricao) => descricao.tipoDescricao?.toUpperCase() === "SOBRE",
  );

  const descricaoCurta = descricoes.find(
    (descricao) => descricao.tipoDescricao?.toUpperCase() === "RESUMO",
  );

  const imagens = (detalhes.imagens || []).map((imagem) => ({
    id: imagem.idImagem,
    src: obterUrlImagem(imagem.caminho),
    alt: imagem.textoAlternativo || "",
  }));

  return {
    idOng: detalhes.idOng,
    nome: detalhes.nome || "",
    cnpj: detalhes.cnpj || "",
    telefone: detalhes.telefone || "",
    instagram: detalhes.instagram || "",

    cep: endereco.cep || "",
    logradouro: endereco.logradouro || "",
    numero: endereco.numero || "",
    complemento: endereco.complemento || "",
    bairro: endereco.bairro || "",
    cidade: endereco.cidade || "",
    estado: endereco.estado || "",

    localizacao: [endereco.cidade, endereco.estado].filter(Boolean).join(" - "),

    categorias,
    categoriaPrincipal: categorias[0] || "",

    descricao: descricaoCompleta?.texto || "",
    descricaoCurta: descricaoCurta?.texto || "",

    imagens,
  };
}

// Consulta os detalhes reais de cada ONG.
async function carregarDetalhesSolicitacoes(dados) {
  return Promise.all(
    dados.map(async (solicitacao) => {
      const solicitacaoConvertida = converterSolicitacao(solicitacao);

      if (solicitacao.idOng == null) {
        return solicitacaoConvertida;
      }

      const detalhes = await apiFetch(
        `/api/ongs/admin/${solicitacao.idOng}/detalhes`,
      );

      return {
        ...solicitacaoConvertida,
        ...converterDetalhesOng(detalhes),

        // Mantém o identificador da solicitação.
        id: solicitacaoConvertida.id,
      };
    }),
  );
}

export function AdminSolicitacoesProvider({ children }) {
  const { usuario, carregando: carregandoSessao } = useAuth();

  const [solicitacoes, setSolicitacoes] = useState([]);
  const [notificacao, setNotificacao] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [statusOpcoes, setStatusOpcoes] = useState([]);

  // Apenas administradores podem analisar solicitações.
  const ehAdministrador =
    usuario?.funcaoNome?.trim().toUpperCase() === "ADMINISTRADOR";

  // Atualiza as solicitações com os dados reais das ONGs.
  const carregarSolicitacoes = useCallback(async () => {
    if (!ehAdministrador) return;

    setCarregando(true);
    setErro("");

    try {
      const dados = await apiFetch("/api/solicitacoes");

      const solicitacoesCompletas = await carregarDetalhesSolicitacoes(dados);

      setSolicitacoes(solicitacoesCompletas);
    } catch (erroConsulta) {
      setErro(
        erroConsulta.message || "Ocorreu um erro ao carregar as solicitações.",
      );
    } finally {
      setCarregando(false);
    }
  }, [ehAdministrador]);

  // Carrega as informações ao iniciar a sessão administrativa.
  useEffect(() => {
    if (carregandoSessao || !ehAdministrador) {
      return;
    }

    let ativo = true;

    async function inicializar() {
      setCarregando(true);
      setErro("");

      try {
        const [solicitacoesApi, statusApi] = await Promise.all([
          apiFetch("/api/solicitacoes"),
          apiFetch("/api/solicitacoes/status-opcoes"),
        ]);

        const solicitacoesCompletas =
          await carregarDetalhesSolicitacoes(solicitacoesApi);

        if (!ativo) return;

        setSolicitacoes(solicitacoesCompletas);
        setStatusOpcoes(statusApi);
      } catch (erroConsulta) {
        if (!ativo) return;

        setErro(
          erroConsulta.message || "Não foi possível carregar as solicitações.",
        );
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    inicializar();

    return () => {
      ativo = false;
    };
  }, [carregandoSessao, ehAdministrador]);

  // Aprova ou rejeita uma solicitação pendente.
  const atualizarStatus = useCallback(
    async (id, status, justificativa = "") => {
      if (!ehAdministrador) {
        throw new Error("Apenas administradores podem analisar solicitações.");
      }

      if (!["aprovada", "reprovada"].includes(status)) {
        throw new Error("Status de análise inválido.");
      }

      const solicitacaoAtual = solicitacoes.find(
        (solicitacao) => String(solicitacao.id) === String(id),
      );

      if (!solicitacaoAtual) {
        throw new Error("Solicitação não encontrada.");
      }

      if (solicitacaoAtual.status !== "pendente") {
        throw new Error("Somente solicitações pendentes podem ser analisadas.");
      }

      const nomeStatus = status === "aprovada" ? "APROVADO" : "REJEITADO";

      const statusEncontrado = statusOpcoes.find(
        (opcao) => opcao.nome?.trim().toUpperCase() === nomeStatus,
      );

      if (!statusEncontrado) {
        throw new Error(`O status ${nomeStatus} não foi encontrado.`);
      }

      if (nomeStatus === "REJEITADO" && !justificativa.trim()) {
        throw new Error("Informe o motivo da rejeição.");
      }

      const atualizada = await apiFetch(`/api/solicitacoes/${id}/analise`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idStatus: statusEncontrado.idStatus,
          motivoRejeicao:
            nomeStatus === "REJEITADO" ? justificativa.trim() : null,
        }),
      });

      const solicitacaoAtualizada = converterSolicitacao(atualizada);

      // Preserva os detalhes da ONG após a análise.
      setSolicitacoes((atuais) =>
        atuais.map((solicitacao) =>
          String(solicitacao.id) === String(id)
            ? {
                ...solicitacao,
                ...solicitacaoAtualizada,
              }
            : solicitacao,
        ),
      );

      setNotificacao(
        nomeStatus === "APROVADO"
          ? "Solicitação aprovada com sucesso."
          : "Solicitação rejeitada com sucesso.",
      );

      return atualizada;
    },
    [ehAdministrador, solicitacoes, statusOpcoes],
  );

  // Disponibiliza os dados para a página administrativa.
  const contexto = useMemo(
    () => ({
      solicitacoes: ehAdministrador ? solicitacoes : [],
      atualizarStatus,
      carregarSolicitacoes,
      carregando: carregandoSessao || (ehAdministrador && carregando),
      erro: ehAdministrador ? erro : "",
      statusOpcoes: ehAdministrador ? statusOpcoes : [],
    }),
    [
      solicitacoes,
      atualizarStatus,
      carregarSolicitacoes,
      carregandoSessao,
      carregando,
      ehAdministrador,
      erro,
      statusOpcoes,
    ],
  );

  return (
    <AdminSolicitacoesContext.Provider value={contexto}>
      {children}

      {notificacao && ehAdministrador && (
        <div
          role="status"
          aria-live="polite"
          className="alert alert-success fixed right-4 top-4 z-[120] w-[min(26rem,calc(100%-2rem))] border border-secondary bg-base-100 text-sm text-base-content shadow-lg"
        >
          <i
            className="fa-solid fa-circle-info text-primary"
            aria-hidden="true"
          />

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