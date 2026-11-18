package br.edu.ifsp.entrecausas.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record ValidarCodigoRecuperacaoDTO(

    @NotBlank(message = "O e-mail é obrigatório.")
    @Email(message = "Informe um e-mail válido.")
    String email,

    @NotBlank(message = "O código é obrigatório.")
    @Pattern(
        regexp = "^[0-9]{5}$",
        message = "O código deve conter exatamente 5 dígitos."
    )
    String codigo

) {}