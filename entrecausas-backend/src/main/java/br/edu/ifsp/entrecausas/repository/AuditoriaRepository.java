package br.edu.ifsp.entrecausas.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import br.edu.ifsp.entrecausas.entity.Auditoria;

public interface AuditoriaRepository extends JpaRepository<Auditoria, Long> {

    // Lista os registros de auditoria do mais recente ao mais antigo.
    Page<Auditoria> findAllByOrderByDataRegistroDescIdAuditoriaDesc(
            Pageable pageable
    );

    // Consulta o histórico de uma solicitação.
    Page<Auditoria> findByIdSolicitacaoOrderByDataRegistroDescIdAuditoriaDesc(
            Long idSolicitacao,
            Pageable pageable
    );

    // Consulta os registros de auditoria de uma ONG.
    Page<Auditoria> findByIdOngOrderByDataRegistroDescIdAuditoriaDesc(
            Long idOng,
            Pageable pageable
    );

    // Consulta os registros de um tipo de solicitação.
    Page<Auditoria> findByTipoSolicitacaoOrderByDataRegistroDescIdAuditoriaDesc(
            String tipoSolicitacao,
            Pageable pageable
    );
}
