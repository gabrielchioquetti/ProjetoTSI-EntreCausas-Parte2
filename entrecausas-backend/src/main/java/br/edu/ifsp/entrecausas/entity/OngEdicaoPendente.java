package br.edu.ifsp.entrecausas.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

// Armazena os dados propostos para edição de uma ONG.
// A ONG publicada permanece inalterada até a aprovação.
@Entity
@Table(name = "ong_edicao_pendente")
public class OngEdicaoPendente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_edicao")
    private Long idEdicao;

    // Solicitação responsável pela análise da edição.
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
        name = "id_solicitacao",
        nullable = false,
        unique = true
    )
    private Solicitacao solicitacao;

    // Dados propostos, serializados em JSON.
    // Não armazenar CNPJ ou outros dados sensíveis em texto puro.
    @Column(
        name = "dados_propostos",
        nullable = false,
        columnDefinition = "LONGTEXT"
    )
    private String dadosPropostos;

    public OngEdicaoPendente() {
    }

    public OngEdicaoPendente(
            Solicitacao solicitacao,
            String dadosPropostos) {

        this.solicitacao = solicitacao;
        this.dadosPropostos = dadosPropostos;
    }

    public Long getIdEdicao() {
        return idEdicao;
    }

    public void setIdEdicao(Long idEdicao) {
        this.idEdicao = idEdicao;
    }

    public Solicitacao getSolicitacao() {
        return solicitacao;
    }

    public void setSolicitacao(Solicitacao solicitacao) {
        this.solicitacao = solicitacao;
    }

    public String getDadosPropostos() {
        return dadosPropostos;
    }

    public void setDadosPropostos(String dadosPropostos) {
        this.dadosPropostos = dadosPropostos;
    }
}
