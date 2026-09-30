package br.edu.ifsp.entrecausas.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "descricao")
public class Descricao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_descricao")
    private Long idDescricao;

    // Texto da descrição da ONG.
    @Lob
    @Column(
        name = "texto",
        nullable = false,
        columnDefinition = "TEXT"
    )
    private String texto;

    // Tipo da descrição.
    // Exemplo: "SOBRE", "HISTORIA".
    @Column(
        name = "tipo_descricao",
        nullable = false,
        length = 10
    )
    private String tipoDescricao;

    // Uma ONG pode possuir várias descrições.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "id_ong",
        nullable = false
    )
    private Ong ong;

    // Construtor padrão exigido pelo JPA.
    public Descricao() {
    }

    // Construtor completo.
    public Descricao(
            Long idDescricao,
            String texto,
            String tipoDescricao,
            Ong ong) {

        this.idDescricao = idDescricao;
        this.texto = texto;
        this.tipoDescricao = tipoDescricao;
        this.ong = ong;
    }

    public Long getIdDescricao() {
        return idDescricao;
    }

    public void setIdDescricao(Long idDescricao) {
        this.idDescricao = idDescricao;
    }

    public String getTexto() {
        return texto;
    }

    public void setTexto(String texto) {
        this.texto = texto;
    }

    public String getTipoDescricao() {
        return tipoDescricao;
    }

    public void setTipoDescricao(String tipoDescricao) {
        this.tipoDescricao = tipoDescricao;
    }

    public Ong getOng() {
        return ong;
    }

    public void setOng(Ong ong) {
        this.ong = ong;
    }
}