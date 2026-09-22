package br.edu.ifsp.entrecausas.dto;

import br.edu.ifsp.entrecausas.entity.Postagem;
import java.time.LocalDate;

public record PostagemResponseDTO(
    Integer idPostagem,
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
    String nomeOrganizacao
) {
    public PostagemResponseDTO(Postagem postagem) {
        this(
            postagem.getIdPostagem(),
            postagem.getTitulo(),
            postagem.getDescricao(),
            postagem.getLocalizacao(),
            postagem.getCategoria(),
            postagem.getStatus(),
            postagem.isDestaque(),
            postagem.isAtivo(),
            postagem.getLink(),
            postagem.getDataCriacao(),
            postagem.getDataPublicacao(),
            postagem.getDataAtualizacao(),
            postagem.getOrganizacao() != null ? postagem.getOrganizacao().getIdOrganizacao() : null,
            postagem.getOrganizacao() != null ? postagem.getOrganizacao().getNome() : null
        );
    }
}