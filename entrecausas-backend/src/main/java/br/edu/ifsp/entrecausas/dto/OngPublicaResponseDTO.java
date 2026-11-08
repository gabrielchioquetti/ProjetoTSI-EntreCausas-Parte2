package br.edu.ifsp.entrecausas.dto;

import java.util.List;

// Record de saída com os dados públicos completos da ONG.
public record OngPublicaResponseDTO(

    // Identificador da ONG.
    Long idOng,
    // Nome da ONG.
    String nome,
    // Link do perfil do Instagram.
    String instagram,
    // Endereço da organização.
    EnderecoResponseDTO endereco,
    // Descrições da organização.
    List<DescricaoResponseDTO> descricoes,
    // Imagens aprovadas da organização.
    List<ImagemResponseDTO> imagens,
    // Categorias da organização.
    List<OngCategoriaResponseDTO> categorias

) {}
