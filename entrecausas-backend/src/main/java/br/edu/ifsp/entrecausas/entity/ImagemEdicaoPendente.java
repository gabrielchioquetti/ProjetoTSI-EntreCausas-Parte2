
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
import jakarta.persistence.UniqueConstraint;

// Relaciona arquivos novos às solicitações de edição.
// Permite verificar o acesso sem descriptografar as propostas.
@Entity
@Table(
    name = "imagem_edicao_pendente",
    uniqueConstraints = @UniqueConstraint(
        name = "uk_imagem_edicao_arquivo",
        columnNames = "nome_arquivo"
    )
)
public class ImagemEdicaoPendente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_imagem_edicao")
    private Long idImagemEdicao;

    // Nome físico do arquivo armazenado.
    @Column(
        name = "nome_arquivo",
        nullable = false,
        length = 255
    )
    private String nomeArquivo;

    // Solicitação à qual o arquivo pertence.
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
        name = "id_solicitacao",
        nullable = false
    )
    private Solicitacao solicitacao;

    // Construtor padrão exigido pelo JPA.
    public ImagemEdicaoPendente() {
    }

    // Construtor para registrar um arquivo.
    public ImagemEdicaoPendente(
            String nomeArquivo,
            Solicitacao solicitacao) {

        this.nomeArquivo = nomeArquivo;
        this.solicitacao = solicitacao;
    }

    public Long getIdImagemEdicao() {
        return idImagemEdicao;
    }

    public void setIdImagemEdicao(Long idImagemEdicao) {
        this.idImagemEdicao = idImagemEdicao;
    }

    public String getNomeArquivo() {
        return nomeArquivo;
    }

    public void setNomeArquivo(String nomeArquivo) {
        this.nomeArquivo = nomeArquivo;
    }

    public Solicitacao getSolicitacao() {
        return solicitacao;
    }

    public void setSolicitacao(Solicitacao solicitacao) {
        this.solicitacao = solicitacao;
    }
}