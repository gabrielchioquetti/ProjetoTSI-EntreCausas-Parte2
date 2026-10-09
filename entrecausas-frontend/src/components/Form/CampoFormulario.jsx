function CampoFormulario({
  label,
  id,
  type = "text",
  placeholder = "",
  required = false,
  erro = "",
  textarea = false,
  value = "",
  onChange,
  textareaClassName = "",
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
          <span
            className="ml-1 text-primary"
            aria-hidden="true"
          >
            *
          </span>
        )}
      </label>

      {textarea ? (
        <textarea
          id={id}
          name={id}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
          className={`
            textarea
            min-h-32
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
            ${textareaClassName}
          `}
          {...props}
        />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
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
          {...props}
        />
      )}

      {erro && (
        <p className="mt-2 text-sm text-error">
          {erro}
        </p>
      )}
    </div>
  );
}

export default CampoFormulario;