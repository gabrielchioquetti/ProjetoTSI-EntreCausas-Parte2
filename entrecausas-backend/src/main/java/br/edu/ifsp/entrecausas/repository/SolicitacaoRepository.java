package br.edu.ifsp.entrecausas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.edu.ifsp.entrecausas.entity.Solicitacao;

public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long> {

    List<Solicitacao> findByStatusIdStatus(Long idStatus);

    List<Solicitacao> findByUsuarioIdUsuario(Long idUsuario);

    List<Solicitacao> findByOngIdOng(Long idOng);

    // Verifica se existe uma edição aguardando análise.
    boolean existsByOngIdOngAndTipoSolicitacaoAndStatusNome(
            Long idOng,
            String tipoSolicitacao,
            String nomeStatus
    );

    // Verifica se a ONG possui qualquer solicitação pendente.
    boolean existsByOngIdOngAndStatusNome(
            Long idOng,
            String nomeStatus
    );
}