
import { useEffect, useRef, useState } from "react";
import CampoFormulario from "../Form/CampoFormulario";

function EnderecoOng({ onSubmit, onBack }) {
  const formularioRef = useRef(null);

  // Armazena os dados do endereço.
  const [cep, setCep] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");

  const [endereco, setEndereco] = useState({
    logradouro: "",
    bairro: "",
    cidade: "",
    estado: "",
  });

  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [podeEnviar, setPodeEnviar] = useState(false);

  // Consulta o ViaCEP quando o CEP estiver completo.
  useEffect(() => {
    const valorCep = cep.replace(/\D/g, "");

    if (valorCep.length !== 8) {
      return;
    }

    const controller = new AbortController();

    async function buscarCep() {
      setCarregando(true);
      setErro("");

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
          setErro("CEP não encontrado.");
          setEndereco({
            logradouro: "",
            bairro: "",
            cidade: "",
            estado: "",
          });
          return;
        }

        setEndereco({
          logradouro: dados.logradouro || "",
          bairro: dados.bairro || "",
          cidade: dados.localidade || "",
          estado: dados.uf || "",
        });
      } catch (erroConsulta) {
        if (erroConsulta.name !== "AbortError") {
          setErro(
            "Não foi possível consultar o CEP. Tente novamente.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setCarregando(false);
        }
      }
    }

    buscarCep();

    return () => controller.abort();
  }, [cep]);

  // Atualiza a validade do formulário.
  useEffect(() => {
    const formulario = formularioRef.current;

    if (!formulario) return;

    function verificarValidade() {
      setPodeEnviar(formulario.checkValidity());
    }

    verificarValidade();

    formulario.addEventListener("input", verificarValidade);
    formulario.addEventListener("change", verificarValidade);

    return () => {
      formulario.removeEventListener("input", verificarValidade);
      formulario.removeEventListener("change", verificarValidade);
    };
  }, [cep, numero, complemento, endereco, carregando, erro]);

  // Formata o CEP enquanto o usuário digita.
  function alterarCep(event) {
    const valor = event.target.value.replace(/\D/g, "").slice(0, 8);
    const cepFormatado = valor.replace(/^(\d{5})(\d)/, "$1-$2");

    setCep(cepFormatado);
  }

  // Atualiza os campos de endereço.
  function alterarEndereco(event) {
    const { id, value } = event.target;

    setEndereco((anterior) => ({
      ...anterior,
      [id]: value,
    }));
  }

  // Valida e envia os dados desta etapa.
  function enviarEndereco(event) {
    event.preventDefault();

    const formulario = event.currentTarget;

    if (!formulario.checkValidity()) {
      formulario.reportValidity();
      return;
    }

    if (carregando) {
      return;
    }

    if (cep.replace(/\D/g, "").length !== 8) {
      setErro("Informe um CEP válido.");
      return;
    }

    if (erro) {
      return;
    }

    onSubmit({
      cep,
      logradouro: endereco.logradouro,
      numero,
      complemento,
      bairro: endereco.bairro,
      cidade: endereco.cidade,
      estado: endereco.estado,
    });
  }

  return (
    <form
      ref={formularioRef}
      onSubmit={enviarEndereco}
      className="rounded-3xl border border-base-300 bg-base-100 p-7 shadow-sm md:p-9"
    >
      <div className="mb-9 flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-secondary text-2xl text-primary">
          <i
            className="fa-solid fa-location-dot"
            aria-hidden="true"
          ></i>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-primary">
            Cadastro de ONG — Passo 3 de 3
          </p>

          <h2 className="text-2xl font-black text-base-content">
            Endereço da ONG
          </h2>

          <p className="mt-1 text-sm text-base-content/55">
            Informe o endereço da sua organização.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <CampoFormulario
          label="CEP"
          id="cep"
          placeholder="00000-000"
          value={cep}
          onChange={alterarCep}
          required
          maxLength={9}
          autoComplete="postal-code"
        />

        {carregando && (
          <p
            className="text-sm text-base-content/60 md:col-span-2"
            role="status"
          >
            Consultando CEP...
          </p>
        )}

        {erro && (
          <p
            className="text-sm text-error md:col-span-2"
            role="alert"
          >
            {erro}
          </p>
        )}

        <CampoFormulario
          label="Logradouro"
          id="logradouro"
          placeholder="Rua, avenida..."
          value={endereco.logradouro}
          onChange={alterarEndereco}
          required
          autoComplete="address-line1"
        />

        <CampoFormulario
          label="Número"
          id="numero"
          placeholder="Número"
          value={numero}
          onChange={(event) => setNumero(event.target.value)}
          required
          autoComplete="address-line2"
        />

        <CampoFormulario
          label="Complemento"
          id="complemento"
          placeholder="Sala, bloco, referência..."
          value={complemento}
          onChange={(event) => setComplemento(event.target.value)}
          autoComplete="address-line2"
        />

        <CampoFormulario
          label="Bairro"
          id="bairro"
          placeholder="Nome do bairro"
          value={endereco.bairro}
          onChange={alterarEndereco}
          required
          autoComplete="address-level3"
        />

        <CampoFormulario
          label="Cidade"
          id="cidade"
          placeholder="Nome da cidade"
          value={endereco.cidade}
          onChange={alterarEndereco}
          required
          autoComplete="address-level2"
        />

        <CampoFormulario
          label="Estado"
          id="estado"
          placeholder="UF"
          value={endereco.estado}
          onChange={alterarEndereco}
          required
          maxLength={2}
          autoComplete="address-level1"
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
          disabled={!podeEnviar || carregando || Boolean(erro)}
          className={`btn h-12 rounded-xl border-base-300 px-8 font-bold ${
            podeEnviar && !carregando && !erro
              ? "btn-primary"
              : "bg-base-100 text-base-content disabled:opacity-60"
          }`}
        >
          Finalizar cadastro
        </button>
      </div>
    </form>
  );
}

export default EnderecoOng;
