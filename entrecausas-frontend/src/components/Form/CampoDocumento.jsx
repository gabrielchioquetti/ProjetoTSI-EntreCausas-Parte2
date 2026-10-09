function CampoDocumento({
  tipo = "cpf",
  required = false,
  erro = "",
  value = "",
  onChange,
}) {
  function formatarDocumento(event) {
    let valor = event.target.value.replace(/\D/g, "");

    if (tipo === "cpf") {
      valor = valor.slice(0, 11);

      valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
      valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
      valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }

    if (tipo === "cnpj") {
      valor = valor.slice(0, 14);

      valor = valor.replace(/^(\d{2})(\d)/, "$1.$2");
      valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
      valor = valor.replace(/\.(\d{3})(\d)/, ".$1/$2");
      valor = valor.replace(/(\d{4})(\d)/, "$1-$2");
    }

    // Atualiza o valor exibido pelo campo.
    if (onChange) {
      onChange({
        target: {
          id: tipo,
          value: valor,
        },
      });
    }
  }

  const nomeCampo = tipo === "cpf" ? "CPF" : "CNPJ";

  const placeholder =
    tipo === "cpf"
      ? "000.000.000-00"
      : "00.000.000/0000-00";

  return (
    <div className="w-full">
      <label
        htmlFor={tipo}
        className="mb-2 block text-sm font-bold text-base-content"
      >
        {nomeCampo}

        {required && (
          <span
            className="ml-1 text-primary"
            aria-hidden="true"
          >
            *
          </span>
        )}
      </label>

      <input
        id={tipo}
        name={tipo}
        type="text"
        placeholder={placeholder}
        autoComplete="off"
        required={required}
        value={value}
        onChange={formatarDocumento}
        maxLength={tipo === "cpf" ? 14 : 18}
        className={`
          input
          h-12
          w-full
          rounded-xl
          border
          bg-base-100
          transition
          focus:border-primary
          focus:outline-none
          focus:ring-2
          focus:ring-primary/20
          ${erro ? "border-error" : "border-base-300"}
        `}
      />

      {erro && (
        <p className="mt-2 text-sm text-error">
          {erro}
        </p>
      )}
    </div>
  );
}

export default CampoDocumento;