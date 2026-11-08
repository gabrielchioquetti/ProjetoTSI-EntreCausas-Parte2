package br.edu.ifsp.entrecausas.dto;

import java.util.List;

// Representa os dados propostos para edição de uma ONG.
// CNPJ e usuário responsável não podem ser alterados.
public record OngEdicaoDadosDTO(

        String nome,
        String telefone,
        String instagram,

        String descricaoCurta,
        String descricaoCompleta,

        List<Long> categorias,

        String cep,
        String logradouro,
        String numero,
        String complemento,
        String bairro,
        String cidade,
        String estado,

        List<String> imagens

) {}