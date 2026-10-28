package br.edu.ifsp.entrecausas.dto;

import java.util.List;

// Reúne os dados completos de uma ONG
// para consulta exclusiva do administrador.
public record OngDetalhesAdminResponseDTO(
    Long idOng,
    String nome,
    String cnpj,
    String telefone,
    String instagram,
    EnderecoResponseDTO endereco,
    List<DescricaoResponseDTO> descricoes,
    List<ImagemResponseDTO> imagens,
    List<OngCategoriaResponseDTO> categorias
) {}
