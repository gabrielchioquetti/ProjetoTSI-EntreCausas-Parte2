package br.edu.ifsp.entrecausas.dto;

// Dados privados do perfil do usuário autenticado.
public record UsuarioPerfilDTO(

    Long idUsuario,
    String nome,
    String email,
    String cpfMascarado,
    String telefone,
    String fotoPerfil,
    String fotoAlt,
    String funcaoNome

) {}