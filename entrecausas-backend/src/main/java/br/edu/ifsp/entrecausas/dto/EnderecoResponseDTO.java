package br.edu.ifsp.entrecausas.dto;

// Record de saída com os dados estruturados do Endereço para o frontend
public record EnderecoResponseDTO(
    Long idEndereco, // Chave primária do endereço
    String cep,        // CEP cadastrado
    String logradouro, // Rua/Avenida
    String numero,     // Número do imóvel
    String complemento,// Complemento (se houver)
    String bairro,     // Bairro
    String cidade,     // Cidade
    String estado,     // Sigla do Estado (UF)
    Long idOng         // ID da ONG proprietária
) {}