package br.edu.ifsp.entrecausas.dto;

// Record para resposta da API com os dados persistidos da imagem
public record ImagemResponseDTO(
        Long idImagem,
        String caminho,
        String textoAlternativo,
        Long idOng
) {}