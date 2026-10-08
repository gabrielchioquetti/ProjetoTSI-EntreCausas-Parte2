import { useRef, useState } from "react";
import CampoFormulario from "../Form/CampoFormulario";
import UploadImagem from "../Form/UploadImagem";
import listaOngs from "../../data/ongs";

const categoriasDisponiveis = [
  ...new Set(listaOngs.map((ong) => ong.categoriaPrincipal).filter(Boolean)),
];

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
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState([]);
  const [imagensSelecionadas, setImagensSelecionadas] = useState([]);
  const [erroCategorias, setErroCategorias] = useState("");
  const [erroImagens, setErroImagens] = useState("");
  const [validandoImagens, setValidandoImagens] = useState(false);
  const validacaoAtual = useRef(0);
  const podeAvancar =
    descricaoCurta.trim().length > 0 &&
    descricaoCompleta.trim().length > 0 &&
    categoriasSelecionadas.length > 0 &&
    imagensSelecionadas.length >= 3 &&
    imagensSelecionadas.length <= 5 &&
    !validandoImagens;

  function alterarCategoria(categoria) {
    setCategoriasSelecionadas((selecionadas) =>
      selecionadas.includes(categoria)
        ? selecionadas.filter((item) => item !== categoria)
        : [...selecionadas, categoria],
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
      setErroImagens("Envie apenas imagens JPG, PNG ou WEBP de até 5 MB cada.");
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
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categoriasDisponiveis.map((categoria) => (
              <label
                key={categoria}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-base-300 px-4 py-3 text-sm text-base-content transition hover:border-primary"
              >
                <input
                  type="checkbox"
                  name="categorias"
                  value={categoria}
                  checked={categoriasSelecionadas.includes(categoria)}
                  onChange={() => alterarCategoria(categoria)}
                  className="checkbox checkbox-primary checkbox-sm"
                />
                {categoria}
              </label>
            ))}
          </div>
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
            <p className="mt-2 text-sm text-base-content/70" aria-live="polite">
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
