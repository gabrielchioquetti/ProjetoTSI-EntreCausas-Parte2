package br.edu.ifsp.entrecausas.dto;

// Record de saída contendo os dados da descrição para o frontend.
public record DescricaoResponseDTO(

    // Identificador da descrição.
    Long idDescricao,

    // Conteúdo textual da descrição.
    String texto,

    // Tipo da descrição.
    // Exemplos: "SOBRE" e "HISTORIA".
    String tipoDescricao,

    // ID da ONG associada.
    Long idOng

) {}