package br.edu.ifsp.entrecausas.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

// Mapeamento da tabela solicitacao.
@Entity
@Table(name = "solicitacao")
public class Solicitacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_solicitacao")
    private Long idSolicitacao;

    // ONG relacionada à solicitação.
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
        name = "id_ong",
        nullable = false
    )
    private Ong ong;

    // Usuário que abriu a solicitação.
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
        name = "id_usuario",
        nullable = false
    )
    private Usuario usuario;

    // Administrador responsável pela análise.
    // Fica vazio enquanto a solicitação estiver pendente.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_administrador")
    private Usuario administrador;

    // Status atual da solicitação.
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
        name = "id_status",
        nullable = false
    )
    private StatusSolicitacao status;

    // Data e hora da análise.
    @Column(name = "data_analise")
    private LocalDateTime dataAnalise;

    // Motivo informado quando a solicitação é rejeitada.
    @Column(
        name = "motivo_rejeicao",
        columnDefinition = "TEXT"
    )
    private String motivoRejeicao;

    // Construtor padrão exigido pelo JPA.
    public Solicitacao() {
    }

    // Construtor completo.
    public Solicitacao(
            Long idSolicitacao,
            Ong ong,
            Usuario usuario,
            Usuario administrador,
            StatusSolicitacao status,
            LocalDateTime dataAnalise,
            String motivoRejeicao) {

        this.idSolicitacao = idSolicitacao;
        this.ong = ong;
        this.usuario = usuario;
        this.administrador = administrador;
        this.status = status;
        this.dataAnalise = dataAnalise;
        this.motivoRejeicao = motivoRejeicao;
    }

    // Construtor para uma nova solicitação.
    public Solicitacao(
            Ong ong,
            Usuario usuario,
            StatusSolicitacao status) {

        this.ong = ong;
        this.usuario = usuario;
        this.status = status;
    }

    public Long getIdSolicitacao() {
        return idSolicitacao;
    }

    public void setIdSolicitacao(Long idSolicitacao) {
        this.idSolicitacao = idSolicitacao;
    }

    public Ong getOng() {
        return ong;
    }

    public void setOng(Ong ong) {
        this.ong = ong;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Usuario getAdministrador() {
        return administrador;
    }

    public void setAdministrador(Usuario administrador) {
        this.administrador = administrador;
    }

    public StatusSolicitacao getStatus() {
        return status;
    }

    public void setStatus(StatusSolicitacao status) {
        this.status = status;
    }

    public LocalDateTime getDataAnalise() {
        return dataAnalise;
    }

    public void setDataAnalise(LocalDateTime dataAnalise) {
        this.dataAnalise = dataAnalise;
    }

    public String getMotivoRejeicao() {
        return motivoRejeicao;
    }

    public void setMotivoRejeicao(String motivoRejeicao) {
        this.motivoRejeicao = motivoRejeicao;
    }
}