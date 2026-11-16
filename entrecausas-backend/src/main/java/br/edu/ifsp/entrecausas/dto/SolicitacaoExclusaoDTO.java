package br.edu.ifsp.entrecausas.dto;

import jakarta.validation.constraints.NotBlank;

// DTO de entrada para solicitar a exclusão lógica de uma ONG.
public record SolicitacaoExclusaoDTO(

    @NotBlank(message = "O motivo da exclusão é obrigatório.")
    String motivoExclusao,

    @NotBlank(message = "Os detalhes da exclusão são obrigatórios.")
    String detalhesExclusao

) {}