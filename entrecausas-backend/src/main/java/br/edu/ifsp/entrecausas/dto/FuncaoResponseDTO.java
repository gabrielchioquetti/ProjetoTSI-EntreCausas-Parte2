package br.edu.ifsp.entrecausas.dto;

import br.edu.ifsp.entrecausas.entity.Funcao;

public record FuncaoResponseDTO(
    Integer idFuncao,
    String nomeCargo,
    String descricao
) {
    public FuncaoResponseDTO(Funcao funcao) {
        this(funcao.getIdFuncao(), funcao.getNomeCargo(), funcao.getDescricao());
    }
}