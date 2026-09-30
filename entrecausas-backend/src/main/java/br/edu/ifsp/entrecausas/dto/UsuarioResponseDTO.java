package br.edu.ifsp.entrecausas.dto;

// Java Record imutável utilizado como DTO de saída para respostas da API REST
public record UsuarioResponseDTO(
    Long idUsuario,     // Identificador único do usuário cadastrado
    String nome,        // Nome completo do usuário
    String email,       // Endereço de e-mail do usuário
    String fotoPerfil,  // Nome/caminho relativo da foto de perfil armazenada no diretório de uploads
    String fotoAlt,     // Texto alternativo descritivo da imagem para fins de acessibilidade (Alt Text)
    String funcaoNome   // Nome amigável do perfil/função de acesso do usuário (ex: "ADMINISTRADOR", "Usuario")
) {}