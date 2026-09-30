package br.edu.ifsp.entrecausas.dto;

// Java Record imutável utilizado como DTO de saída para respostas da API REST
public record CategoriaResponseDTO(
        Long idCategoria,   // Identificador único da categoria
        String nome         // Nome amigável da categoria
) {}