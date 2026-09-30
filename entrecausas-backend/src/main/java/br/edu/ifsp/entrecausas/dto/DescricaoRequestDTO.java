package br.edu.ifsp.entrecausas.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

// Record para receber requisições de criação ou atualização
// de descrição.
public record DescricaoRequestDTO(

    // Tipo da descrição da ONG.
    // Exemplos: "Curta" e "Completa".
    @NotBlank(
        message = "O tipo da descrição é obrigatório"
    )
    @Size(
        max = 10,
        message =
            "O tipo da descrição deve ter no máximo 10 caracteres"
    )
    String tipoDescricao,

    // Conteúdo textual da descrição da ONG.
    @NotBlank(
        message = "O texto da descrição é obrigatório"
    )
    String texto,

    // ONG proprietária desta descrição.
    @NotNull(
        message =
            "O identificador da ONG (idOng) é obrigatório"
    )
    Long idOng

) {}