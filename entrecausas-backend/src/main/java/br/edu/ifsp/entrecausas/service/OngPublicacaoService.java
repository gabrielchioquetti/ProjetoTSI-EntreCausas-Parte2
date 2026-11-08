package br.edu.ifsp.entrecausas.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.edu.ifsp.entrecausas.entity.Solicitacao;
import br.edu.ifsp.entrecausas.repository.SolicitacaoRepository;

// Centraliza a regra de publicação das ONGs.
@Service
public class OngPublicacaoService {

    private final SolicitacaoRepository solicitacaoRepository;

    public OngPublicacaoService(
            SolicitacaoRepository solicitacaoRepository) {

        this.solicitacaoRepository = solicitacaoRepository;
    }

    // Verifica se a ONG possui aprovação para publicação.
    @Transactional(readOnly = true)
    public boolean ongEstaAprovada(Long idOng) {

        List<Solicitacao> solicitacoes =
            solicitacaoRepository.findByOngIdOng(idOng);

        // A aprovação do cadastro inicial publica a ONG.
        boolean cadastroAprovado = solicitacoes.stream()
            .anyMatch(solicitacao ->
                (solicitacao.getTipoSolicitacao() == null
                    || "CADASTRO".equalsIgnoreCase(
                        solicitacao.getTipoSolicitacao()
                    ))
                && "APROVADO".equalsIgnoreCase(
                    solicitacao.getStatus().getNome()
                )
            );

        if (cadastroAprovado) {
            return true;
        }

        // Uma correção aprovada também pode publicar a ONG,
        // desde que o cadastro inicial tenha sido rejeitado.
        boolean cadastroRejeitado = solicitacoes.stream()
            .anyMatch(solicitacao ->
                (solicitacao.getTipoSolicitacao() == null
                    || "CADASTRO".equalsIgnoreCase(
                        solicitacao.getTipoSolicitacao()
                    ))
                && "REJEITADO".equalsIgnoreCase(
                    solicitacao.getStatus().getNome()
                )
            );

        boolean correcaoAprovada = solicitacoes.stream()
            .anyMatch(solicitacao ->
                "EDICAO".equalsIgnoreCase(
                    solicitacao.getTipoSolicitacao()
                )
                && "APROVADO".equalsIgnoreCase(
                    solicitacao.getStatus().getNome()
                )
            );

        return cadastroRejeitado && correcaoAprovada;
    }
}