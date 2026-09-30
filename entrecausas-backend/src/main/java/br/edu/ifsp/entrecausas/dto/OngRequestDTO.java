package br.edu.ifsp.entrecausas.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import org.hibernate.validator.constraints.br.CNPJ;

// Record de entrada para criação e atualização de ONG.
public record OngRequestDTO(

    // Nome oficial da instituição.
    @NotBlank(message = "O nome é obrigatório")
    @Size(
        max = 150,
        message = "O nome deve ter no máximo 150 caracteres"
    )
    String nome,

    // Cadastro Nacional da Pessoa Jurídica da ONG.
    @NotBlank(message = "O CNPJ é obrigatório")
    @CNPJ(message = "CNPJ em formato inválido")
    String cnpj,

    // Telefone de contato da instituição.
    @NotBlank(message = "O telefone é obrigatório")
    @Pattern(
        regexp = "^\\d{10,11}$",
        message =
            "O telefone deve conter apenas números "
            + "(10 ou 11 dígitos)"
    )
    String telefone,

    // Link do perfil do Instagram da ONG.
    // O campo é opcional.
    @Size(
        max = 255,
        message = "O link do Instagram deve ter no máximo 255 caracteres"
    )
    String instagram,

    // Usuário responsável pela ONG.
    // Será substituído pelo usuário autenticado
    // quando a autenticação estiver integrada.
    @NotNull(
        message =
            "O identificador do usuário responsável "
            + "(idUsuario) é obrigatório"
    )
    Long idUsuario

) {}