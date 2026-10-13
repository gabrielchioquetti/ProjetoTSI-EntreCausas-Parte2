
import { useEffect, useRef, useState } from "react";
import CampoFormulario from "../Form/CampoFormulario";
import UploadImagem from "../Form/UploadImagem";
import { apiFetch } from "../../services/Api.js";

const tiposImagemPermitidos = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
};

const tamanhoMaximoImagem = 5 * 1024 * 1024;

function ehImagemPermitida(arquivo) {
  const extensao = `.${arquivo.name.split(".").pop().toLowerCase()}`;

  return (
    tiposImagemPermitidos[arquivo.type]?.includes(extensao) &&
    arquivo.size <= tamanhoMaximoImagem
  );
}

function DescricaoOng({ onNext, onBack }) {
  const [descricaoCurta, setDescricaoCurta] = useState("");
  const [descricaoCompleta, setDescricaoCompleta] = useState("");
  const [categoriasDisponiveis, setCategoriasDisponiveis] = useState([]);
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState([]);
  const [imagensSelecionadas, setImagensSelecionadas] = useState([]);
  const [erroCategorias, setErroCategorias] = useState("");
  const [erroCarregamentoCategorias, setErroCarregamentoCategorias] =
    useState("");
  const [erroImagens, setErroImagens] = useState("");
  const [categoriasCarregando, setCategoriasCarregando] = useState(true);
  const [validandoImagens, setValidandoImagens] = useState(false);

  const validacaoAtual = useRef(0);

  const podeAvancar =
    descricaoCurta.trim().length > 0 &&
    descricaoCompleta.trim().length > 0 &&
    categoriasSelecionadas.length > 0 &&
    imagensSelecionadas.length >= 3 &&
    imagensSelecionadas.length <= 5 &&
    !categoriasCarregando &&
    !erroCarregamentoCategorias &&
    !validandoImagens;

  // Carrega as categorias cadastradas no banco de dados.
  useEffect(() => {
    let componenteAtivo = true;

    async function carregarCategorias() {
      try {
        const categorias = await apiFetch("/api/categorias");

        if (!componenteAtivo) return;

        if (!Array.isArray(categorias)) {
          throw new Error("Resposta inválida ao carregar as categorias.");
        }

        setCategoriasDisponiveis(categorias);
        setErroCarregamentoCategorias("");
      } catch (erro) {
        if (!componenteAtivo) return;

        setErroCarregamentoCategorias(
          erro.message || "Não foi possível carregar as categorias.",
        );
      } finally {
        if (componenteAtivo) {
          setCategoriasCarregando(false);
        }
      }
    }

    carregarCategorias();

    return () => {
      componenteAtivo = false;
    };
  }, []);

  function alterarCategoria(idCategoria) {
    setCategoriasSelecionadas((selecionadas) =>
      selecionadas.includes(idCategoria)
        ? selecionadas.filter((id) => id !== idCategoria)
        : [...selecionadas, idCategoria],
    );

    setErroCategorias("");
  }

  async function validarImagens(event) {
    const input = event.currentTarget;
    const arquivos = Array.from(input.files || []);
    const idValidacao = ++validacaoAtual.current;

    setValidandoImagens(false);

    if (arquivos.length < 3 || arquivos.length > 5) {
      setImagensSelecionadas([]);
      setErroImagens("Selecione de 3 a 5 imagens.");
      return;
    }

    if (arquivos.some((arquivo) => !ehImagemPermitida(arquivo))) {
      input.value = "";
      setImagensSelecionadas([]);
      setErroImagens(
        "Envie apenas imagens JPG, PNG ou WEBP de até 5 MB cada.",
      );
      return;
    }

    setValidandoImagens(true);
    setErroImagens("");

    const imagensValidas = await Promise.all(
      arquivos.map(async (arquivo) => {
        try {
          const imagem = await createImageBitmap(arquivo);
          imagem.close();
          return true;
        } catch {
          return false;
        }
      }),
    );

    if (idValidacao !== validacaoAtual.current) {
      return;
    }

    setValidandoImagens(false);

    if (imagensValidas.some((imagemValida) => !imagemValida)) {
      input.value = "";
      setImagensSelecionadas([]);
      setErroImagens(
        "Um ou mais arquivos não são imagens válidas. Selecione imagens JPG, PNG ou WEBP.",
      );
      return;
    }

    setImagensSelecionadas(arquivos);
    setErroImagens("");
  }

  function enviarFormulario(event) {
    event.preventDefault();

    if (categoriasCarregando || erroCarregamentoCategorias) {
      setErroCategorias("Não foi possível carregar as categorias.");
      return;
    }

    if (categoriasSelecionadas.length === 0) {
      setErroCategorias("Selecione pelo menos uma categoria.");
      return;
    }

    if (imagensSelecionadas.length < 3 || imagensSelecionadas.length > 5) {
      setErroImagens("Selecione de 3 a 5 imagens para continuar.");
      return;
    }

    if (validandoImagens) {
      return;
    }

    const dados = {
      descricaoCurta,
      descricaoCompleta,
      categorias: categoriasSelecionadas,
      imagens: imagensSelecionadas,
    };

    if (onNext) {
      onNext(dados);
      return;
    }

    console.log(dados);
  }

  return (
    <form
      onSubmit={enviarFormulario}
      className="rounded-3xl border border-base-300 bg-base-100 p-7 shadow-sm md:p-9"
    >
      <div className="mb-9 flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-secondary text-2xl text-primary">
          <i className="fa-solid fa-pen-to-square" aria-hidden="true"></i>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-primary">
            Cadastro de ONG — Passo 2 de 3
          </p>
          <h2 className="text-2xl font-black text-base-content">
            Informações da ONG
          </h2>
          <p className="mt-1 text-sm text-base-content/55">
            Descreva a atuação da ONG, suas causas e o trabalho que realiza.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <CampoFormulario
            label="Descrição curta"
            id="descricaoCurta"
            placeholder="Apresente sua ONG em poucas palavras."
            textarea
            textareaClassName="min-h-[4.5rem]"
            maxLength={250}
            value={descricaoCurta}
            onChange={(event) => setDescricaoCurta(event.target.value)}
            required
          />
          <p className="mt-2 text-right text-xs text-base-content/55">
            {descricaoCurta.length}/250 caracteres
          </p>
        </div>

        <div>
          <CampoFormulario
            label="Descrição completa"
            id="descricaoCompleta"
            placeholder="Conte a história, os objetivos e as atividades da ONG."
            textarea
            textareaClassName="min-h-[4.5rem]"
            maxLength={500}
            value={descricaoCompleta}
            onChange={(event) => setDescricaoCompleta(event.target.value)}
            required
          />
          <p className="mt-2 text-right text-xs text-base-content/55">
            {descricaoCompleta.length}/500 caracteres
          </p>
        </div>

        <fieldset>
          <legend className="mb-3 text-sm font-bold text-base-content">
            Categorias
            <span className="ml-1 text-primary" aria-hidden="true">
              *
            </span>
          </legend>

          {categoriasCarregando && (
            <p className="text-sm text-base-content/70" aria-live="polite">
              Carregando categorias...
            </p>
          )}

          {erroCarregamentoCategorias && (
            <div className="space-y-2">
              <p className="text-sm text-error" role="alert">
                {erroCarregamentoCategorias}
              </p>
              <button
                type="button"
                className="btn btn-sm rounded-xl"
                onClick={() => {
                  setCategoriasCarregando(true);
                  setErroCarregamentoCategorias("");

                  apiFetch("/api/categorias")
                    .then((categorias) => {
                      if (!Array.isArray(categorias)) {
                        throw new Error(
                          "Resposta inválida ao carregar as categorias.",
                        );
                      }

                      setCategoriasDisponiveis(categorias);
                    })
                    .catch((erro) => {
                      setErroCarregamentoCategorias(
                        erro.message ||
                          "Não foi possível carregar as categorias.",
                      );
                    })
                    .finally(() => setCategoriasCarregando(false));
                }}
              >
                Tentar novamente
              </button>
            </div>
          )}

          {!categoriasCarregando &&
            !erroCarregamentoCategorias &&
            categoriasDisponiveis.length === 0 && (
              <p className="text-sm text-base-content/70">
                Nenhuma categoria está cadastrada no momento.
              </p>
            )}

          {!categoriasCarregando &&
            !erroCarregamentoCategorias &&
            categoriasDisponiveis.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {categoriasDisponiveis.map((categoria) => (
                  <label
                    key={categoria.idCategoria}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-base-300 px-4 py-3 text-sm text-base-content transition hover:border-primary"
                  >
                    <input
                      type="checkbox"
                      name="categorias"
                      value={categoria.idCategoria}
                      checked={categoriasSelecionadas.includes(
                        categoria.idCategoria,
                      )}
                      onChange={() =>
                        alterarCategoria(categoria.idCategoria)
                      }
                      className="checkbox checkbox-primary checkbox-sm"
                    />
                    {categoria.nome}
                  </label>
                ))}
              </div>
            )}

          {erroCategorias && (
            <p className="mt-2 text-sm text-error" role="alert">
              {erroCategorias}
            </p>
          )}
        </fieldset>

        <div>
          <UploadImagem
            label="Imagens da ONG"
            id="imagens"
            required
            multiple
            compact
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            ajuda="Selecione de 3 a 5 imagens JPG, PNG ou WEBP de até 5 MB cada. Vídeos, documentos e executáveis não são aceitos."
            erro={erroImagens}
            onChange={validarImagens}
          />
          {validandoImagens && (
            <p
              className="mt-2 text-sm text-base-content/70"
              aria-live="polite"
            >
              Validando arquivos selecionados...
            </p>
          )}
        </div>
      </div>

      <div className="my-8 border-t border-base-300"></div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="btn h-12 rounded-xl border-base-300 bg-base-100 px-7 font-bold hover:border-primary hover:bg-primary/5 hover:text-primary"
        >
          Voltar
        </button>
        <button
          type="submit"
          disabled={!podeAvancar}
          className={`btn h-12 rounded-xl border-base-300 px-8 font-bold ${
            podeAvancar
              ? "btn-primary"
              : "bg-base-100 text-base-content disabled:opacity-60"
          }`}
        >
          Continuar
        </button>
      </div>
    </form>
  );
}

export default DescricaoOng;
