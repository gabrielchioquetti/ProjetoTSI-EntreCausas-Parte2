package br.edu.ifsp.entrecausas.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// DTO utilizado para alteração da senha.
public record AlterarSenhaDTO(

    // Senha atualmente cadastrada.
    @NotBlank(message = "A senha atual é obrigatória")
    String senhaAtual,

    // Nova senha escolhida pelo usuário.
    @NotBlank(message = "A nova senha é obrigatória")
    @Size(
        min = 8,
        max = 50,
        message = "A nova senha deve conter entre 8 e 50 caracteres"
    )
    String novaSenha,

    // Confirmação da nova senha.
    @NotBlank(message = "A confirmação da senha é obrigatória")
    String confirmarSenha

) {}