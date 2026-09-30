package br.edu.ifsp.entrecausas.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.edu.ifsp.entrecausas.dto.StatusSolicitacaoResponseDTO;
import br.edu.ifsp.entrecausas.entity.StatusSolicitacao;
import br.edu.ifsp.entrecausas.exception.RecursoNaoEncontradoException;
import br.edu.ifsp.entrecausas.repository.StatusSolicitacaoRepository;

// Camada de serviço responsável pelos status das solicitações.
@Service
public class StatusSolicitacaoService {

    private final StatusSolicitacaoRepository statusRepository;

    // Injeção de dependência via construtor.
    public StatusSolicitacaoService(
            StatusSolicitacaoRepository statusRepository) {

        this.statusRepository = statusRepository;
    }

    // Lista todos os status disponíveis no sistema.
    @Transactional(readOnly = true)
    public List<StatusSolicitacaoResponseDTO> listarTodos() {

        return statusRepository.findAll()
            .stream()
            .map(this::converterParaDTO)
            .collect(Collectors.toList());
    }

    // Busca um status pelo ID.
    @Transactional(readOnly = true)
    public StatusSolicitacaoResponseDTO buscarPorId(
            Long idStatus) {

        StatusSolicitacao status =
            buscarEntidadePorId(idStatus);

        return converterParaDTO(status);
    }

    // Busca um status pelo nome.
    @Transactional(readOnly = true)
    public StatusSolicitacaoResponseDTO buscarPorNome(
            String nome) {

        StatusSolicitacao status =
            statusRepository.findByNome(nome)
                .orElseThrow(() ->
                    new RecursoNaoEncontradoException(
                        "Status não encontrado com o nome: "
                        + nome
                    )
                );

        return converterParaDTO(status);
    }

    // Busca uma entidade de status pelo ID.
    private StatusSolicitacao buscarEntidadePorId(
            Long idStatus) {

        return statusRepository.findById(idStatus)
            .orElseThrow(() ->
                new RecursoNaoEncontradoException(
                    "Status não encontrado com o ID: "
                    + idStatus
                )
            );
    }

    // Converte a entidade para o DTO de resposta.
    private StatusSolicitacaoResponseDTO converterParaDTO(
            StatusSolicitacao status) {

        return new StatusSolicitacaoResponseDTO(
            status.getIdStatus(),
            status.getNome()
        );
    }
}