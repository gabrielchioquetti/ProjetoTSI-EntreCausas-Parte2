package br.edu.ifsp.entrecausas.dto;

// DTO utilizado na comparação administrativa de edições.
public record SolicitacaoComparacaoDTO(

    // Identificador da solicitação.
    Long idSolicitacao,
    // Identificador da ONG.
    Long idOng,
    // Dados atualmente cadastrados.
    OngDetalhesAdminResponseDTO dadosAtuais,
    // Dados propostos pelo responsável.
    OngEdicaoDadosDTO dadosPropostos

) {}