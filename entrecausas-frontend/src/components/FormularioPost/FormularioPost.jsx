import { useState } from "react";
import CampoFormulario from "../Form/CampoFormulario";
import SelectFormulario from "../Form/SelectFormulario";
import UploadImagem from "../Form/UploadImagem";

import listaOngs from "../../data/ongs";

// Lista de Categorias padronizada
const CATEGORIAS = [
  { value: "Educacao", label: "Educação" },
  { value: "Solidariedade", label: "Solidariedade" },
  { value: "Cultura", label: "Cultura" },
  { value: "Animais", label: "Animais" },
  { value: "MeioAmbiente", label: "Meio Ambiente" },
  { value: "Saude", label: "Saúde" },
  { value: "Esporte", label: "Esporte" },
];

function FormularioPost({ onSubmit, onCancel }) {
  const [carregando, setCarregando] = useState(false);
  const [caracteresDescricao, setCaracteresDescricao] = useState(0);
  const [organizacaoSelecionada, setOrganizacaoSelecionada] = useState("");
  const [formKey, setFormKey] = useState(0);

  // Monta as opções de organizações com a opção "Outros" no final
  const organizacoesOptions = [
    ...listaOngs.map((ong) => ({
      value: String(ong.id),
      label: ong.nome,
    })),
    { value: "outros", label: "Outros (Minha ONG não está na lista)" },
  ];

  async function enviarFormulario(event) {
    event.preventDefault();
    setCarregando(true);

    const formData = new FormData(event.currentTarget);
    const imagensArquivos = formData.getAll("imagem");

    try {
      let imagensUrls = [];

      // 1. Upload das imagens na API Spring Boot
      const arquivosValidos = imagensArquivos.filter(
        (file) => file instanceof File && file.size > 0
      );

      if (arquivosValidos.length > 0) {
        const uploadPromises = arquivosValidos.map(async (file) => {
          const imageFormData = new FormData();
          imageFormData.append("file", file);

          try {
            const uploadRes = await fetch("http://localhost:8080/uploads", {
              method: "POST",
              body: imageFormData,
            });

            if (uploadRes.ok) {
              const uploadData = await uploadRes.json();
              return uploadData.url;
            }
          } catch (err) {
            console.warn("Erro ao fazer upload da imagem:", err);
          }
          return null;
        });

        const resultados = await Promise.all(uploadPromises);
        imagensUrls = resultados.filter((url) => url !== null);
      }

      // 2. Monta os dados estruturados do formulário
      const isOutros = organizacaoSelecionada === "outros";
      const nomeOngManual = formData.get("nomeOngOutros");

      const dados = {
        titulo: formData.get("titulo"),
        categoria: formData.get("categoria"),
        organizacaoId: isOutros ? null : formData.get("organizacao"),
        nomeOrganizacaoManual: isOutros ? nomeOngManual : null,
        descricao: formData.get("descricao"),
        emailContato: formData.get("email"),
        imagensUrls: imagensUrls,
        localizacao: "Itapetininga",
      };

      // 3. Envia os dados para a página pai (src/pages/FormularioPost.jsx)
      if (onSubmit) {
        await onSubmit(dados);
      }

      // 4. Limpa os campos do formulário
      event.target.reset();
      setCaracteresDescricao(0);
      setOrganizacaoSelecionada("");
      setFormKey((prev) => prev + 1);

    } catch (error) {
      console.error("Erro no formulário:", error);
      alert("Ocorreu um erro ao processar os dados.");
    } finally {
      setCarregando(false);
    }
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
            Preencha os dados abaixo para submeter sua publicação para moderação.
          </p>
        </div>
      </div>

      {/* TÍTULO + CATEGORIA */}
      <div className="grid gap-6 md:grid-cols-2">
        <CampoFormulario
          label="Título da publicação"
          id="titulo"
          name="titulo"
          type="text"
          placeholder="Ex: Campanha de arrecadação de alimentos"
          required
        />

        <SelectFormulario
          label="Categoria"
          id="categoria"
          name="categoria"
          placeholder="Selecione uma categoria"
          options={CATEGORIAS}
          required
        />
      </div>

      {/* ORGANIZAÇÃO */}
      <div className="mt-6">
        <SelectFormulario
          label="Organização"
          id="organizacao"
          name="organizacao"
          placeholder="Selecione a organização responsável"
          options={organizacoesOptions}
          onChange={(e) => setOrganizacaoSelecionada(e.target.value)}
          required
        />
      </div>

      {/* CAMPO EXTRA QUANDO SELECIONAR 'OUTROS' */}
      {organizacaoSelecionada === "outros" && (
        <div className="mt-4 rounded-2xl bg-base-200/50 p-4 border border-base-300">
          <CampoFormulario
            label="Nome da sua Organização / ONG"
            id="nomeOngOutros"
            name="nomeOngOutros"
            type="text"
            placeholder="Ex: Instituto Proteção Animal Itapetininga"
            required
          />
        </div>
      )}

      {/* DESCRIÇÃO */}
      <div className="mt-6">
        <CampoFormulario
          label="Descrição"
          id="descricao"
          name="descricao"
          placeholder="Conte detalhes sobre a iniciativa, seus objetivos, quem será beneficiado e como as pessoas podem ajudar..."
          textarea
          maxLength={1000}
          onChange={(e) => setCaracteresDescricao(e.target.value.length)}
          required
        />

        <p className="mt-2 text-right text-xs text-base-content/40">
          {caracteresDescricao} / 1000 caracteres
        </p>
      </div>

      {/* IMAGENS + EMAIL */}
      <div className="mt-7 grid items-start gap-6 lg:grid-cols-2">
        <UploadImagem
          key={formKey}
          label="Imagens da publicação (pode selecionar várias)"
          id="imagem"
          name="imagem"
          multiple
        />

        <div>
          <CampoFormulario
            label="E-mail para contato"
            id="email"
            name="email"
            type="email"
            placeholder="exemplo@organizacao.org.br"
            autoComplete="email"
            required
          />
        </div>
      </div>

      {/* DIVISOR */}
      <div className="my-8 border-t border-base-300"></div>

      {/* BOTÕES */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onCancel}
          disabled={carregando}
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
          disabled={carregando}
          className="
            btn
            btn-primary
            h-12
            rounded-xl
            px-8
            font-bold
          "
        >
          {carregando ? (
            <>
              <span className="loading loading-spinner loading-xs"></span>
              Enviando...
            </>
          ) : (
            <>
              <i className="fa-regular fa-paper-plane" aria-hidden="true"></i>
              Publicar
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default FormularioPost;