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

@Entity
@Table(name = "imagem")
public class Imagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_imagem")
    private Long idImagem;

    // Caminho do arquivo da imagem.
    @Column(
        name = "caminho",
        nullable = false,
        length = 255
    )
    private String caminho;

    // Texto alternativo da imagem.
    @Column(
        name = "texto_alternativo",
        length = 255
    )
    private String textoAlternativo;

    // ONG proprietária da imagem.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "id_ong",
        nullable = false
    )
    private Ong ong;

    // Construtor padrão exigido pelo JPA.
    public Imagem() {
    }

    // Construtor completo.
    public Imagem(
            Long idImagem,
            String caminho,
            String textoAlternativo,
            Ong ong) {

        this.idImagem = idImagem;
        this.caminho = caminho;
        this.textoAlternativo = textoAlternativo;
        this.ong = ong;
    }

    public Long getIdImagem() {
        return idImagem;
    }

    public void setIdImagem(Long idImagem) {
        this.idImagem = idImagem;
    }

    public String getCaminho() {
        return caminho;
    }

    public void setCaminho(String caminho) {
        this.caminho = caminho;
    }

    public String getTextoAlternativo() {
        return textoAlternativo;
    }

    public void setTextoAlternativo(
            String textoAlternativo) {

        this.textoAlternativo = textoAlternativo;
    }

    public Ong getOng() {
        return ong;
    }

    public void setOng(Ong ong) {
        this.ong = ong;
    }
}