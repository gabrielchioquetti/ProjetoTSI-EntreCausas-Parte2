import CampoFormulario from "../Form/CampoFormulario";
import SelectFormulario from "../Form/SelectFormulario";
import UploadImagem from "../Form/UploadImagem";

import listaOngs from "../../data/ongs";

function FormularioPost({ onSubmit, onCancel }) {
  const categorias = [
    ...new Set(listaOngs.map((ong) => ong.categoriaPrincipal).filter(Boolean)),
  ].map((categoria) => ({
    value: categoria,
    label: categoria,
  }));

  const organizacoes = listaOngs.map((ong) => ({
    value: ong.id,
    label: ong.nome,
  }));

  function enviarFormulario(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const dados = {
      titulo: formData.get("titulo"),
      categoria: formData.get("categoria"),
      organizacao: formData.get("organizacao"),
      descricao: formData.get("descricao"),
      imagem: formData.get("imagem"),

      email: formData.get("email"),
    };

    if (onSubmit) {
      onSubmit(dados);
      return;
    }

    console.log(dados);
  }

  return (
    <form
      onSubmit={enviarFormulario}
      className="
                rounded-3xl
                border
                border-base-300
                bg-base-100
                p-7
                shadow-sm
                md:p-9
              "
    >
      {/* TÍTULO DO CARD */}

      <div className="mb-9 flex items-center gap-4">
        <div
          className="
                    flex
                    h-14
                    w-14
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    bg-secondary
                    text-2xl
                    text-primary
                  "
        >
          <i className="fa-solid fa-pen-to-square" aria-hidden="true"></i>
        </div>

        <div>
          <h2 className="text-2xl font-black text-base-content">
            Informações da publicação
          </h2>

          <p className="mt-1 text-sm text-base-content/55">
            Preencha os dados abaixo para criar sua publicação.
          </p>
        </div>
      </div>

      {/* ================================================= */}
      {/* TÍTULO + CATEGORIA */}
      {/* ================================================= */}

      <div className="grid gap-6 md:grid-cols-2">
        <CampoFormulario
          label="Título da publicação"
          id="titulo"
          type="text"
          placeholder="Ex: Campanha de arrecadação de alimentos"
          required
        />

        <SelectFormulario
          label="Categoria"
          id="categoria"
          placeholder="Selecione uma categoria"
          options={categorias}
          required
        />
      </div>

      {/* ================================================= */}
      {/* ORGANIZAÇÃO */}
      {/* ================================================= */}

      <div className="mt-6">
        <SelectFormulario
          label="Organização"
          id="organizacao"
          placeholder="Selecione a organização responsável"
          options={organizacoes}
          required
        />
      </div>

      {/* ================================================= */}
      {/* DESCRIÇÃO */}
      {/* ================================================= */}

      <div className="mt-6">
        <CampoFormulario
          label="Descrição"
          id="descricao"
          placeholder="Conte detalhes sobre a iniciativa, seus objetivos, quem será beneficiado e como as pessoas podem ajudar..."
          textarea
          maxLength={1000}
          required
        />

        <p className="mt-2 text-right text-xs text-base-content/40">
          Máximo de 1000 caracteres
        </p>
      </div>

      {/* ================================================= */}
      {/* IMAGEM + STATUS / EMAIL */}
      {/* ================================================= */}

      <div className="mt-7 grid items-start gap-6 lg:grid-cols-2">
        {/* UPLOAD */}
        <UploadImagem label="Imagem da publicação" id="imagem" required />

        {/* DIREITA */}
        <div className="space-y-6">
          <CampoFormulario
            label="E-mail para contato"
            id="email"
            type="email"
            placeholder="exemplo@organizacao.org.br"
            autoComplete="email"
            required
          />
        </div>
      </div>

      {/* ================================================= */}
      {/* DIVISOR */}
      {/* ================================================= */}

      <div className="my-8 border-t border-base-300"></div>

      {/* ================================================= */}
      {/* BOTÕES */}
      {/* ================================================= */}

      <div
        className="
                  flex
                  flex-col-reverse
                  gap-3
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
      >
        <button
          type="button"
          onClick={onCancel}
          className="
                    btn
                    h-12
                    rounded-xl
                    border-base-300
                    bg-base-100
                    px-7
                    font-bold
                    hover:border-primary
                    hover:bg-primary/5
                    hover:text-primary
                  "
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="
                    btn
                    btn-primary
                    h-12
                    rounded-xl
                    px-8
                    font-bold
                  "
        >
          <i className="fa-regular fa-paper-plane" aria-hidden="true"></i>
          Publicar
        </button>
      </div>
    </form>
  );
}

export default FormularioPost;