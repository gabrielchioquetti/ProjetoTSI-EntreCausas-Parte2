package br.edu.ifsp.entrecausas.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// Java Record imutável utilizado para receber dados de criação e edição de categorias via requisição REST
public record CategoriaRequestDTO(
        @NotBlank(message = "O nome da categoria é obrigatório.")
        @Size(max = 100, message = "O nome da categoria não pode exceder 100 caracteres.")
        String nome
) {}