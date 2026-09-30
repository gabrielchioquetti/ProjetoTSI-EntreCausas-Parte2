package br.edu.ifsp.entrecausas.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import org.hibernate.validator.constraints.br.CPF;

// DTO utilizado para atualização dos dados do usuário.
public record UsuarioUpdateDTO(

    // Nome do usuário.
    @NotBlank(message = "O nome é obrigatório")
    @Size(
        max = 100,
        message = "O nome deve ter no máximo 100 caracteres"
    )
    String nome,

    // E-mail do usuário.
    @NotBlank(message = "O e-mail é obrigatório")
    @Email(message = "Formato de e-mail inválido")
    @Size(
        max = 100,
        message = "O e-mail deve ter no máximo 100 caracteres"
    )
    String email,

    // CPF do usuário.
    @NotBlank(message = "O CPF é obrigatório")
    @CPF(message = "CPF em formato inválido")
    String cpf,

    // Telefone com 10 ou 11 dígitos.
    @NotBlank(message = "O telefone é obrigatório")
    @Pattern(
        regexp = "^\\d{10,11}$",
        message =
            "O telefone deve conter apenas números "
            + "(10 ou 11 dígitos)"
    )
    String telefone

) {}