package br.edu.ifsp.entrecausas.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RedefinirSenhaDTO(

    @NotBlank(message = "A autorização de recuperação é obrigatória.")
    String autorizacao,

    @NotBlank(message = "A nova senha é obrigatória.")
    @Size(
        min = 8,
        max = 50,
        message = "A senha deve conter entre 8 e 50 caracteres."
    )
    String novaSenha,

    @NotBlank(message = "A confirmação da senha é obrigatória.")
    String confirmarSenha

) {}