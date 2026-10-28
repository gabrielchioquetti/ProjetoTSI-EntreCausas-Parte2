import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import CampoFormulario from "../../components/Form/CampoFormulario";
import Footer from "../../components/Footer/Footer";
import OngsCarrossel from "../../components/Ongs/OngsCarrossel";
import BackToTop from "../../components/Acessibilidade/BackToTop";
import VLibras from "../../components/Acessibilidade/VLibras";
import UserWay from "../../components/Acessibilidade/UserWay";

const imagensFundo = [
  "../../img/carrossel/instituto-nosso-lar/fotografia-Instituto-Nosso-Lar-Horizontal-Desktop.jpg",
  "../../img/carrossel/instituto-nosso-lar/fotografia-Instituto-Nosso-Lar-Vertical-Mobile.jpg",
  "../../img/carrossel/sos-animais/fotografia-SOS-Animais-Vertical-Mobile.jpg",
];

const dadosMockados = {
  nome: "Instituto Esperança",
  cnpj: "12.345.678/0001-90",
  telefone: "(15) 99999-1234",
  instagram: "@institutoesperanca",
  descricaoCurta: "Acolhimento e oportunidades para crianças e famílias.",
  descricaoCompleta:
    "O Instituto Esperança desenvolve ações de assistência social, educação e fortalecimento de vínculos para crianças, adolescentes e suas famílias em Itapetininga.",
  categorias: ["Educação", "Assistência Social"],
  cep: "18200-000",
  logradouro: "Rua das Flores",
  numero: "125",
  complemento: "Sala 2",
  bairro: "Centro",
  cidade: "Itapetininga",
  estado: "SP",
};

const categoriasDisponiveis = [
  "Educação",
  "Assistência Social",
  "Saúde",
  "Proteção Animal",
  "Meio Ambiente",
  "Cultura",
];

const fotosIniciais = [
  {
    id: "capa",
    src: "/img/cards/nosso_lar/capa.png",
    alt: "Foto de capa da Instituição Nosso Lar",
  },
  {
    id: "atividade-1",
    src: "/img/cards/nosso_lar/01.png",
    alt: "Atividade realizada pela Instituição Nosso Lar",
  },
  {
    id: "atividade-2",
    src: "/img/cards/nosso_lar/02.png",
    alt: "Ação da Instituição Nosso Lar",
  },
];

const tiposImagemPermitidos = ["image/jpeg", "image/png", "image/webp"];
const tamanhoMaximoImagem = 5 * 1024 * 1024;

