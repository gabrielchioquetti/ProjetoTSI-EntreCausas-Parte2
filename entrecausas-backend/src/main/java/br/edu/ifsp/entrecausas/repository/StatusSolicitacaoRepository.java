package br.edu.ifsp.entrecausas.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.edu.ifsp.entrecausas.entity.StatusSolicitacao;

// Repository responsável pelos status das solicitações.
public interface StatusSolicitacaoRepository
        extends JpaRepository<StatusSolicitacao, Long> {

    // Busca um status pelo nome.
    Optional<StatusSolicitacao> findByNome(String nome);
}