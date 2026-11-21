package br.edu.ifsp.entrecausas.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Immutable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

// Mapeamento da tabela auditoria_solicitacao.
@Entity
@Immutable
@Table(name = "auditoria_solicitacao")
public class Auditoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_auditoria")
    private Long idAuditoria;

    // Solicitação relacionada ao evento.
    @Column(name = "id_solicitacao", nullable = false)
    private Long idSolicitacao;

    // ONG relacionada à solicitação.
    @Column(name = "id_ong", nullable = false)
    private Long idOng;

    // Usuário que abriu a solicitação.
    @Column(name = "id_usuario", nullable = false)
    private Long idUsuario;

    // Administrador responsável pela análise.
    @Column(name = "id_administrador")
    private Long idAdministrador;

    // Tipo da solicitação: CADASTRO, EDICAO ou EXCLUSAO.
    @Column(name = "tipo_solicitacao", length = 20)
    private String tipoSolicitacao;

    // Evento registrado pela trigger.
    @Column(name = "evento", nullable = false, length = 30)
    private String evento;

    // Status anterior à alteração.
    @Column(name = "id_status_anterior")
    private Long idStatusAnterior;

    // Status registrado após o evento.
    @Column(name = "id_status_novo", nullable = false)
    private Long idStatusNovo;

    // Motivo informado em caso de rejeição.
    @Column(name = "motivo_rejeicao", columnDefinition = "TEXT")
    private String motivoRejeicao;

    // Data e hora registradas automaticamente pelo MySQL.
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(
            name = "data_registro",
            nullable = false,
            insertable = false,
            updatable = false
    )
    private LocalDateTime dataRegistro;

    // Construtor padrão exigido pelo JPA.
    public Auditoria() {
    }

    public Long getIdAuditoria() {
        return idAuditoria;
    }

    public Long getIdSolicitacao() {
        return idSolicitacao;
    }

    public Long getIdOng() {
        return idOng;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public Long getIdAdministrador() {
        return idAdministrador;
    }

    public String getTipoSolicitacao() {
        return tipoSolicitacao;
    }

    public String getEvento() {
        return evento;
    }

    public Long getIdStatusAnterior() {
        return idStatusAnterior;
    }

    public Long getIdStatusNovo() {
        return idStatusNovo;
    }

    public String getMotivoRejeicao() {
        return motivoRejeicao;
    }

    public LocalDateTime getDataRegistro() {
        return dataRegistro;
    }
}