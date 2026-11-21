
package br.edu.ifsp.entrecausas.dto;

import jakarta.validation.constraints.NotBlank;

public record ExcluirContaDTO(

    @NotBlank(message = "Informe sua senha atual.")
    String senhaAtual

) {}
