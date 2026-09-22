package br.edu.ifsp.entrecausas.dto;

import java.time.LocalDate;

public record PostagemRequestDTO(
    String titulo,
    String descricao,
    String localizacao,
    String categoria,
    String status,
    boolean destaque,
    boolean ativo,
    String link,
    LocalDate dataCriacao,
    LocalDate dataPublicacao,
    LocalDate dataAtualizacao,
    Integer idOrganizacao,
    OrganizacaoRequestDTO novaOrganizacao
) {}