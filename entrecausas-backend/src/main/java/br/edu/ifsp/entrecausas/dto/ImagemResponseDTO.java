package br.edu.ifsp.entrecausas.dto;

import br.edu.ifsp.entrecausas.entity.Imagem;

public record ImagemResponseDTO(
    Integer idImagem,
    String nome,
    String caminho,
    String descricao,
    int ordem,
    Integer idPostagem
) {
    public ImagemResponseDTO(Imagem imagem) {
        this(
            imagem.getIdImagem(),
            imagem.getNome(),
            imagem.getCaminho(),
            imagem.getDescricao(),
            imagem.getOrdem(),
            imagem.getPostagem() != null ? imagem.getPostagem().getIdPostagem() : null
        );
    }
}
