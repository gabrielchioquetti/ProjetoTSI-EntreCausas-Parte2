import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

import CampoFormulario from "../../components/Form/CampoFormulario";
import Footer from "../../components/Footer/Footer";
import OngsCarrossel from "../../components/Ongs/OngsCarrossel";
import BackToTop from "../../components/Acessibilidade/BackToTop";
import VLibras from "../../components/Acessibilidade/VLibras";
import UserWay from "../../components/Acessibilidade/UserWay";

import { apiFetch } from "../../services/Api.js";

// Endereço do backend responsável por disponibilizar as imagens.
const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:8080"
).replace(/\/$/, "");

const imagensFundo = [
  "../../img/carrossel/instituto-nosso-lar/fotografia-Instituto-Nosso-Lar-Horizontal-Desktop.jpg",
  "../../img/carrossel/instituto-nosso-lar/fotografia-Instituto-Nosso-Lar-Vertical-Mobile.jpg",
  "../../img/carrossel/sos-animais/fotografia-SOS-Animais-Vertical-Mobile.jpg",
];

const tiposImagemPermitidos = ["image/jpeg", "image/png"];
const tamanhoMaximoImagem = 5 * 1024 * 1024;

// Constrói a URL das imagens armazenadas no backend.
function obterUrlImagem(caminho) {
  if (!caminho) return "/img/default/ongs.png";

  if (/^https?:\/\//i.test(caminho)) {
    return caminho;
  }

  return `${API_URL}/${String(caminho).replace(/^\/+/, "")}`;
}

// Converte os dados da ONG para os campos do formulário.
function carregarDadosFormulario(ong) {
  const descricoes = ong.descricoes || [];

  const resumo = descricoes.find((item) => item.tipoDescricao === "RESUMO");

  const sobre = descricoes.find((item) => item.tipoDescricao === "SOBRE");

  return {
    nome: ong.nome || "",
    cnpj: ong.cnpj || "",
    telefone: ong.telefone || "",
    instagram: ong.instagram || "",
    descricaoCurta: resumo?.texto || "",
    descricaoCompleta: sobre?.texto || "",
    cep: ong.endereco?.cep || "",
    logradouro: ong.endereco?.logradouro || "",
    numero: ong.endereco?.numero || "",
    complemento: ong.endereco?.complemento || "",
    bairro: ong.endereco?.bairro || "",
    cidade: ong.endereco?.cidade || "",
    estado: ong.endereco?.estado || "",
  };
}

// Valida os arquivos antes de adicioná-los ao formulário.
async function validarImagem(arquivo) {
  if (!tiposImagemPermitidos.includes(arquivo.type)) {
    throw new Error("Envie apenas imagens JPG ou PNG.");
  }

  if (arquivo.size > tamanhoMaximoImagem) {
    throw new Error("Cada imagem deve ter no máximo 5 MB.");
  }

  let imagem;

  try {
    imagem = await createImageBitmap(arquivo);
  } catch {
    throw new Error(`O arquivo "${arquivo.name}" não é uma imagem válida.`);
  } finally {
    imagem?.close();
  }
}

// Identifica situações em que a edição deve permanecer bloqueada.
function obterBloqueioEdicao(ong) {
  if (!ong) return null;

  const status = String(ong.statusSolicitacao || "")
    .trim()
    .toUpperCase();

  const tipo = String(ong.tipoSolicitacao || "")
    .trim()
    .toUpperCase();

  if (status === "PENDENTE" && tipo === "EDICAO") {
    return {
      titulo: "Edição aguardando análise",
      mensagem:
        "Sua organização já possui uma solicitação de edição pendente. Aguarde a análise administrativa antes de enviar novas alterações.",
    };
  }

  if (status === "PENDENTE" && tipo === "CADASTRO") {
    return {
      titulo: "Cadastro aguardando análise",
      mensagem:
        "O cadastro da sua organização ainda está em análise. Você poderá solicitar alterações após a decisão administrativa.",
    };
  }

  // Impede a liberação quando existe pendência sem tipo identificado.
  if (status === "PENDENTE") {
    return {
      titulo: "Solicitação aguardando análise",
      mensagem:
        "Sua organização possui uma solicitação pendente. Aguarde a análise administrativa antes de realizar alterações.",
    };
  }

  // Uma ONG sem aprovação e sem cadastro rejeitado não pode editar.
  if (!ong.publicada && status !== "REJEITADO") {
    return {
      titulo: "Edição indisponível",
      mensagem:
        "O cadastro da organização precisa ser analisado antes que novas alterações possam ser solicitadas.",
    };
  }

  return null;
}

