package br.edu.ifsp.entrecausas.dto;

import java.time.LocalDateTime;

// DTO de saída com os dados formatados da solicitação.
public record SolicitacaoResponseDTO(

    // Identificador da solicitação.
    Long idSolicitacao,

    // Dados da ONG relacionada.
    Long idOng,
    String nomeOng,

    // Dados do usuário que abriu a solicitação.
    Long idUsuario,
    String nomeUsuario,

    // Dados do administrador responsável pela análise.
    // Pode ser nulo enquanto estiver pendente.
    Long idAdministrador,
    String nomeAdministrador,

    // Dados do status atual.
    Long idStatus,
    String nomeStatus,

    // Data e hora em que a solicitação foi analisada.
    LocalDateTime dataAnalise,

    // Motivo informado quando a solicitação foi rejeitada.
    String motivoRejeicao

) {}