package br.edu.ifsp.entrecausas.dto;

// Java Record imutável utilizado como DTO de saída para respostas da API REST
public record StatusSolicitacaoResponseDTO(
        Long idStatus, // Identificador único do status
        String nome    // Nome do status da solicitação
) {}