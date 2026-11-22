package br.edu.ifsp.entrecausas.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ContatoRequestDTO(

        @NotBlank(message = "O nome é obrigatório.")
        @Size(max = 100, message = "O nome deve ter no máximo 100 caracteres.")
        String nome,

        @NotBlank(message = "O e-mail é obrigatório.")
        @Email(message = "Informe um e-mail válido.")
        @Size(max = 100, message = "O e-mail deve ter no máximo 100 caracteres.")
        String email,

        @NotBlank(message = "O assunto é obrigatório.")
        @Size(max = 100, message = "O assunto deve ter no máximo 100 caracteres.")
        String assunto,

        @NotBlank(message = "A mensagem é obrigatória.")
        @Size(
                min = 10,
                max = 2000,
                message = "A mensagem deve ter entre 10 e 2000 caracteres."
        )
        String mensagem

) {}