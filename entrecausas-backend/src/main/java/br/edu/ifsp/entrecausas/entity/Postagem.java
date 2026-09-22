package br.edu.ifsp.entrecausas.entity;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity 
@Table(name = "postagem")
public class Postagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_postagem")
    private Integer idPostagem;

    @Column(name = "titulo")
    private String titulo;

    @Column(name = "descricao")
    private String descricao;

    @Column(name = "localizacao")
    private String localizacao;

    @ManyToOne
    @JoinColumn(name = "id_organizacao")
    private Organizacao organizacao;

    @OneToMany(mappedBy = "postagem")
    private List<Imagem> imagens;

    @Column(name = "categoria")
    private String categoria;

    @Column(name = "status")
    private String status;

    @Column(name = "destaque")
    private boolean destaque;

    @Column(name = "ativo")
    private boolean ativo;

    @Column(name = "link")
    private String link;

    @Column(name = "data_criacao")
    private LocalDate dataCriacao;

    @Column(name = "data_publicacao")
    private LocalDate dataPublicacao;

    @Column(name = "data_atualizacao")
    private LocalDate dataAtualizacao;

    public Postagem(){}

    public Postagem(String titulo, String descricao, String localizacao, Organizacao organizacao, String categoria, String status, boolean destaque, boolean ativo, String link, LocalDate dataCriacao, LocalDate dataPublicacao, LocalDate dataAtualizacao){
        this.titulo = titulo;
        this.descricao = descricao;
        this.localizacao = localizacao;
        this.organizacao = organizacao;
        this.categoria = categoria;
        this.status = status;
        this.destaque = destaque;
        this.ativo = ativo;
        this.link = link;
        this.dataCriacao = dataCriacao;
        this.dataPublicacao = dataPublicacao;
        this.dataAtualizacao = dataAtualizacao;
    }

    public Integer getIdPostagem() {
        return idPostagem;
    }
    public void setIdPostagem(Integer idPostagem) {
        this.idPostagem = idPostagem;
    }
    public String getTitulo() {
        return titulo;
    }
    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }
    public String getDescricao() {
        return descricao;
    }
    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
    public String getLocalizacao() {
        return localizacao;
    }
    public void setLocalizacao(String localizacao) {
        this.localizacao = localizacao;
    }
    public Organizacao getOrganizacao() {
        return organizacao;
    }
    public void setOrganizacao(Organizacao organizacao) {
        this.organizacao = organizacao;
    }
    public List<Imagem> getImagens() {
        return imagens;
    }
    public void setImagens(List<Imagem> imagens) {
        this.imagens = imagens;
    }
    public String getCategoria() {
        return categoria;
    }
    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public boolean isDestaque() {
        return destaque;
    }
    public void setDestaque(boolean destaque) {
        this.destaque = destaque;
    }
    public boolean isAtivo() {
        return ativo;
    }
    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }
    public String getLink() {
        return link;
    }
    public void setLink(String link) {
        this.link = link;
    }
    public LocalDate getDataCriacao() {
        return dataCriacao;
    }
    public void setDataCriacao(LocalDate dataCriacao) {
        this.dataCriacao = dataCriacao;
    }
    public LocalDate getDataPublicacao() {
        return dataPublicacao;
    }
    public void setDataPublicacao(LocalDate dataPublicacao) {
        this.dataPublicacao = dataPublicacao;
    }
    public LocalDate getDataAtualizacao() {
        return dataAtualizacao;
    }
    public void setDataAtualizacao(LocalDate dataAtualizacao) {
        this.dataAtualizacao = dataAtualizacao;
    }
}