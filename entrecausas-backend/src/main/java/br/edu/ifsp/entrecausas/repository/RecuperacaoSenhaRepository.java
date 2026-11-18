package br.edu.ifsp.entrecausas.repository;

import br.edu.ifsp.entrecausas.entity.RecuperacaoSenha;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.persistence.LockModeType;

import java.time.LocalDateTime;
import java.util.Optional;

public interface RecuperacaoSenhaRepository
        extends JpaRepository<RecuperacaoSenha, Long> {

    // Busca a recuperação mais recente de um usuário.
    Optional<RecuperacaoSenha>
        findFirstByUsuarioIdUsuarioOrderByDataCriacaoDescIdRecuperacaoDesc(
            Long idUsuario
        );

    // Bloqueia o registro durante a validação ou utilização.
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
        SELECT r
        FROM RecuperacaoSenha r
        WHERE r.idRecuperacao = :idRecuperacao
        """)
    Optional<RecuperacaoSenha> buscarParaAtualizacao(
        @Param("idRecuperacao") Long idRecuperacao
    );

    // Remove recuperações antigas que já expiraram.
    @Modifying
    @Query("""
        DELETE FROM RecuperacaoSenha r
        WHERE r.dataExpiracao < :dataLimite
        """)
    int excluirExpirados(
        @Param("dataLimite") LocalDateTime dataLimite
    );

    // Remove recuperações já utilizadas.
    @Modifying
    @Query("""
        DELETE FROM RecuperacaoSenha r
        WHERE r.utilizado = true
        """)
    int excluirUtilizados();

    // Busca uma recuperação pela autorização temporária.
    Optional<RecuperacaoSenha> findByAutorizacaoHash(
            String autorizacaoHash
    );
}