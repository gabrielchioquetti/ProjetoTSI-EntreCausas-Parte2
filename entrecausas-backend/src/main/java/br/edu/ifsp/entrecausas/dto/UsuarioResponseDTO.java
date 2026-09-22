package br.edu.ifsp.entrecausas.dto;

import br.edu.ifsp.entrecausas.entity.Usuario;
import java.time.LocalDate;

public record UsuarioResponseDTO(
    Integer idUsuario,
    String nome,
    String telefone,
    String celular,
    String email,
    String cpf,
    LocalDate dataCadastro,
    Integer idFuncao,
    String nomeCargo
) {
    public UsuarioResponseDTO(Usuario usuario) {
        this(
            usuario.getIdUsuario(),
            usuario.getNome(),
            usuario.getTelefone(),
            usuario.getCelular(),
            usuario.getEmail(),
            usuario.getCpf(),
            usuario.getDataCadastro(),
            usuario.getFuncao() != null ? usuario.getFuncao().getIdFuncao() : null,
            usuario.getFuncao() != null ? usuario.getFuncao().getNomeCargo() : null
        );
    }
}