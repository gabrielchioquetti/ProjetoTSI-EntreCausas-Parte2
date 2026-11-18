package br.edu.ifsp.entrecausas.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "recuperacao_senha")
public class RecuperacaoSenha {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_recuperacao")
    private Long idRecuperacao;

    // Usuário que solicitou a recuperação.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    // Armazena somente o hash do código.
    @Column(name = "codigo_hash", nullable = false, length = 255)
    private String codigoHash;

    // Data e hora de expiração do código.
    @Column(name = "data_expiracao", nullable = false)
    private LocalDateTime dataExpiracao;

    // Quantidade de tentativas incorretas.
    @Column(name = "tentativas", nullable = false)
    private int tentativas = 0;

    // Indica se o código foi validado.
    @Column(name = "validado", nullable = false)
    private boolean validado = false;

    // Indica se a recuperação já foi utilizada.
    @Column(name = "utilizado", nullable = false)
    private boolean utilizado = false;

    // Data de criação da solicitação.
    @Column(name = "data_criacao", nullable = false)
    private LocalDateTime dataCriacao;

    // Hash da autorização emitida após validar o código.
    @Column(name = "autorizacao_hash", length = 64)
    private String autorizacaoHash;

    // Expiração da autorização de redefinição.
    @Column(name = "autorizacao_expiracao")
    private LocalDateTime autorizacaoExpiracao;

    public RecuperacaoSenha() {
    }

    public Long getIdRecuperacao() {
        return idRecuperacao;
    }

    public void setIdRecuperacao(Long idRecuperacao) {
        this.idRecuperacao = idRecuperacao;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public String getCodigoHash() {
        return codigoHash;
    }

    public void setCodigoHash(String codigoHash) {
        this.codigoHash = codigoHash;
    }

    public LocalDateTime getDataExpiracao() {
        return dataExpiracao;
    }

    public void setDataExpiracao(LocalDateTime dataExpiracao) {
        this.dataExpiracao = dataExpiracao;
    }

    public int getTentativas() {
        return tentativas;
    }

    public void setTentativas(int tentativas) {
        this.tentativas = tentativas;
    }

    public boolean isValidado() {
        return validado;
    }

    public void setValidado(boolean validado) {
        this.validado = validado;
    }

    public boolean isUtilizado() {
        return utilizado;
    }

    public void setUtilizado(boolean utilizado) {
        this.utilizado = utilizado;
    }

    public LocalDateTime getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(LocalDateTime dataCriacao) {
        this.dataCriacao = dataCriacao;
    }

    public String getAutorizacaoHash() {
        return autorizacaoHash;
    }

    public void setAutorizacaoHash(String autorizacaoHash) {
        this.autorizacaoHash = autorizacaoHash;
    }

    public LocalDateTime getAutorizacaoExpiracao() {
        return autorizacaoExpiracao;
    }

    public void setAutorizacaoExpiracao(
            LocalDateTime autorizacaoExpiracao
    ) {
        this.autorizacaoExpiracao = autorizacaoExpiracao;
    }
}