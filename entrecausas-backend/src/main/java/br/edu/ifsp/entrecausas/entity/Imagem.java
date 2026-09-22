package br.edu.ifsp.entrecausas.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
    private Integer idImagem;

    @ManyToOne
    @JoinColumn(name = "id_postagem")
    private Postagem postagem;

    @Column(name = "nome")
    private String nome;

    @Column(name = "caminho")
    private String caminho;

    @Column(name = "descricao")
    private String descricao;

    @Column(name = "ordem")
    private int ordem;

    public Imagem(){}

    public Imagem(Postagem postagem, String nome, String caminho, String descricao, int ordem){
        this.postagem = postagem;
        this.nome = nome;
        this.caminho = caminho;
        this.descricao = descricao;
        this.ordem = ordem;
    }

    public Integer getIdImagem() {
        return idImagem;
    }
    public void setIdImagem(Integer idImagem) {
        this.idImagem = idImagem;
    }
    public Postagem getPostagem() {
        return postagem;
    }
    public void setPostagem(Postagem postagem) {
        this.postagem = postagem;
    }
    public String getNome() {
        return nome;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }
    public String getCaminho() {
        return caminho;
    }
    public void setCaminho(String caminho) {
        this.caminho = caminho;
    }
    public String getDescricao() {
        return descricao;
    }
    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
    public int getOrdem() {
        return ordem;
    }
    public void setOrdem(int ordem) {
        this.ordem = ordem;
    }
}
