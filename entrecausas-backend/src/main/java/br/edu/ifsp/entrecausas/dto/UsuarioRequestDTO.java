package br.edu.ifsp.entrecausas.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.br.CPF;

// Java Record utilizado como DTO de entrada para criação e atualização de usuários
public record UsuarioRequestDTO(

    // Validação de presença obrigatória e limite máximo de caracteres
    @NotBlank(message = "O nome é obrigatório")
    @Size(
        max = 100,
        message = "O nome deve ter no máximo 100 caracteres"
    )
    String nome,

    // Validação de presença e verificação de sintaxe de endereço eletrônico
    @NotBlank(message = "O e-mail é obrigatório")
    @Email(message = "Formato de e-mail inválido")
    @Size(
        max = 100,
        message = "O e-mail deve ter no máximo 100 caracteres"
    )
    String email,

    // Validação de tamanho mínimo e máximo para a senha.
    // A senha será transformada em hash pelo serviço antes de ser armazenada.
    @NotBlank(message = "A senha é obrigatória")
    @Size(
        min = 8,
        max = 50,
        message = "A senha deve conter entre 8 e 50 caracteres"
    )
    String senha,

    // Validação do algoritmo oficial de dígitos verificadores do CPF
    // através do Hibernate Validator.
    @NotBlank(message = "O CPF é obrigatório")
    @CPF(message = "CPF em formato inválido")
    String cpf,

    // Validação através de expressão regular.
    // Aceita telefone com DDD contendo 10 ou 11 dígitos,
    // sem espaços, parênteses, hífens ou outros caracteres.
    @NotBlank(message = "O telefone é obrigatório")
    @Pattern(
        regexp = "^\\d{10,11}$",
        message = "O telefone deve conter apenas números (10 ou 11 dígitos)"
    )
    String telefone
) {}