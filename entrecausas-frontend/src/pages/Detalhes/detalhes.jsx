import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";

import DetalhesOng from "../../components/DetalhesOng/DetalhesOng";
import Footer from "../../components/Footer/Footer";

import BackToTop from "../../components/Acessibilidade/BackToTop";
import VLibras from "../../components/Acessibilidade/VLibras";
import UserWay from "../../components/Acessibilidade/UserWay";
import Ongs from "../../components/Ongs/Ongs";

import { apiFetch } from "../../services/Api.js";

// Endereço do backend responsável por disponibilizar as imagens.
const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:8080"
).replace(/\/$/, "");

// Converte os dados da API para o formato utilizado pelo DetalhesOng.
function adaptarOng(dados) {
  const descricoes = dados.descricoes || [];
  const categorias = dados.categorias || [];
  const endereco = dados.endereco;

  // Identifica as descrições cadastradas no backend.
  const resumo = descricoes.find((item) => item.tipoDescricao === "RESUMO");

  const sobre = descricoes.find((item) => item.tipoDescricao === "SOBRE");

  // Converte as categorias para uma lista de nomes.
  const nomesCategorias = categorias
    .map((item) => item.nomeCategoria)
    .filter(Boolean);

  // Monta a localização a partir do endereço.
  const localizacao = endereco
    ? [
        endereco.logradouro,
        endereco.numero,
        endereco.bairro,
        endereco.cidade,
        endereco.estado,
      ]
        .filter(Boolean)
        .join(", ")
    : "";

  // Converte as imagens para o formato da galeria.
  const imagens = (dados.imagens || []).map((imagem) => {
    const caminho = imagem.caminho || "";

    // Mantém URLs completas e adiciona o backend aos caminhos relativos.
    const src = /^https?:\/\//i.test(caminho)
      ? caminho
      : caminho
        ? `${API_URL}${caminho.startsWith("/") ? "" : "/"}${caminho}`
        : "/img/default/ongs.png";

    return {
      src,
      alt: imagem.textoAlternativo || `Imagem da ${dados.nome}`,
    };
  });

  // Normaliza o link do Instagram.
  const instagram = dados.instagram?.trim();

  const linkInstagram = instagram
    ? instagram.startsWith("http://") || instagram.startsWith("https://")
      ? instagram
      : `https://www.instagram.com/${instagram.replace(/^@/, "")}`
    : null;

  return {
    id: dados.idOng,
    nome: dados.nome,
    imagens,
    categoriaPrincipal: nomesCategorias[0] || "ONG",
    categorias: nomesCategorias,
    localizacao,
    descricao: resumo?.texto || sobre?.texto || "",
    descricaoCompleta: sobre?.texto || "",
    instagram: linkInstagram,
    statusSolicitacao: dados.statusSolicitacao,
    dataAnalise: dados.dataAnalise,
    motivoRejeicao: dados.motivoRejeicao,
    publicada: dados.publicada === true,
  };
}

