package br.edu.ifsp.entrecausas.dto;

// Record de saída com os dados públicos da ONG.
public record OngResponseDTO(

    // Identificador da ONG.
    Long idOng,

    // Nome da ONG.
    String nome,

    // Telefone da ONG.
    // O valor é descriptografado pelo service.
    String telefone,

    // Link do perfil do Instagram.
    String instagram,

    // ID do usuário responsável pela ONG.
    Long idUsuarioResponsavel

) {}