// Apresenta o aviso conforme a situação da organização.
function obterAvisoEdicao(ong) {
  if (ong?.publicada === true) {
    return "As alterações serão enviadas para análise administrativa. Os dados publicados permanecerão inalterados até a aprovação.";
  }

  return "Sua organização ainda não está publicada. As correções serão enviadas para uma nova análise administrativa e a ONG somente poderá ser divulgada após a aprovação.";
}

function EditarOng() {
  const navigate = useNavigate();

  const formularioRef = useRef(null);
  const inputAdicionarFotosRef = useRef(null);
  const urlsPreviewRef = useRef(new Set());
  const contadorFotosRef = useRef(0);

  // Dados reais da organização.
  const [ong, setOng] = useState(null);
  const [dados, setDados] = useState(null);

  // Categorias carregadas do banco de dados.
  const [categoriasDisponiveis, setCategoriasDisponiveis] = useState([]);

  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState([]);

  // Imagens existentes e novos arquivos.
  const [fotos, setFotos] = useState([]);

  // Estados de carregamento e envio.
  const [carregando, setCarregando] = useState(true);
  const [erroCarregamento, setErroCarregamento] = useState("");
  const [erroFotos, setErroFotos] = useState("");
  const [erroEnvio, setErroEnvio] = useState("");
  const [enviando, setEnviando] = useState(false);

  // Confirmação da solicitação.
  const [modalAberto, setModalAberto] = useState(false);
  const [senha, setSenha] = useState("");

  // Carrossel visual.
  const [imagemAtual, setImagemAtual] = useState(0);

  // Estado de autorização da edição.
  const bloqueioEdicao = obterBloqueioEdicao(ong);
  const avisoEdicao = obterAvisoEdicao(ong);

  // Remove os previews temporários ao desmontar o componente.
  useEffect(() => {
    const urls = urlsPreviewRef.current;

    return () => {
      urls.forEach((url) => {
        URL.revokeObjectURL(url);
      });

      urls.clear();
    };
  }, []);

  // Mantém a alternância das imagens de fundo.
  useEffect(() => {
    const intervalo = setInterval(() => {
      setImagemAtual((anterior) =>
        anterior === imagensFundo.length - 1 ? 0 : anterior + 1,
      );
    }, 5000);

    return () => clearInterval(intervalo);
  }, []);

  // Carrega a ONG autenticada e todas as categorias cadastradas.
  useEffect(() => {
    let ativo = true;

    async function carregarDados() {
      setCarregando(true);
      setErroCarregamento("");

      try {
        const [respostaOng, respostaCategorias] = await Promise.all([
          apiFetch("/api/ongs/minha"),
          apiFetch("/api/categorias"),
        ]);

        if (!ativo) return;

        if (!respostaOng) {
          throw new Error("Você ainda não possui uma ONG cadastrada.");
        }

        if (!Array.isArray(respostaCategorias)) {
          throw new Error(
            "Não foi possível carregar as categorias do sistema.",
          );
        }

        // CategoriaResponseDTO possui idCategoria e nome.
        const categorias = respostaCategorias.map((categoria) => ({
          id: Number(categoria.idCategoria),
          nome: categoria.nome,
        }));

        // Mantém selecionadas as categorias atuais da ONG.
        const categoriasAtuais = (respostaOng.categorias || []).map(
          (categoria) => Number(categoria.idCategoria),
        );

        // Preserva o ID de cada imagem já cadastrada.
        const imagens = (respostaOng.imagens || []).map((imagem) => ({
          id: imagem.idImagem,
          src: obterUrlImagem(imagem.caminho),
          alt: imagem.textoAlternativo || `Imagem da ONG ${respostaOng.nome}`,
          isPreview: false,
          arquivo: null,
        }));

        setOng(respostaOng);
        setDados(carregarDadosFormulario(respostaOng));
        setCategoriasDisponiveis(categorias);
        setCategoriasSelecionadas(categoriasAtuais);
        setFotos(imagens);
      } catch (erro) {
        if (ativo) {
          setErroCarregamento(
            erro.message ||
              "Não foi possível carregar os dados da organização.",
          );
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarDados();

    return () => {
      ativo = false;
    };
  }, []);

  // Atualiza os campos do formulário.
  function alterarCampo(campo, valor) {
    setDados((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));

    setErroEnvio("");
  }

  // Adiciona ou remove uma categoria selecionada.
  function alterarCategoria(id, selecionada) {
    setCategoriasSelecionadas((anteriores) => {
      if (selecionada) {
        return anteriores.includes(id) ? anteriores : [...anteriores, id];
      }

      return anteriores.filter((item) => item !== id);
    });

    setErroEnvio("");
  }

  // Cria a prévia de uma imagem selecionada.
  function criarFotoPreview(arquivo, id) {
    const preview = URL.createObjectURL(arquivo);

    urlsPreviewRef.current.add(preview);

    return {
      id,
      src: preview,
      alt: `Prévia da imagem ${arquivo.name}`,
      isPreview: true,
      arquivo,
    };
  }

  // Libera a URL temporária de uma imagem removida.
  function liberarPreview(foto) {
    if (!foto?.isPreview) return;

    URL.revokeObjectURL(foto.src);
    urlsPreviewRef.current.delete(foto.src);
  }

  function gerarIdFoto() {
    contadorFotosRef.current += 1;
    return `nova-foto-${contadorFotosRef.current}`;
  }

  // Adiciona novas imagens à proposta.
  async function adicionarFotos(event) {
    const arquivos = Array.from(event.currentTarget.files || []);

    event.currentTarget.value = "";

    setErroFotos("");

    if (fotos.length + arquivos.length > 5) {
      setErroFotos("A ONG pode ter de 3 a 5 fotos.");
      return;
    }

    try {
      for (const arquivo of arquivos) {
        await validarImagem(arquivo);
      }

      const novasFotos = arquivos.map((arquivo) =>
        criarFotoPreview(arquivo, gerarIdFoto()),
      );

      setFotos((atuais) => [...atuais, ...novasFotos]);
    } catch (erro) {
      setErroFotos(erro.message);
    }
  }

  // Substitui uma imagem existente por um novo arquivo.
  async function substituirFoto(id, event) {
    const arquivo = event.currentTarget.files?.[0];

    event.currentTarget.value = "";

    if (!arquivo) return;

    setErroFotos("");

    try {
      await validarImagem(arquivo);

      const novaFoto = criarFotoPreview(arquivo, gerarIdFoto());

      const fotoAnterior = fotos.find((foto) => foto.id === id);

      setFotos((atuais) =>
        atuais.map((foto) => (foto.id === id ? novaFoto : foto)),
      );

      liberarPreview(fotoAnterior);
    } catch (erro) {
      setErroFotos(erro.message);
    }
  }

  // Remove uma imagem da proposta de edição.
  function removerFoto(id) {
    if (fotos.length <= 3) {
      setErroFotos("Mantenha pelo menos 3 fotos na organização.");
      return;
    }

    const foto = fotos.find((item) => item.id === id);

    setFotos((atuais) => atuais.filter((item) => item.id !== id));

    liberarPreview(foto);
    setErroFotos("");
  }

  // Valida o formulário antes de abrir a confirmação.
  function solicitarConfirmacao(event) {
    event.preventDefault();

    if (bloqueioEdicao) {
      setErroEnvio(bloqueioEdicao.mensagem);
      return;
    }

    if (!formularioRef.current?.reportValidity()) {
      return;
    }

    if (categoriasSelecionadas.length === 0) {
      setErroEnvio("Selecione pelo menos uma categoria.");
      return;
    }

    if (fotos.length < 3 || fotos.length > 5) {
      setErroFotos("A ONG precisa ter de 3 a 5 imagens válidas.");
      return;
    }

    setErroFotos("");
    setErroEnvio("");
    setSenha("");
    setModalAberto(true);
  }

  // Confirma a senha e envia a solicitação ao backend.
  async function confirmarAtualizacao(event) {
    event.preventDefault();

    if (!ong || enviando) return;

    if (bloqueioEdicao) {
      setErroEnvio(bloqueioEdicao.mensagem);
      return;
    }

    if (!senha) {
      setErroEnvio("Informe sua senha atual.");
      return;
    }

    setEnviando(true);
    setErroEnvio("");

    try {
      const formulario = new FormData();

      // Dados principais da ONG.
      formulario.append("nome", dados.nome.trim());
      formulario.append("telefone", dados.telefone.trim());

      if (dados.instagram.trim()) {
        formulario.append("instagram", dados.instagram.trim());
      }

      // Descrições.
      formulario.append("descricaoCurta", dados.descricaoCurta.trim());

      formulario.append("descricaoCompleta", dados.descricaoCompleta.trim());

      // Categorias: envia um campo para cada ID.
      categoriasSelecionadas.forEach((idCategoria) => {
        formulario.append("categorias", String(idCategoria));
      });

      // Endereço.
      formulario.append("cep", dados.cep.trim());
      formulario.append("logradouro", dados.logradouro.trim());
      formulario.append("numero", dados.numero.trim());

      if (dados.complemento.trim()) {
        formulario.append("complemento", dados.complemento.trim());
      }

      formulario.append("bairro", dados.bairro.trim());
      formulario.append("cidade", dados.cidade.trim());
      formulario.append("estado", dados.estado.trim());

      // Mantém os IDs das imagens existentes.
      // Novas imagens são enviadas como arquivos.
      fotos.forEach((foto) => {
        if (foto.arquivo instanceof File) {
          formulario.append("novasImagens", foto.arquivo);
        } else {
          formulario.append("imagensMantidas", String(foto.id));
        }
      });

      // A senha é validada pelo backend.
      formulario.append("senhaAtual", senha);

      // Não definir Content-Type manualmente.
      // O navegador precisa incluir o boundary do multipart.
      const idSolicitacao = await apiFetch(
        `/api/ongs/${ong.idOng}/solicitar-edicao`,
        {
          method: "POST",
          body: formulario,
        },
      );

      setModalAberto(false);

      // Retorna para a página da organização.
      navigate("/minha-organizacao", {
        replace: true,
        state: {
          edicaoOngResultado: {
            sucesso: true,
            idSolicitacao,
            mensagem:
              "Solicitação de edição enviada! As alterações aguardam aprovação administrativa.",
          },
        },
      });
    } catch (erro) {
      setErroEnvio(
        erro.message || "Não foi possível enviar a solicitação de edição.",
      );
    } finally {
      // A senha não permanece no estado após a tentativa.
      setSenha("");
      setEnviando(false);
    }
  }

  // Fecha o modal sem enviar a solicitação.
  function fecharModal() {
    if (enviando) return;

    setSenha("");
    setModalAberto(false);
    setErroEnvio("");
  }

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <a
        href="#conteudo-principal"
        className="
          sr-only
          focus:not-sr-only
          focus:fixed
          focus:left-4
          focus:top-4
          focus:z-[9999]
          focus:rounded-lg
          focus:bg-base-100
          focus:px-4
          focus:py-3
          focus:text-primary
          focus:shadow-xl
        "
      >
        Pular para o conteúdo principal
      </a>

      <div id="site">
        <main
          id="conteudo-principal"
          className="relative overflow-hidden py-8 lg:py-10"
        >
          {/* Imagens de fundo */}
          <div className="absolute inset-0">
            {imagensFundo.map((imagem, indice) => (
              <img
                key={imagem}
                src={imagem}
                alt=""
                aria-hidden="true"
                className={`
                  absolute inset-0 h-full w-full object-cover
                  transition-opacity duration-1000
                  ${indice === imagemAtual ? "opacity-100" : "opacity-0"}
                `}
              />
            ))}
          </div>

          <div className="absolute inset-0 bg-black/65" aria-hidden="true" />

          <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-10">
            {/* Título */}
            <div className="mb-5 max-w-3xl">
              <div className="mb-2 flex items-center gap-3">
                <span className="h-[3px] w-10 rounded-full bg-primary" />

                <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
                  Área da organização
                </span>
              </div>

              <h1 className="text-4xl font-black leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
                Edite os dados da sua <span className="text-primary">ONG.</span>
              </h1>

              <p className="mt-2.5 max-w-2xl text-lg leading-8 text-white/75">
                Confira e atualize as informações da sua organização.
              </p>
            </div>

            {/* Aviso sobre a análise administrativa */}
            <div
              role="note"
              className="alert mb-6 border border-white/20 bg-base-100 shadow-sm"
            >
              <i
                className="fa-solid fa-circle-info text-primary"
                aria-hidden="true"
              />

              <span>
                {carregando
                  ? "Verificando a situação da sua organização..."
                  : bloqueioEdicao
                    ? bloqueioEdicao.mensagem
                    : avisoEdicao}
              </span>
            </div>

            {carregando ? (
              <section className="rounded-3xl bg-base-100 p-10 text-center">
                <span className="loading loading-spinner loading-lg text-primary" />

                <p className="mt-4">Carregando sua organização...</p>
              </section>
            ) : erroCarregamento ? (
              <section
                role="alert"
                className="rounded-3xl border border-error/30 bg-base-100 p-10"
              >
                <p className="font-bold text-error">{erroCarregamento}</p>

                <button
                  type="button"
                  onClick={() => navigate("/minha-organizacao")}
                  className="btn btn-primary mt-5"
                >
                  Voltar para Minha Organização
                </button>
              </section>
            ) : bloqueioEdicao ? (
              <section
                role="status"
                className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm md:p-9"
              >
                <div className="mb-5 flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-secondary text-2xl text-primary">
                    <i className="fa-solid fa-clock" aria-hidden="true" />
                  </div>

                  <div>
                    <p className="text-sm font-bold uppercase tracking-wide text-primary">
                      Situação da organização
                    </p>

                    <h2 className="text-2xl font-black">
                      {bloqueioEdicao.titulo}
                    </h2>
                  </div>
                </div>

                <p className="leading-7 text-base-content/75">
                  {bloqueioEdicao.mensagem}
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/minha-organizacao")}
                  className="btn btn-primary mt-6 rounded-xl"
                >
                  Voltar para Minha Organização
                </button>
              </section>
            ) : (
              <form
                ref={formularioRef}
                onSubmit={solicitarConfirmacao}
                className="space-y-6"
              >
                {/* Dados principais */}
                <section className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm md:p-9">
                  <div className="mb-7 flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-secondary text-2xl text-primary">
                      <i className="fa-solid fa-building" aria-hidden="true" />
                    </div>

                    <div>
                      <p className="text-sm font-bold uppercase tracking-wide text-primary">
                        Dados da ONG
                      </p>

                      <h2 className="text-2xl font-black">Identificação</h2>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <CampoFormulario
                      label="Nome da ONG"
                      id="nome"
                      autoComplete="organization"
                      value={dados.nome}
                      onChange={(event) =>
                        alterarCampo("nome", event.target.value)
                      }
                      maxLength={150}
                      required
                    />

                    {/* CNPJ não pode ser alterado */}
                    <CampoFormulario
                      label="CNPJ"
                      id="cnpj"
                      value={dados.cnpj}
                      disabled
                    />

                    <CampoFormulario
                      label="Telefone"
                      id="telefone"
                      type="tel"
                      autoComplete="tel"
                      value={dados.telefone}
                      onChange={(event) =>
                        alterarCampo("telefone", event.target.value)
                      }
                      maxLength={15}
                      required
                    />

                    <CampoFormulario
                      label="Instagram"
                      id="instagram"
                      placeholder="@suaong"
                      value={dados.instagram}
                      onChange={(event) =>
                        alterarCampo("instagram", event.target.value)
                      }
                    />
                  </div>
                </section>

                {/* Descrições e categorias */}
                <section className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm md:p-9">
                  <div className="mb-7 flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-secondary text-2xl text-primary">
                      <i
                        className="fa-solid fa-pen-to-square"
                        aria-hidden="true"
                      />
                    </div>

                    <div>
                      <p className="text-sm font-bold uppercase tracking-wide text-primary">
                        Sobre a organização
                      </p>

                      <h2 className="text-2xl font-black">
                        Descrição e causas
                      </h2>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <CampoFormulario
                      label="Descrição curta"
                      id="descricaoCurta"
                      textarea
                      textareaClassName="min-h-20"
                      maxLength={250}
                      value={dados.descricaoCurta}
                      onChange={(event) =>
                        alterarCampo("descricaoCurta", event.target.value)
                      }
                      required
                    />

                    <CampoFormulario
                      label="Descrição completa"
                      id="descricaoCompleta"
                      textarea
                      maxLength={500}
                      value={dados.descricaoCompleta}
                      onChange={(event) =>
                        alterarCampo("descricaoCompleta", event.target.value)
                      }
                      required
                    />

                    {/* Categorias carregadas do MySQL */}
                    <fieldset>
                      <legend className="mb-3 text-sm font-bold">
                        Categorias de atuação
                      </legend>

                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {categoriasDisponiveis.map((categoria) => (
                          <label
                            key={categoria.id}
                            className="flex cursor-pointer items-center gap-3 rounded-xl border border-base-300 px-4 py-3 text-sm transition hover:border-primary"
                          >
                            <input
                              type="checkbox"
                              name="categorias"
                              value={categoria.id}
                              checked={categoriasSelecionadas.includes(
                                categoria.id,
                              )}
                              onChange={(event) =>
                                alterarCategoria(
                                  categoria.id,
                                  event.target.checked,
                                )
                              }
                              className="checkbox checkbox-primary checkbox-sm"
                            />

                            {categoria.nome}
                          </label>
                        ))}
                      </div>

                      {categoriasDisponiveis.length === 0 && (
                        <p className="mt-3 text-sm text-base-content/60">
                          Nenhuma categoria cadastrada.
                        </p>
                      )}
                    </fieldset>
                  </div>
                </section>

                {/* Imagens */}
                <section className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm md:p-9">
                  <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-secondary text-2xl text-primary">
                        <i className="fa-regular fa-image" aria-hidden="true" />
                      </div>

                      <div>
                        <p className="text-sm font-bold uppercase tracking-wide text-primary">
                          Identidade visual
                        </p>

                        <h2 className="text-2xl font-black">Fotos da ONG</h2>

                        <p className="mt-1 text-sm text-base-content/55">
                          Mantenha de 3 a 5 imagens JPG ou PNG, até 5 MB cada.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => inputAdicionarFotosRef.current?.click()}
                      disabled={fotos.length >= 5}
                      className="btn btn-outline btn-primary rounded-xl"
                    >
                      <i className="fa-solid fa-plus" aria-hidden="true" />
                      Adicionar foto
                    </button>

                    <input
                      ref={inputAdicionarFotosRef}
                      type="file"
                      accept="image/jpeg,image/png"
                      multiple
                      onChange={adicionarFotos}
                      className="hidden"
                      aria-label="Selecionar fotos para adicionar à ONG"
                    />
                  </div>

                  <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {fotos.map((foto, indice) => (
                      <li
                        key={foto.id}
                        className="overflow-hidden rounded-2xl border border-base-300"
                      >
                        <img
                          src={foto.src}
                          alt={foto.alt}
                          className="h-48 w-full object-cover"
                        />

                        <div className="flex flex-wrap gap-2 p-3">
                          <label className="btn btn-sm btn-outline btn-primary flex-1">
                            Substituir
                            <input
                              type="file"
                              accept="image/jpeg,image/png"
                              onChange={(event) =>
                                substituirFoto(foto.id, event)
                              }
                              className="sr-only"
                              aria-label={`Substituir foto ${indice + 1}`}
                            />
                          </label>

                          <button
                            type="button"
                            onClick={() => removerFoto(foto.id)}
                            disabled={fotos.length <= 3}
                            className="btn btn-sm btn-outline btn-error flex-1"
                            aria-label={`Remover foto ${indice + 1}`}
                          >
                            Remover
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {erroFotos && (
                    <p
                      role="alert"
                      className="mt-4 text-sm font-semibold text-error"
                    >
                      {erroFotos}
                    </p>
                  )}
                </section>

                {/* Endereço */}
                <section className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm md:p-9">
                  <div className="mb-7 flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-secondary text-2xl text-primary">
                      <i
                        className="fa-solid fa-location-dot"
                        aria-hidden="true"
                      />
                    </div>

                    <div>
                      <p className="text-sm font-bold uppercase tracking-wide text-primary">
                        Localização
                      </p>

                      <h2 className="text-2xl font-black">Endereço da ONG</h2>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <CampoFormulario
                      label="CEP"
                      id="cep"
                      autoComplete="postal-code"
                      value={dados.cep}
                      onChange={(event) =>
                        alterarCampo("cep", event.target.value)
                      }
                      pattern="[0-9]{5}-?[0-9]{3}"
                      title="Informe um CEP com 8 dígitos."
                      required
                    />

                    <CampoFormulario
                      label="Logradouro"
                      id="logradouro"
                      autoComplete="address-line1"
                      value={dados.logradouro}
                      onChange={(event) =>
                        alterarCampo("logradouro", event.target.value)
                      }
                      required
                    />

                    <CampoFormulario
                      label="Número"
                      id="numero"
                      value={dados.numero}
                      onChange={(event) =>
                        alterarCampo("numero", event.target.value)
                      }
                      required
                    />

                    <CampoFormulario
                      label="Complemento"
                      id="complemento"
                      value={dados.complemento}
                      onChange={(event) =>
                        alterarCampo("complemento", event.target.value)
                      }
                    />

                    <CampoFormulario
                      label="Bairro"
                      id="bairro"
                      value={dados.bairro}
                      onChange={(event) =>
                        alterarCampo("bairro", event.target.value)
                      }
                      required
                    />

                    <CampoFormulario
                      label="Cidade"
                      id="cidade"
                      autoComplete="address-level2"
                      value={dados.cidade}
                      onChange={(event) =>
                        alterarCampo("cidade", event.target.value)
                      }
                      required
                    />

                    <CampoFormulario
                      label="Estado"
                      id="estado"
                      value={dados.estado}
                      onChange={(event) =>
                        alterarCampo("estado", event.target.value)
                      }
                      maxLength={2}
                      pattern="[A-Za-z]{2}"
                      required
                    />
                  </div>
                </section>

                {/* Mensagens de erro */}
                {erroEnvio && !modalAberto && (
                  <p
                    role="alert"
                    className="rounded-xl border border-error/30 bg-base-100 p-4 text-sm font-semibold text-error"
                  >
                    {erroEnvio}
                  </p>
                )}

                {/* Ações */}
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="btn h-12 rounded-xl border-base-300 bg-base-100 px-7 font-bold hover:border-primary hover:text-primary"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={enviando}
                    className="btn btn-primary h-12 rounded-xl px-8 font-bold"
                  >
                    Enviar para análise
                    <i
                      className="fa-solid fa-arrow-right ml-2"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </form>
            )}

            {/* Indicadores do carrossel */}
            <div className="mt-8 flex justify-center gap-2">
              {imagensFundo.map((imagem, indice) => (
                <button
                  key={imagem}
                  type="button"
                  onClick={() => setImagemAtual(indice)}
                  aria-label={`Exibir imagem ${indice + 1}`}
                  aria-pressed={indice === imagemAtual}
                  className={`
                    rounded-full transition-all duration-300
                    ${
                      indice === imagemAtual
                        ? "h-2.5 w-8 bg-primary"
                        : "h-2.5 w-2.5 bg-white/50 hover:bg-white"
                    }
                  `}
                />
              ))}
            </div>
          </div>
        </main>

        <OngsCarrossel />
        <Footer />
        <BackToTop />
        <VLibras />
        <UserWay />
      </div>

      {/* Modal de confirmação por senha */}
      {modalAberto && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral/50 p-4"
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              fecharModal();
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirmar-atualizacao-titulo"
            className="w-full max-w-md rounded-3xl border border-base-300 bg-base-100 p-6 shadow-2xl md:p-8"
          >
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-2xl text-primary">
              <i className="fa-solid fa-lock" aria-hidden="true" />
            </div>

            <h2
              id="confirmar-atualizacao-titulo"
              className="text-2xl font-black"
            >
              Confirmar atualização
            </h2>

            <p className="mt-2 text-sm leading-6 text-base-content/65">
              Informe sua senha atual para confirmar o envio das alterações. Sua
              solicitação será analisada antes de qualquer mudança nos dados
              publicados.
            </p>

            <form onSubmit={confirmarAtualizacao} className="mt-6">
              <CampoFormulario
                label="Senha atual"
                id="senha-confirmacao"
                type="password"
                autoComplete="current-password"
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
                required
              />

              {/* Exibe erros de validação da senha ou do envio */}
              {erroEnvio && (
                <p
                  role="alert"
                  className="mt-4 text-sm font-semibold text-error"
                >
                  {erroEnvio}
                </p>
              )}

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={fecharModal}
                  disabled={enviando}
                  className="btn rounded-xl border-base-300 bg-base-100 px-6"
                >
                  Voltar
                </button>

                <button
                  type="submit"
                  disabled={enviando || !senha}
                  className="btn btn-primary rounded-xl px-6"
                >
                  {enviando ? (
                    <>
                      <span className="loading loading-spinner loading-sm" />
                      Enviando...
                    </>
                  ) : (
                    "Confirmar"
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

export default EditarOng;