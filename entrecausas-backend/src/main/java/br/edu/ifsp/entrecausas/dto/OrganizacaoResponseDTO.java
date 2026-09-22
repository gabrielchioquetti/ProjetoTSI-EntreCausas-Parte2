package br.edu.ifsp.entrecausas.dto;

import br.edu.ifsp.entrecausas.entity.Organizacao;

public record OrganizacaoResponseDTO(
    Integer idOrganizacao,
    String nome,
    String nomeResponsavel,
    String emailResponsavel,
    String celularPrimario,
    String celularSecundario
) {
    public OrganizacaoResponseDTO(Organizacao organizacao) {
        this(
            organizacao.getIdOrganizacao(),
            organizacao.getNome(),
            organizacao.getNomeResponsavel(),
            organizacao.getEmailResponsavel(),
            organizacao.getCelularPrimario(),
            organizacao.getCelularSecundario()
        );
    }
}