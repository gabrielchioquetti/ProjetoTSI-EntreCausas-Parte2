import { useRef, useState } from "react";

function UploadImagem({
  label,
  id,
  required = false,
  erro = "",
  accept = "image/png, image/jpeg, image/webp",
  ajuda = "Formatos aceitos: JPG, PNG ou WEBP (máx. 5MB)",
  onChange,
}) {
  const inputRef = useRef(null);
  const [nomeArquivo, setNomeArquivo] = useState("");
  const [preview, setPreview] = useState("");

  function handleSelecionarArquivo(event) {
    const arquivo = event.target.files?.[0];

    if (!arquivo) return;

    setNomeArquivo(arquivo.name);
    setPreview(URL.createObjectURL(arquivo));

    if (onChange) {
      onChange(event);
    }
  }

  function abrirSeletor() {
    inputRef.current?.click();
  }

  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-bold text-base-content"
      >
        {label}

        {required && (
          <span className="ml-1 text-primary" aria-hidden="true">
            *
          </span>
        )}
      </label>

      <input
        ref={inputRef}
        id={id}
        name={id}
        type="file"
        accept={accept}
        onChange={handleSelecionarArquivo}
        className="hidden"
      />

      <button
        type="button"
        onClick={abrirSeletor}
        className={`
          flex
          w-full
          flex-col
          items-center
          justify-center
          rounded-2xl
          border
          border-dashed
          bg-base-100
          px-6
          py-8
          text-center
          transition
          hover:border-primary
          hover:bg-base-200/40

          ${erro ? "border-error" : "border-base-300"}
        `}
      >
        {preview ? (
          <div className="w-full">
            <img
              src={preview}
              alt="Pré-visualização da imagem enviada"
              className="mx-auto mb-4 h-36 w-full max-w-xs rounded-xl object-cover"
            />

            <p className="font-semibold text-base-content">{nomeArquivo}</p>

            <p className="mt-1 text-sm text-base-content/55">
              Clique para trocar a imagem
            </p>
          </div>
        ) : (
          <>
            <div
              className="
                mb-4
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-secondary
                text-primary
              "
            >
              <i className="fa-regular fa-image text-2xl"></i>
            </div>

            <p className="font-semibold text-base-content">
              Clique para enviar uma imagem
            </p>

            <p className="text-sm text-base-content/55">
              ou arraste e solte aqui
            </p>

            <p className="mt-3 text-xs text-base-content/45">{ajuda}</p>
          </>
        )}
      </button>

      {erro && <p className="mt-2 text-sm text-error">{erro}</p>}
    </div>
  );
}

export default UploadImagem;
