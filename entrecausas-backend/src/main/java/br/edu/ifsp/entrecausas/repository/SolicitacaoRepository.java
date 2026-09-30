package br.edu.ifsp.entrecausas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.edu.ifsp.entrecausas.entity.Solicitacao;

// Repository responsável pelas solicitações.
public interface SolicitacaoRepository
        extends JpaRepository<Solicitacao, Long> {

    // Lista solicitações pelo status.
    // Exemplo: buscar solicitações PENDENTES.
    List<Solicitacao> findByStatusIdStatus(
            Long idStatus
    );

    // Lista solicitações abertas por um usuário.
    List<Solicitacao> findByUsuarioIdUsuario(
            Long idUsuario
    );

    // Lista solicitações associadas a uma ONG.
    List<Solicitacao> findByOngIdOng(
            Long idOng
    );
}