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

@Entity
@Table(
    name = "ong_categoria",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_ong_categoria",
            columnNames = {
                "id_ong",
                "id_categoria"
            }
        )
    }
)
public class OngCategoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ong_categoria")
    private Long idOngCategoria;

    // ONG relacionada à categoria.
    @ManyToOne(
        fetch = FetchType.LAZY,
        optional = false
    )
    @JoinColumn(
        name = "id_ong",
        nullable = false
    )
    private Ong ong;

    // Categoria relacionada à ONG.
    @ManyToOne(
        fetch = FetchType.LAZY,
        optional = false
    )
    @JoinColumn(
        name = "id_categoria",
        nullable = false
    )
    private Categoria categoria;

    // Construtor padrão exigido pelo JPA.
    public OngCategoria() {
    }

    // Construtor completo.
    public OngCategoria(
            Long idOngCategoria,
            Ong ong,
            Categoria categoria) {

        this.idOngCategoria = idOngCategoria;
        this.ong = ong;
        this.categoria = categoria;
    }

    // Construtor para novas associações.
    public OngCategoria(
            Ong ong,
            Categoria categoria) {

        this.ong = ong;
        this.categoria = categoria;
    }

    public Long getIdOngCategoria() {
        return idOngCategoria;
    }

    public void setIdOngCategoria(
            Long idOngCategoria) {

        this.idOngCategoria = idOngCategoria;
    }

    public Ong getOng() {
        return ong;
    }

    public void setOng(Ong ong) {
        this.ong = ong;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }
}