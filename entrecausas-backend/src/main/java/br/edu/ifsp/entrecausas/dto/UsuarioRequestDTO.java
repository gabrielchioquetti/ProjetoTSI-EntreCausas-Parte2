package br.edu.ifsp.entrecausas.dto;

import java.time.LocalDate;

public record UsuarioRequestDTO(
    String nome,
    String telefone,
    String celular,
    String email,
    String cpf,
    LocalDate dataCadastro,
    Integer idFuncao
) {}