import { useEffect, useRef, useState } from "react";
import CampoFormulario from "../Form/CampoFormulario";

const enderecoVazio = {
  logradouro: "",
  bairro: "",
  cidade: "",
  estado: "",
};

function EnderecoOng({ onSubmit, onBack }) {
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState(enderecoVazio);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [revisaoCampos, setRevisaoCampos] = useState(0);
  const [podeConcluir, setPodeConcluir] = useState(false);
  const requisicaoAtual = useRef(null);
  const formularioRef = useRef(null);

  useEffect(() => () => requisicaoAtual.current?.abort(), []);

  useEffect(() => {
    setPodeConcluir(
      !carregando && (formularioRef.current?.checkValidity() ?? false),
    );
  }, [carregando, cep, endereco, revisaoCampos]);

  async function consultarCep(valorCep, controller) {
    try {
      const resposta = await fetch(
        `https://viacep.com.br/ws/${valorCep}/json/`,
        { signal: controller.signal },
      );

      if (!resposta.ok) {
        throw new Error("Não foi possível consultar o CEP.");
      }

      const dados = await resposta.json();

      if (dados.erro) {
        throw new Error("CEP não encontrado.");
      }

      if (!controller.signal.aborted) {
        setEndereco({
          logradouro: dados.logradouro || "",
          bairro: dados.bairro || "",
          cidade: dados.localidade || "",
          estado: dados.uf || "",
        });
      }
    } catch (erroConsulta) {
      if (erroConsulta.name === "AbortError") {
        return;
      }

      if (!controller.signal.aborted) {
        setEndereco(enderecoVazio);
        setErro(erroConsulta.message || "Não foi possível consultar o CEP.");
      }
    } finally {
      if (!controller.signal.aborted) {
        setCarregando(false);
      }
    }
  }

  function alterarCep(event) {
    const numeros = event.target.value.replace(/\D/g, "").slice(0, 8);
    const cepFormatado =
      numeros.length > 5
        ? `${numeros.slice(0, 5)}-${numeros.slice(5)}`
        : numeros;

    setCep(cepFormatado);
    requisicaoAtual.current?.abort();
    setEndereco(enderecoVazio);
    setErro("");
    setCarregando(false);

    if (numeros.length === 8) {
      const controller = new AbortController();
      requisicaoAtual.current = controller;
      setCarregando(true);
      consultarCep(numeros, controller);
    }
  }

  function enviarEndereco(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    onSubmit({
      cep: formData.get("cep"),
      logradouro: formData.get("logradouro"),
      numero: formData.get("numero"),
      complemento: formData.get("complemento"),
      bairro: formData.get("bairro"),
      cidade: formData.get("cidade"),
      estado: formData.get("estado"),
    });
  }

  return (
    <form
      ref={formularioRef}
      onSubmit={enviarEndereco}
      onInput={() => setRevisaoCampos((revisao) => revisao + 1)}
      className="rounded-3xl border border-base-300 bg-base-100 p-7 shadow-sm md:p-9"
    >
      <div className="mb-9 flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-secondary text-2xl text-primary">
          <i className="fa-solid fa-pen-to-square" aria-hidden="true"></i>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-primary">
            Cadastro de ONG — Passo 3 de 3
          </p>
          <h2 className="text-2xl font-black text-base-content">
            Endereço da ONG
          </h2>
          <p className="mt-1 text-sm text-base-content/55">
            Preencha o endereço da sua organização.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <CampoFormulario
            label="CEP"
            id="cep"
            type="text"
            placeholder="00000-000"
            autoComplete="postal-code"
            inputMode="numeric"
            maxLength={9}
            pattern="[0-9]{5}-[0-9]{3}"
            title="Informe um CEP válido com 8 números."
            value={cep}
            onChange={alterarCep}
            erro={erro}
            required
          />
          <p className="mt-2 text-sm text-base-content/55" aria-live="polite">
            {carregando ? "Buscando endereço..." : ""}
          </p>
        </div>

        <CampoFormulario
          label="Logradouro"
          id="logradouro"
          placeholder="Rua, avenida..."
          autoComplete="address-line1"
          value={endereco.logradouro}
          onChange={(event) =>
            setEndereco((atual) => ({
              ...atual,
              logradouro: event.target.value,
            }))
          }
          required
        />

        <CampoFormulario
          label="Número"
          id="numero"
          placeholder="Número"
          autoComplete="address-line2"
          required
        />

        <CampoFormulario
          label="Complemento"
          id="complemento"
          placeholder="Sala, bloco, referência..."
          autoComplete="address-line2"
        />

        <CampoFormulario
          label="Bairro"
          id="bairro"
          placeholder="Bairro"
          autoComplete="address-level3"
          value={endereco.bairro}
          onChange={(event) =>
            setEndereco((atual) => ({ ...atual, bairro: event.target.value }))
          }
          required
        />

        <CampoFormulario
          label="Cidade"
          id="cidade"
          placeholder="Cidade"
          autoComplete="address-level2"
          value={endereco.cidade}
          onChange={(event) =>
            setEndereco((atual) => ({ ...atual, cidade: event.target.value }))
          }
          required
        />

        <CampoFormulario
          label="Estado"
          id="estado"
          placeholder="UF"
          autoComplete="address-level1"
          maxLength={2}
          value={endereco.estado}
          onChange={(event) =>
            setEndereco((atual) => ({ ...atual, estado: event.target.value }))
          }
          required
        />
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
          disabled={!podeConcluir}
          className={`btn h-12 rounded-xl border-base-300 px-8 font-bold ${
            podeConcluir
              ? "btn-primary"
              : "bg-base-100 text-base-content disabled:opacity-60"
          }`}
        >
          Concluir cadastro
        </button>
      </div>
    </form>
  );
}

export default EnderecoOng;
