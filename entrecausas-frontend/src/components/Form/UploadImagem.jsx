import { useEffect, useRef, useState } from "react";

function UploadImagem({
  label,
  id,
  name,
  multiple = false,
  required = false,
  erro = "",
  accept = "image/png, image/jpeg, image/webp",
  ajuda = "Formatos aceitos: JPG, PNG ou WEBP (máx. 5MB cada)",
  onChange,
}) {
  const inputRef = useRef(null);
  const [arquivos, setArquivos] = useState([]);
  const [previews, setPreviews] = useState([]);

  // 1. SINCRONIZA OS ARQUIVOS DO REACT COM O INPUT NATIVO HTML
  useEffect(() => {
    if (!inputRef.current) return;

    const dataTransfer = new DataTransfer();
    arquivos.forEach((file) => dataTransfer.items.add(file));
    inputRef.current.files = dataTransfer.files;
  }, [arquivos]);

  function handleSelecionarArquivo(event) {
    const novoficheiros = Array.from(event.target.files || []);

    if (novoficheiros.length === 0) return;

    if (multiple) {
      const listaAtualizada = [...arquivos, ...novoficheiros];
      setArquivos(listaAtualizada);

      const novasPreviews = novoficheiros.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...novasPreviews]);
    } else {
      if (previews[0]) URL.revokeObjectURL(previews[0]);

      setArquivos([novoficheiros[0]]);
      setPreviews([URL.createObjectURL(novoficheiros[0])]);
    }

    if (onChange) {
      onChange(event);
    }
  }

  function removerImagem(indexParaRemover, e) {
    e.stopPropagation();

    // 2. LIBERA MEMÓRIA DA URL DE PREVIEW REMOVIDA
    URL.revokeObjectURL(previews[indexParaRemover]);

    const listaArquivosAtualizada = arquivos.filter((_, index) => index !== indexParaRemover);
    const listaPreviewsAtualizada = previews.filter((_, index) => index !== indexParaRemover);

    setArquivos(listaArquivosAtualizada);
    setPreviews(listaPreviewsAtualizada);
  }

  function abrirSeletor() {
    inputRef.current?.click();
  }

  return (
    <div className="w-full">
      <label htmlFor={id} className="mb-2 block text-sm font-bold text-base-content">
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
        onChange={handleSelecionarArquivo}
        className="hidden"
      />

      <div
        onClick={abrirSeletor}
        className={`flex w-full cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed bg-base-100 p-6 text-center transition hover:border-primary hover:bg-base-200/40 ${
          erro ? "border-error" : "border-base-300"
        }`}
      >
        {previews.length > 0 ? (
          <div className="w-full">
            <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {previews.map((src, index) => (
                <div
                  key={index}
                  className="relative group h-28 w-full overflow-hidden rounded-xl border border-base-300"
                >
                  <img
                    src={src}
                    alt={`Preview ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={(e) => removerImagem(index, e)}
                    className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-error text-xs font-bold text-white shadow-md hover:bg-error/80"
                    title="Remover imagem"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <p className="font-semibold text-base-content">
              {arquivos.length}{" "}
              {arquivos.length === 1 ? "imagem selecionada" : "imagens selecionadas"}
            </p>

            <p className="mt-1 text-xs text-base-content/55">
              Clique para adicionar mais fotos
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-primary">
              <i className="fa-regular fa-image text-2xl"></i>
            </div>

            <p className="font-semibold text-base-content">
              {multiple ? "Clique para enviar imagens" : "Clique para enviar uma imagem"}
            </p>

            <p className="text-sm text-base-content/55">ou arraste e solte aqui</p>

            <p className="mt-3 text-xs text-base-content/45">{ajuda}</p>
          </>
        )}
      </div>

      {erro && <p className="mt-2 text-sm text-error">{erro}</p>}
    </div>
  );
}

export default UploadImagem;