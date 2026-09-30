package br.edu.ifsp.entrecausas.dto;

import jakarta.validation.constraints.NotNull;

// DTO utilizado para receber a abertura de uma nova solicitação.
public record SolicitacaoCriacaoDTO(

    // ONG que será vinculada à solicitação.
    @NotNull(
        message = "O ID da ONG é obrigatório."
    )
    Long idOng,

    // Usuário que está abrindo a solicitação.
    // Futuramente será obtido pelo usuário autenticado.
    @NotNull(
        message = "O ID do usuário solicitante é obrigatório."
    )
    Long idUsuario

) {}