package br.edu.ifsp.entrecausas.dto;

import java.time.LocalDateTime;
import java.util.List;

// Dados da ONG exibidos ao usuário responsável.
public record OngMinhaResponseDTO(
    Long idOng,
    String nome,
    String cnpj,
    String telefone,
    String instagram,
    EnderecoResponseDTO endereco,
    List<DescricaoResponseDTO> descricoes,
    List<ImagemResponseDTO> imagens,
    List<OngCategoriaResponseDTO> categorias,
    String statusSolicitacao,
    LocalDateTime dataAnalise,
    String motivoRejeicao,
    boolean publicada,
    String tipoSolicitacao
) {}