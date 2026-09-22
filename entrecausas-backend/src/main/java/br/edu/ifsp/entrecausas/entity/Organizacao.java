package br.edu.ifsp.entrecausas.entity;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity 
@Table(name = "organizacao")
public class Organizacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_organizacao")
    private Integer idOrganizacao;

    @Column(name = "nome")
    private String nome;

    @Column(name = "nome_responsavel")
    private String nomeResponsavel;

    @Column(name = "email_responsavel")
    private String emailResponsavel;

    @Column(name = "celular_primario")
    private String celularPrimario;

    @Column(name = "celular_secundario")
    private String celularSecundario;

    @OneToMany(mappedBy = "organizacao")
    private List<Postagem> postagens;

    public Organizacao(){}

    public Organizacao(String nome, String nomeResponsavel, String emailResponsavel, String celularPrimario, String celularSecundario){
        this.nome = nome;
        this.nomeResponsavel = nomeResponsavel;
        this.emailResponsavel = emailResponsavel;
        this.celularPrimario = celularPrimario;
        this.celularSecundario = celularSecundario;
    }

    public Integer getIdOrganizacao() {
        return idOrganizacao;
    }
    public void setIdOrganizacao(Integer idOrganizacao) {
        this.idOrganizacao = idOrganizacao;
    }
    public String getNome() {
        return nome;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }
    public String getNomeResponsavel() {
        return nomeResponsavel;
    }
    public void setNomeResponsavel(String nomeResponsavel) {
        this.nomeResponsavel = nomeResponsavel;
    }
    public String getEmailResponsavel() {
        return emailResponsavel;
    }
    public void setEmailResponsavel(String emailResponsavel) {
        this.emailResponsavel = emailResponsavel;
    }
    public String getCelularPrimario() {
        return celularPrimario;
    }
    public void setCelularPrimario(String celularPrimario) {
        this.celularPrimario = celularPrimario;
    }
    public String getCelularSecundario() {
        return celularSecundario;
    }
    public void setCelularSecundario(String celularSecundario) {
        this.celularSecundario = celularSecundario;
    }
    public List<Postagem> getPostagens() {
        return postagens;
    }
    public void setPostagens(List<Postagem> postagens) {
        this.postagens = postagens;
    }
}