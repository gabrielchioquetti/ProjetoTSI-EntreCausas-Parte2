import { useEffect, useState } from "react";

import CampoFormulario from "../Form/CampoFormulario";
import SelectFormulario from "../Form/SelectFormulario";
import UploadImagem from "../Form/UploadImagem";

import { apiFetch } from "../../services/Api";

function FormularioPost({ onSubmit, onCancel }) {
  const [categorias, setCategorias] = useState([]);
  const [carregandoCategorias, setCarregandoCategorias] = useState(true);
  const [erroCategorias, setErroCategorias] = useState("");

  // Carrega as categorias das ONGs cadastradas na API.
  useEffect(() => {
    let ativo = true;

    async function carregarCategorias() {
      try {
        setCarregandoCategorias(true);
        setErroCategorias("");

        const dados = await apiFetch("/api/ongs");

        if (!ativo) return;

        const ongs = Array.isArray(dados) ? dados : [];

        const nomesCategorias = ongs
          .flatMap((ong) => ong.categorias || [])
          .map((categoria) => categoria.nomeCategoria)
          .filter(Boolean);

        const categoriasUnicas = [...new Set(nomesCategorias)];

        setCategorias(
          categoriasUnicas.map((categoria) => ({
            value: categoria,
            label: categoria,
          })),
        );
      } catch (error) {
        if (!ativo) return;

        setErroCategorias(
          error.message || "Não foi possível carregar as categorias.",
        );
      } finally {
        if (ativo) {
          setCarregandoCategorias(false);
        }
      }
    }

    carregarCategorias();

    return () => {
      ativo = false;
    };
  }, []);

  function enviarFormulario(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const dados = {
      titulo: formData.get("titulo"),
      categoria: formData.get("categoria"),
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

        <div>
          <SelectFormulario
            label="Categoria"
            id="categoria"
            placeholder={
              carregandoCategorias
                ? "Carregando categorias..."
                : "Selecione uma categoria"
            }
            options={categorias}
            required
          />

          {erroCategorias && (
            <p role="alert" className="mt-2 text-sm text-error">
              {erroCategorias}
            </p>
          )}
        </div>
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
            placeholder="contato@exemplo.com"
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
          disabled={carregandoCategorias || Boolean(erroCategorias)}
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