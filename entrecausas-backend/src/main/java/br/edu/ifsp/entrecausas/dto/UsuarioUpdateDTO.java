package br.edu.ifsp.entrecausas.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

// DTO utilizado para atualização dos dados do usuário.
public record UsuarioUpdateDTO(

    // Nome do usuário.
    @Size(
        max = 100,
        message = "O nome deve ter no máximo 100 caracteres"
    )
    String nome,

    // E-mail do usuário.
    @Email(message = "Formato de e-mail inválido")
    @Size(
        max = 100,
        message = "O e-mail deve ter no máximo 100 caracteres"
    )
    String email,

    // Telefone com 10 ou 11 dígitos.
    @Pattern(
        regexp = "^\\d{10,11}$",
        message =
            "O telefone deve conter apenas números "
            + "(10 ou 11 dígitos)"
    )
    String telefone

) {}