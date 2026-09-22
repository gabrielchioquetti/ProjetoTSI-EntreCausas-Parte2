package br.edu.ifsp.entrecausas.dto;

public record OrganizacaoRequestDTO(
    String nome,
    String nomeResponsavel,
    String emailResponsavel,
    String celularPrimario,
    String celularSecundario
) {}