// Formata a data recebida do backend.
function formatarData(data) {
  if (!data) return null;

  const dataFormatada = new Date(data);

  if (Number.isNaN(dataFormatada.getTime())) {
    return null;
  }

  return dataFormatada.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// Exibe o acompanhamento da solicitação da ONG.
function StatusMinhaOng({ ong }) {
  const status = ong.statusSolicitacao?.toUpperCase();
  const publicada = ong.publicada === true;

  const configuracoes = {
    PENDENTE: {
      titulo: "Aguardando análise",
      descricao:
        "Sua ONG foi cadastrada e está aguardando a análise da equipe do EntreCausas.",
      estilo: "border-warning/30 bg-warning/10",
      icone: "fa-solid fa-clock",
    },

    APROVADO: {
      titulo: "ONG aprovada",
      descricao: "Sua solicitação foi aprovada pela equipe do EntreCausas.",
      estilo: "border-success/30 bg-success/10",
      icone: "fa-solid fa-circle-check",
    },

    APROVADA: {
      titulo: "ONG aprovada",
      descricao: "Sua solicitação foi aprovada pela equipe do EntreCausas.",
      estilo: "border-success/30 bg-success/10",
      icone: "fa-solid fa-circle-check",
    },

    REJEITADO: {
      titulo: "Solicitação rejeitada",
      descricao:
        "Sua solicitação foi rejeitada. Confira o motivo informado pela equipe responsável.",
      estilo: "border-error/30 bg-error/10",
      icone: "fa-solid fa-circle-exclamation",
    },

    REJEITADA: {
      titulo: "Solicitação rejeitada",
      descricao:
        "Sua solicitação foi rejeitada. Confira o motivo informado pela equipe responsável.",
      estilo: "border-error/30 bg-error/10",
      icone: "fa-solid fa-circle-exclamation",
    },

    REPROVADA: {
      titulo: "Solicitação reprovada",
      descricao:
        "Sua solicitação foi reprovada. Confira o motivo informado pela equipe responsável.",
      estilo: "border-error/30 bg-error/10",
      icone: "fa-solid fa-circle-exclamation",
    },
  };

  const configuracaoPadrao = configuracoes[status] || {
    titulo: "Situação da solicitação",
    descricao: status
      ? `Status atual: ${status}`
      : "Não foi possível identificar o status da solicitação.",
    estilo: "border-base-300 bg-base-200",
    icone: "fa-solid fa-circle-info",
  };

  // Diferencia o estado da publicação da última solicitação.
  const configuracao =
    publicada && status === "PENDENTE"
      ? {
          titulo: "Alteração aguardando análise",
          descricao:
            "Sua ONG continua publicada no EntreCausas. As alterações enviadas serão aplicadas após a aprovação da equipe.",
          estilo: "border-warning/30 bg-warning/10",
          icone: "fa-solid fa-clock",
        }
      : publicada && ["REJEITADO", "REJEITADA", "REPROVADA"].includes(status)
        ? {
            titulo: "Alteração rejeitada",
            descricao:
              "Sua ONG continua publicada com os dados anteriores. Confira o motivo da rejeição da alteração.",
            estilo: "border-error/30 bg-error/10",
            icone: "fa-solid fa-circle-exclamation",
          }
        : configuracaoPadrao;

  const dataAnalise = formatarData(ong.dataAnalise);

  return (
    <section aria-labelledby="titulo-status-ong" className="bg-base-100 pt-10">
      <div className="mx-auto w-full max-w-7xl px-15">
        <div className={`rounded-2xl border p-6 ${configuracao.estilo}`}>
          <div className="flex items-start gap-4">
            <i
              className={`${configuracao.icone} mt-1 text-2xl`}
              aria-hidden="true"
            />

            <div className="flex-1">
              <h2
                id="titulo-status-ong"
                className="text-xl font-black text-base-content"
              >
                {configuracao.titulo}
              </h2>

              <p className="mt-2 text-base-content/70">
                {configuracao.descricao}
              </p>

              {/* Orienta a correção de cadastros rejeitados. */}
              {!publicada &&
                ["REJEITADO", "REJEITADA", "REPROVADA"].includes(status) && (
                  <p className="mt-3 text-sm text-base-content/70">
                    Você pode corrigir os dados da sua organização e enviar uma
                    nova solicitação para análise.
                  </p>
                )}

              {dataAnalise && (
                <p className="mt-3 text-sm text-base-content/70">
                  <strong>Data da análise:</strong> {dataAnalise}
                </p>
              )}

              {ong.motivoRejeicao &&
                ["REJEITADO", "REJEITADA", "REPROVADA"].includes(status) && (
                  <p className="mt-3 text-sm text-base-content/70">
                    <strong>Motivo da rejeição:</strong> {ong.motivoRejeicao}
                  </p>
                )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Detalhes() {
  const { pathname, search } = useLocation();

  const minhaOrganizacao = pathname === "/minha-organizacao";

  const parametros = new URLSearchParams(search);
  const id = Number(parametros.get("id"));

  const idPublicoValido =
    parametros.has("id") && Number.isSafeInteger(id) && id > 0;

  // Estados utilizados na página pública.
  const [ongPublica, setOngPublica] = useState(null);
  const [carregandoPublica, setCarregandoPublica] = useState(false);
  const [erroPublica, setErroPublica] = useState("");
  const [ongNaoEncontrada, setOngNaoEncontrada] = useState(false);

  // Estados utilizados somente na página Minha ONG.
  const [minhaOng, setMinhaOng] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  // =========================================================
  // CARREGAMENTO DOS DETALHES PÚBLICOS
  // =========================================================

  useEffect(() => {
    if (minhaOrganizacao) return;

    let ativo = true;

    async function carregarOngPublica() {
      setCarregandoPublica(true);
      setErroPublica("");
      setOngNaoEncontrada(false);
      setOngPublica(null);

      if (!idPublicoValido) {
        setOngNaoEncontrada(true);
        setCarregandoPublica(false);
        return;
      }

      try {
        const dados = await apiFetch(`/api/ongs/${id}`);

        if (!ativo) return;

        if (!dados) {
          setOngNaoEncontrada(true);
          return;
        }

        setOngPublica(adaptarOng(dados));
      } catch (error) {
        if (!ativo) return;

        // O endpoint público retorna 404 para ONGs
        // inexistentes ou não disponíveis publicamente.
        if (error.status === 404) {
          setOngNaoEncontrada(true);
        } else {
          setErroPublica(
            error.message || "Não foi possível carregar os detalhes da ONG.",
          );
        }
      } finally {
        if (ativo) {
          setCarregandoPublica(false);
        }
      }
    }

    carregarOngPublica();

    return () => {
      ativo = false;
    };
  }, [minhaOrganizacao, id, idPublicoValido]);

  // =========================================================
  // CARREGAMENTO DA ONG DO USUÁRIO
  // =========================================================

  useEffect(() => {
    if (!minhaOrganizacao) return;

    let ativo = true;

    // Consulta a ONG vinculada à sessão autenticada.
    async function carregarMinhaOng() {
      setCarregando(true);
      setErro("");
      setMinhaOng(null);

      try {
        const dados = await apiFetch("/api/ongs/minha");

        if (!ativo) return;

        // O backend retorna 204 quando não existe ONG.
        if (dados === null) {
          setMinhaOng(null);
          return;
        }

        setMinhaOng(adaptarOng(dados));
      } catch (error) {
        if (!ativo) return;

        setErro(
          error.message || "Não foi possível carregar os dados da sua ONG.",
        );
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarMinhaOng();

    // Evita atualizações após desmontar o componente.
    return () => {
      ativo = false;
    };
  }, [minhaOrganizacao]);

  // Seleciona a ONG de acordo com a rota.
  const ong = minhaOrganizacao ? minhaOng : ongPublica;

  return (
    <div className="page-interna min-h-screen bg-base-100">
      {/* Acessibilidade */}
      <a
        href="#conteudo-principal"
        className="
          sr-only
          focus:not-sr-only
          focus:fixed
          focus:left-4
          focus:top-4
          focus:z-[9999]
          focus:rounded-md
          focus:bg-base-100
          focus:px-4
          focus:py-2
          focus:text-primary
          focus:shadow-lg
        "
      >
        Pular para o conteúdo principal
      </a>

      <div id="site">
        <div id="nav-hover-zone" aria-hidden="true"></div>

        {/* ÚNICO MAIN DA PÁGINA */}
        <main id="conteudo-principal">
          {minhaOrganizacao ? (
            <>
              {/* Carregamento dos dados da ONG */}
              {carregando ? (
                <section className="bg-base-100 py-20" aria-live="polite">
                  <div className="mx-auto w-full max-w-7xl px-15">
                    <div className="flex flex-col items-center gap-4">
                      <span
                        className="loading loading-spinner loading-lg text-primary"
                        aria-hidden="true"
                      ></span>

                      <p className="text-base-content/70">
                        Carregando sua organização...
                      </p>
                    </div>
                  </div>
                </section>
              ) : erro ? (
                /* Erro ao consultar o backend */
                <section className="bg-base-100 py-20">
                  <div className="mx-auto w-full max-w-7xl px-15">
                    <div
                      role="alert"
                      className="rounded-2xl border border-error/30 bg-base-100 p-10"
                    >
                      <h1 className="mb-3 text-3xl font-black">
                        Não foi possível carregar sua ONG
                      </h1>

                      <p className="text-base-content/70">{erro}</p>
                    </div>
                  </div>
                </section>
              ) : ong ? (
                /* Exibe a ONG do usuário autenticado */
                <>
                  <StatusMinhaOng ong={ong} />

                  <DetalhesOng key={ong.id} ong={ong} />
                </>
              ) : (
                /* Usuário ainda não possui ONG */
                <section className="bg-base-100 py-20">
                  <div className="mx-auto w-full max-w-7xl px-15">
                    <div className="rounded-2xl border border-base-300 bg-base-100 p-10">
                      <h1 className="mb-3 text-3xl font-black">
                        Minha organização
                      </h1>

                      <p className="mb-6 text-base-content/60">
                        Você ainda não possui uma ONG cadastrada no EntreCausas.
                        Cadastre sua organização para solicitar a divulgação na
                        plataforma.
                      </p>

                      <Link to="/formulario-ong" className="btn btn-primary">
                        <i className="fa-solid fa-plus" aria-hidden="true"></i>
                        Cadastrar minha ONG
                      </Link>
                    </div>
                  </div>
                </section>
              )}
            </>
          ) : (
            /* Detalhes públicos da ONG */
            <>
              {carregandoPublica ? (
                <section className="bg-base-100 py-20" aria-live="polite">
                  <div className="mx-auto w-full max-w-7xl px-15">
                    <div className="flex flex-col items-center gap-4">
                      <span
                        className="loading loading-spinner loading-lg text-primary"
                        aria-hidden="true"
                      ></span>

                      <p className="text-base-content/70">
                        Carregando organização...
                      </p>
                    </div>
                  </div>
                </section>
              ) : erroPublica ? (
                <section className="bg-base-100 py-20">
                  <div className="mx-auto w-full max-w-7xl px-15">
                    <div
                      role="alert"
                      className="rounded-2xl border border-error/30 bg-base-100 p-10"
                    >
                      <h1 className="mb-3 text-3xl font-black">
                        Não foi possível carregar a ONG
                      </h1>

                      <p className="text-base-content/70">{erroPublica}</p>
                    </div>
                  </div>
                </section>
              ) : ongNaoEncontrada || !ong ? (
                <section className="bg-base-100 py-20">
                  <div className="mx-auto w-full max-w-7xl px-15">
                    <div className="rounded-2xl border border-base-300 bg-base-100 p-10">
                      <h1 className="mb-3 text-3xl font-black">
                        ONG não encontrada
                      </h1>

                      <p className="mb-6 text-base-content/60">
                        A organização solicitada não existe ou não está
                        disponível para consulta pública.
                      </p>

                      <Link to="/" className="btn btn-primary">
                        Voltar para o início
                      </Link>
                    </div>
                  </div>
                </section>
              ) : (
                <DetalhesOng key={ong.id} ong={ong} />
              )}
            </>
          )}
        </main>

        <Ongs />
        <Footer />

        <BackToTop />
        <VLibras />
        <UserWay />
      </div>
    </div>
  );
}

export default Detalhes;
