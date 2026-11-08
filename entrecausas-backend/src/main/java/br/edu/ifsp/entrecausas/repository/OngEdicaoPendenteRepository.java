package br.edu.ifsp.entrecausas.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import br.edu.ifsp.entrecausas.entity.OngEdicaoPendente;

// Repository responsável pelas propostas de edição de ONGs.
public interface OngEdicaoPendenteRepository extends JpaRepository<OngEdicaoPendente, Long> {
    // Busca os dados propostos de uma solicitação.
    Optional<OngEdicaoPendente> findBySolicitacaoIdSolicitacao(Long idSolicitacao);

    // Verifica se uma solicitação possui proposta de edição.
    boolean existsBySolicitacaoIdSolicitacao(Long idSolicitacao);
}
