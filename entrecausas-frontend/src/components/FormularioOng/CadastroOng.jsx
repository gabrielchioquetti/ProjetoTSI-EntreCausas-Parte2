import { useRef, useState } from "react";
import CampoDocumento from "../Form/CampoDocumento";
import CampoFormulario from "../Form/CampoFormulario";
import CampoTelefone from "../Form/CampoTelefone";

function CadastroOng({ onNext, onCancel }) {
  const [podeAvancar, setPodeAvancar] = useState(false);
  const formularioRef = useRef(null);

  // Mantém os valores digitados nesta etapa.
  const [dados, setDados] = useState({
    nome: "",
    cnpj: "",
    telefone: "",
    instagram: "",
  });

  // Atualiza o campo alterado sem perder os outros valores.
  function atualizarCampo(event) {
    const { id, value } = event.target;

    setDados((anteriores) => ({
      ...anteriores,
      [id]: value,
    }));
  }

  function validarFormulario() {
    setPodeAvancar(
      formularioRef.current?.checkValidity() ?? false,
    );
  }

  function avancar(event) {
    event.preventDefault();

    const formulario = event.currentTarget;

    if (!formulario.checkValidity()) {
      formulario.reportValidity();
      return;
    }

    onNext(dados);
  }

  return (
    <form
      ref={formularioRef}
      onSubmit={avancar}
      onInput={validarFormulario}
      className="rounded-3xl border border-base-300 bg-base-100 p-7 shadow-sm md:p-9"
    >
      <div className="mb-9 flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-secondary text-2xl text-primary">
          <i
            className="fa-solid fa-pen-to-square"
            aria-hidden="true"
          ></i>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-primary">
            Cadastro de ONG — Passo 1 de 3
          </p>
          <h2 className="text-2xl font-black text-base-content">
            Dados da ONG
          </h2>
          <p className="mt-1 text-sm text-base-content/55">
            Preencha os dados principais da sua organização.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <CampoFormulario
          label="Nome da ONG"
          id="nome"
          placeholder="Ex: Instituto Esperança"
          autoComplete="organization"
          required
          value={dados.nome}
          onChange={atualizarCampo}
        />

        <CampoDocumento
          tipo="cnpj"
          required
          value={dados.cnpj}
          onChange={atualizarCampo}
        />

        <CampoTelefone
          required
          value={dados.telefone}
          onChange={atualizarCampo}
        />

        <CampoFormulario
          label="Instagram"
          id="instagram"
          placeholder="@suaong"
          value={dados.instagram}
          onChange={atualizarCampo}
        />
      </div>

      <div className="my-8 border-t border-base-300"></div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onCancel}
          className="btn h-12 rounded-xl border-base-300 bg-base-100 px-7 font-bold hover:border-primary hover:bg-primary/5 hover:text-primary"
        >
          Cancelar
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
          Próximo
        </button>
      </div>
    </form>
  );
}

export default CadastroOng;