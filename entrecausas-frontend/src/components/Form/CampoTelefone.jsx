function CampoTelefone({
  required = false,
  erro = "",
  value = "",
  onChange,
}) {
  function formatarTelefone(event) {
    let valor = event.target.value.replace(/\D/g, "");

    // Limita o telefone a 11 dígitos.
    valor = valor.slice(0, 11);

    if (valor.length > 2) {
      valor = `(${valor.slice(0, 2)}) ${valor.slice(2)}`;
    }

    // Formata celulares com 9 dígitos.
    if (valor.replace(/\D/g, "").length > 10) {
      valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
    } else if (valor.replace(/\D/g, "").length > 6) {
      // Formata telefones fixos com 8 dígitos.
      valor = valor.replace(/(\d{4})(\d)/, "$1-$2");
    }

    // Atualiza o valor exibido pelo campo.
    if (onChange) {
      onChange({
        target: {
          id: "telefone",
          value: valor,
        },
      });
    }
  }

  return (
    <div className="w-full">
      <label
        htmlFor="telefone"
        className="mb-2 block text-sm font-bold text-base-content"
      >
        Telefone
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
        id="telefone"
        name="telefone"
        type="tel"
        placeholder="(11) 99999-9999"
        autoComplete="tel"
        required={required}
        value={value}
        onChange={formatarTelefone}
        maxLength={15}
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

export default CampoTelefone;