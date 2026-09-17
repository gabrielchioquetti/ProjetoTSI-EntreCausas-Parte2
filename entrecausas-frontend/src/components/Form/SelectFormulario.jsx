function SelectFormulario({
  label,
  id,
  options = [],
  placeholder = "Selecione uma opção",
  required = false,
  erro = "",
  ...props
}) {
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

      <select
        id={id}
        name={id}
        required={required}
        defaultValue=""
        className={`
          select
          h-12
          w-full
          rounded-xl
          border
          bg-base-100
          text-base-content
          transition

          focus:border-primary
          focus:outline-none
          focus:ring-2
          focus:ring-primary/20

          ${erro ? "border-error" : "border-base-300"}
        `}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {erro && <p className="mt-2 text-sm text-error">{erro}</p>}
    </div>
  );
}

export default SelectFormulario;
