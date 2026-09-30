package br.edu.ifsp.entrecausas.dto;

import jakarta.validation.constraints.NotNull;

// DTO utilizado pelo administrador para analisar uma solicitação.
public record SolicitacaoAnaliseDTO(

    // Administrador responsável pela análise.
    @NotNull(
        message = "O ID do administrador é obrigatório."
    )
    Long idAdministrador,

    // Novo status da solicitação.
    @NotNull(
        message = "O ID do novo status é obrigatório."
    )
    Long idStatus,

    // Motivo da rejeição.
    // Deve ser informado quando o status for REJEITADO.
    String motivoRejeicao

) {}