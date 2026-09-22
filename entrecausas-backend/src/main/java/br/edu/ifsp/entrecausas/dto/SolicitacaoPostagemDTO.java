package br.edu.ifsp.entrecausas.dto;

import java.util.List;

public record SolicitacaoPostagemDTO(
    String titulo,
    String categoria,
    Long organizacaoId,
    String nomeOrganizacaoManual,
    String descricao,
    String emailContato,
    List<String> imagensUrls,
    String localizacao
) {}
