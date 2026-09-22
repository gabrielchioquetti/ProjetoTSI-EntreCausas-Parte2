package br.edu.ifsp.entrecausas.dto;

public record ImagemRequestDTO(
    String nome,
    String caminho,
    String descricao,
    int ordem,
    Integer idPostagem
) {}
