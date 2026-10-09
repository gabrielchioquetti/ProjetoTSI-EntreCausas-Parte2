package br.edu.ifsp.entrecausas.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

// Dados recebidos pelo endpoint de login.
public record LoginRequestDTO(

    @NotBlank(message = "Informe o e-mail.")
    @Email(message = "Informe um e-mail válido.")
    String email,

    @NotBlank(message = "Informe a senha.")
    String senha

) {}