async function validarImagem(arquivo) {
  if (!tiposImagemPermitidos.includes(arquivo.type)) {
    throw new Error("Envie apenas imagens JPG, PNG ou WEBP.");
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

function EditarOng() {
  const navigate = useNavigate();
  const formularioRef = useRef(null);
  const inputAdicionarFotosRef = useRef(null);
  const urlsPreviewRef = useRef([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [imagemAtual, setImagemAtual] = useState(0);
  const [fotos, setFotos] = useState(fotosIniciais);
  const [erroFotos, setErroFotos] = useState("");

  useEffect(
    () => () => urlsPreviewRef.current.forEach((url) => URL.revokeObjectURL(url)),
    [],
  );

  useEffect(() => {
    const intervalo = setInterval(() => {
      setImagemAtual((anterior) =>
        anterior === imagensFundo.length - 1 ? 0 : anterior + 1,
      );
    }, 5000);

    return () => clearInterval(intervalo);
  }, []);

  function solicitarConfirmacao(event) {
    event.preventDefault();

    if (!formularioRef.current?.reportValidity()) {
      return;
    }

    if (fotos.length < 3 || fotos.length > 5 || erroFotos) {
      setErroFotos("Corrija as fotos antes de solicitar a atualização.");
      return;
    }

    setMensagem("");
    setSenha("");
    setModalAberto(true);
  }

  function confirmarAtualizacao(event) {
    event.preventDefault();

    if (!senha.trim()) {
      return;
    }

    setModalAberto(false);
    setSenha("");
    setMensagem(
      "Confirmação concluída no protótipo. Os dados não foram salvos e a senha não foi validada.",
    );
  }

  function fecharModal() {
    setModalAberto(false);
    setSenha("");
  }

  function criarFotoPreview(arquivo, id) {
    const preview = URL.createObjectURL(arquivo);
    urlsPreviewRef.current.push(preview);

    return {
      id,
      src: preview,
      alt: `Prévia da imagem ${arquivo.name}`,
      isPreview: true,
    };
  }

  async function adicionarFotos(event) {
    const arquivos = Array.from(event.currentTarget.files || []);
    event.currentTarget.value = "";
    setErroFotos("");
    setMensagem("");

    if (fotos.length + arquivos.length > 5) {
      setErroFotos("A ONG pode ter de 3 a 5 fotos.");
      return;
    }

    try {
      for (const arquivo of arquivos) {
        await validarImagem(arquivo);
      }

      const novasFotos = arquivos.map((arquivo, indice) =>
        criarFotoPreview(
          arquivo,
          `nova-${Date.now()}-${indice}-${arquivo.name}`,
        ),
      );
      setFotos((atuais) => [...atuais, ...novasFotos]);
    } catch (erroValidacao) {
      setErroFotos(erroValidacao.message);
    }
  }

  async function substituirFoto(id, event) {
    const arquivo = event.currentTarget.files?.[0];
    event.currentTarget.value = "";

    if (!arquivo) {
      return;
    }

    setErroFotos("");
    setMensagem("");

    try {
      await validarImagem(arquivo);
      const novaFoto = criarFotoPreview(arquivo, id);

      setFotos((atuais) =>
        atuais.map((foto) => {
          if (foto.id !== id) {
            return foto;
          }

          if (foto.isPreview) {
            URL.revokeObjectURL(foto.src);
            urlsPreviewRef.current = urlsPreviewRef.current.filter(
              (url) => url !== foto.src,
            );
          }

          return novaFoto;
        }),
      );
    } catch (erroValidacao) {
      setErroFotos(erroValidacao.message);
    }
  }

  function removerFoto(id) {
    if (fotos.length <= 3) {
      setErroFotos("Mantenha pelo menos 3 fotos, conforme o cadastro da ONG.");
      return;
    }

    const fotoRemovida = fotos.find((foto) => foto.id === id);

    if (fotoRemovida?.isPreview) {
      URL.revokeObjectURL(fotoRemovida.src);
      urlsPreviewRef.current = urlsPreviewRef.current.filter(
        (url) => url !== fotoRemovida.src,
      );
    }

    setFotos((atuais) => atuais.filter((foto) => foto.id !== id));
    setErroFotos("");
    setMensagem("");
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
          <div className="absolute inset-0">
            {imagensFundo.map((imagem, indice) => (
              <img
                key={imagem}
                src={imagem}
                alt=""
                aria-hidden="true"
                className={`
                  absolute
                  inset-0
                  h-full
                  w-full
                  object-cover
                  transition-opacity
                  duration-1000
                  ${indice === imagemAtual ? "opacity-100" : "opacity-0"}
                `}
              />
            ))}
          </div>
          <div
            className="absolute inset-0 bg-black/65"
            aria-hidden="true"
          />

          <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-10">
            <div className="mb-5 max-w-3xl">
              <div className="mb-2 flex items-center gap-3">
                <span className="h-[3px] w-10 rounded-full bg-primary" />
                <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
                  Área da organização
                </span>
              </div>
              <h1 className="text-4xl font-black leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
                Edite os dados da sua{" "}
                <span className="text-primary">ONG.</span>
              </h1>
              <p className="mt-2.5 max-w-2xl text-lg leading-8 text-white/75">
                Confira e atualize as informações da sua organização.
              </p>
            </div>

            <div
              role="note"
              className="alert mb-6 border border-white/20 bg-base-100 shadow-sm"
            >
              <i
                className="fa-solid fa-circle-info text-primary"
                aria-hidden="true"
              />
              <span>
                Protótipo visual com dados fictícios. A validação da senha e o
                salvamento serão conectados ao backend posteriormente.
              </span>
            </div>

          <form
            ref={formularioRef}
            onSubmit={solicitarConfirmacao}
            className="space-y-6"
          >
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
                  defaultValue={dadosMockados.nome}
                  required
                />
                <CampoFormulario
                  label="CNPJ"
                  id="cnpj"
                  placeholder="00.000.000/0000-00"
                  defaultValue={dadosMockados.cnpj}
                  maxLength={18}
                  pattern="\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}"
                  title="Informe um CNPJ no formato 00.000.000/0000-00."
                  required
                />
                <CampoFormulario
                  label="Telefone"
                  id="telefone"
                  type="tel"
                  autoComplete="tel"
                  defaultValue={dadosMockados.telefone}
                  maxLength={15}
                  required
                />
                <CampoFormulario
                  label="Instagram"
                  id="instagram"
                  placeholder="@suaong"
                  defaultValue={dadosMockados.instagram}
                  required
                />
              </div>
            </section>

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
                  <h2 className="text-2xl font-black">Descrição e causas</h2>
                </div>
              </div>

              <div className="space-y-6">
                <CampoFormulario
                  label="Descrição curta"
                  id="descricaoCurta"
                  textarea
                  textareaClassName="min-h-20"
                  maxLength={250}
                  defaultValue={dadosMockados.descricaoCurta}
                  required
                />
                <CampoFormulario
                  label="Descrição completa"
                  id="descricaoCompleta"
                  textarea
                  maxLength={500}
                  defaultValue={dadosMockados.descricaoCompleta}
                  required
                />

                <fieldset>
                  <legend className="mb-3 text-sm font-bold">
                    Categorias de atuação
                  </legend>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {categoriasDisponiveis.map((categoria) => (
                      <label
                        key={categoria}
                        className="flex cursor-pointer items-center gap-3 rounded-xl border border-base-300 px-4 py-3 text-sm transition hover:border-primary"
                      >
                        <input
                          type="checkbox"
                          name="categorias"
                          value={categoria}
                          defaultChecked={dadosMockados.categorias.includes(
                            categoria,
                          )}
                          className="checkbox checkbox-primary checkbox-sm"
                        />
                        {categoria}
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>
            </section>

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
                      Mantenha de 3 a 5 imagens JPG, PNG ou WEBP, até 5 MB cada.
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
                  accept="image/jpeg,image/png,image/webp"
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
                          accept="image/jpeg,image/png,image/webp"
                          onChange={(event) => substituirFoto(foto.id, event)}
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
                <p role="alert" className="mt-4 text-sm font-semibold text-error">
                  {erroFotos}
                </p>
              )}
            </section>

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
                  defaultValue={dadosMockados.cep}
                  pattern="\d{5}-\d{3}"
                  title="Informe um CEP no formato 00000-000."
                  required
                />
                <CampoFormulario
                  label="Logradouro"
                  id="logradouro"
                  autoComplete="address-line1"
                  defaultValue={dadosMockados.logradouro}
                  required
                />
                <CampoFormulario
                  label="Número"
                  id="numero"
                  defaultValue={dadosMockados.numero}
                  required
                />
                <CampoFormulario
                  label="Complemento"
                  id="complemento"
                  defaultValue={dadosMockados.complemento}
                />
                <CampoFormulario
                  label="Bairro"
                  id="bairro"
                  defaultValue={dadosMockados.bairro}
                  required
                />
                <CampoFormulario
                  label="Cidade"
                  id="cidade"
                  autoComplete="address-level2"
                  defaultValue={dadosMockados.cidade}
                  required
                />
                <CampoFormulario
                  label="Estado"
                  id="estado"
                  defaultValue={dadosMockados.estado}
                  maxLength={2}
                  required
                />
              </div>
            </section>

            {mensagem && (
              <p
                role="status"
                className="rounded-xl border border-secondary bg-base-100 p-4 text-sm font-semibold text-base-content"
              >
                {mensagem}
              </p>
            )}

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
                className="btn btn-primary h-12 rounded-xl px-8 font-bold"
              >
                Atualizar
                <i className="fa-solid fa-arrow-right ml-2" aria-hidden="true" />
              </button>
            </div>
          </form>

            <div className="mt-8 flex justify-center gap-2">
              {imagensFundo.map((imagem, indice) => (
                <button
                  key={imagem}
                  type="button"
                  onClick={() => setImagemAtual(indice)}
                  aria-label={`Exibir imagem ${indice + 1}`}
                  aria-pressed={indice === imagemAtual}
                  className={`
                    rounded-full
                    transition-all
                    duration-300
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
              Informe sua senha para confirmar as alterações. Nesta tela de
              protótipo, a senha não é verificada nem enviada.
            </p>

            <form onSubmit={confirmarAtualizacao} className="mt-6">
              <CampoFormulario
                label="Senha"
                id="senha-confirmacao"
                type="password"
                autoComplete="current-password"
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
                required
              />
              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={fecharModal}
                  className="btn rounded-xl border-base-300 bg-base-100 px-6"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary rounded-xl px-6"
                >
                  Confirmar
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
