import { useEffect, useRef, useState } from "react";

function UploadImagem({
  label,
  id,
  name,
  multiple = false,
  required = false,
  erro = "",
  accept = "image/png, image/jpeg, image/webp",
  ajuda = "Formatos aceitos: JPG, PNG ou WEBP (máx. 5MB)",
  compact = false,
  onChange,
}) {
  const inputRef = useRef(null);
  const previewUrls = useRef([]);
  const [arquivos, setArquivos] = useState([]);

  useEffect(
    () => () => previewUrls.current.forEach((url) => URL.revokeObjectURL(url)),
    [],
  );

  function handleSelecionarArquivo(event) {
    previewUrls.current.forEach((url) => URL.revokeObjectURL(url));
    previewUrls.current = [];

    const selecionados = Array.from(event.target.files || []);
    const arquivosComPreview = selecionados.map((arquivo) => {
      const preview = arquivo.type.startsWith("image/")
        ? URL.createObjectURL(arquivo)
        : "";

      if (preview) {
        previewUrls.current.push(preview);
      }

      return { nome: arquivo.name, preview };
    });
    setArquivos(arquivosComPreview);

    if (onChange) {
      onChange(event);
    }
  }

  function removerImagem(indexParaRemover, e) {
    e.stopPropagation();

    const arquivoParaRemover = arquivos[indexParaRemover];
    if (arquivoParaRemover?.preview) {
      URL.revokeObjectURL(arquivoParaRemover.preview);
      previewUrls.current = previewUrls.current.filter(
        (url) => url !== arquivoParaRemover.preview,
      );
    }

    const listaArquivosAtualizada = arquivos.filter(
      (_, index) => index !== indexParaRemover,
    );
    setArquivos(listaArquivosAtualizada);
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
        name={name || id}
        type="file"
        multiple={multiple}
        accept={accept}
        aria-describedby={`${id}-ajuda${erro ? ` ${id}-erro` : ""}`}
        onChange={handleSelecionarArquivo}
        className="hidden"
      />

      <div
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
          ${compact ? "py-[15px]" : "py-8"}
          text-center
          transition
          hover:border-primary
          hover:bg-base-200/40
          ${erro ? "border-error" : "border-base-300"}
        `}
      >
        {arquivos.length > 0 ? (
          <div className="w-full">
            {arquivos.some((arquivo) => arquivo.preview) && (
              <div
                className={`${compact ? "mb-2" : "mb-4"} grid gap-3 ${
                  multiple ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-1"
                }`}
              >
                {arquivos
                  .filter((arquivo) => arquivo.preview)
                  .map((arquivo, indice) => (
                    <div
                      key={`${arquivo.nome}-${indice}`}
                      className="relative group"
                    >
                      <img
                        src={arquivo.preview}
                        alt={`Pré-visualização de ${arquivo.nome}`}
                        className={`w-full rounded-xl object-cover ${
                          compact ? "h-[5.25rem]" : "h-36"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={(e) => removerImagem(indice, e)}
                        className="absolute top-2 right-2 rounded-full bg-error/90 p-1.5 text-white transition hover:bg-error"
                        title="Remover imagem"
                      >
                        <i className="fa-solid fa-xmark block text-xs"></i>
                      </button>
                    </div>
                  ))}
              </div>
            )}

            <p className="font-semibold text-base-content">
              {arquivos.map((arquivo) => arquivo.nome).join(", ")}
            </p>

            <p className="mt-1 text-sm text-base-content/55">
              Clique para {multiple ? "trocar os arquivos" : "trocar a imagem"}
            </p>
          </div>
        ) : (
          <>
            <div
              className={`mb-3 flex items-center justify-center rounded-2xl bg-secondary text-primary ${
                compact ? "h-9 w-9" : "h-16 w-16"
              }`}
            >
              <i
                className={`fa-regular fa-image ${
                  compact ? "text-base" : "text-2xl"
                }`}
              ></i>
            </div>

            <p className="font-semibold text-base-content">
              {multiple
                ? "Clique para enviar imagens"
                : "Clique para enviar uma imagem"}
            </p>

            <p className="text-sm text-base-content/55">
              ou arraste e solte aqui
            </p>

            <p id={`${id}-ajuda`} className="mt-3 text-xs text-base-content/45">
              {ajuda}
            </p>
          </>
        )}
      </div>

      {arquivos.length > 0 && (
        <p id={`${id}-ajuda`} className="sr-only">
          {ajuda}
        </p>
      )}
      {erro && (
        <p id={`${id}-erro`} className="mt-2 text-sm text-error" role="alert">
          {erro}
        </p>
      )}
    </div>
  );
}

export default UploadImagem;
