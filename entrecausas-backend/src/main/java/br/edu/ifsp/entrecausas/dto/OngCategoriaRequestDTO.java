package br.edu.ifsp.entrecausas.dto;

import jakarta.validation.constraints.NotNull;

// DTO utilizado para associar uma categoria a uma ONG.
public record OngCategoriaRequestDTO(

    // ID da ONG que receberá a categoria.
    @NotNull(
        message = "O ID da ONG é obrigatório."
    )
    Long idOng,

    // ID da categoria que será associada.
    @NotNull(
        message = "O ID da categoria é obrigatório."
    )
    Long idCategoria

) {}