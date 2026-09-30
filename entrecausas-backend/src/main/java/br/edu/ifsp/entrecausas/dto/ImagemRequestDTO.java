package br.edu.ifsp.entrecausas.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

// Record para transporte de dados de criação/atualização de uma imagem
public record ImagemRequestDTO(
        @NotBlank(message = "O caminho do arquivo é obrigatório.")
        @Size(max = 255, message = "O caminho deve ter no máximo 255 caracteres.")
        String caminho,

        @Size(max = 255, message = "O texto alternativo deve ter no máximo 255 caracteres.")
        String textoAlternativo,

        @NotNull(message = "O ID da ONG é obrigatório.")
        Long idOng
) {}