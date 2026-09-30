package br.edu.ifsp.entrecausas.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

// Record para receber dados de criação ou atualização de Endereço no backend
public record EnderecoRequestDTO(

    // Código de Endereçamento Postal (aceita formatos 12345678 ou 12345-678)
    @NotBlank(message = "O CEP é obrigatório")
    @Pattern(regexp = "^\\d{5}-?\\d{3}$", message = "Formato de CEP inválido (use 8 dígitos com ou sem hífen)")
    String cep,

    // Nome da via pública (rua, avenida, praça)
    @NotBlank(message = "O logradouro é obrigatório")
    @Size(max = 150, message = "O logradouro deve ter no máximo 150 caracteres")
    String logradouro,

    // Número do imóvel (String para permitir 'S/N' ou variações com letras)
    @NotBlank(message = "O número é obrigatório")
    @Size(max = 20, message = "O número deve ter no máximo 20 caracteres")
    String numero,

    // Complemento opcional (apartamento, bloco, sala)
    @Size(max = 100, message = "O complemento deve ter no máximo 100 caracteres")
    String complemento,

    // Nome do bairro
    @NotBlank(message = "O bairro é obrigatório")
    @Size(max = 100, message = "O bairro deve ter no máximo 100 caracteres")
    String bairro,

    // Nome da cidade
    @NotBlank(message = "A cidade é obrigatória")
    @Size(max = 100, message = "A cidade deve ter no máximo 100 caracteres")
    String cidade,

    // Sigla da Unidade Federativa (UF)
    @NotBlank(message = "O estado é obrigatório")
    @Size(min = 2, max = 2, message = "O estado deve conter exatamente 2 caracteres (ex: SP)")
    String estado,

    // Chave estrangeira referenciando a ONG associada a este endereço
    @NotNull(message = "O identificador da ONG (idOng) é obrigatório")
    Long idOng

) {}