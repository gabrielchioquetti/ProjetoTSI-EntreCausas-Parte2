package br.edu.ifsp.entrecausas.dto;

// DTO de saída com os dados do vínculo entre ONG e categoria.
public record OngCategoriaResponseDTO(

    // Identificador único da associação.
    Long idOngCategoria,

    // ID da ONG vinculada.
    Long idOng,

    // Nome da ONG vinculada.
    String nomeOng,

    // ID da categoria vinculada.
    Long idCategoria,

    // Nome da categoria vinculada.
    String nomeCategoria

) {}