package br.edu.ifsp.entrecausas.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "ong")
public class Ong {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ong")
    private Long idOng;

    @Column(name = "nome", nullable = false, length = 150)
    private String nome;

    // CNPJ armazenado criptografado.
    @Column(name = "cnpj", length = 255)
    private String cnpj;

    // HMAC usado para verificar CNPJ duplicado.
    @Column(name = "cnpj_hash", unique = true, length = 64)
    private String cnpjHash;

    // Telefone armazenado criptografado.
    @Column(name = "telefone", length = 255)
    private String telefone;

    // HMAC usado para verificar telefone duplicado.
    @Column(name = "telefone_hash", unique = true, length = 64)
    private String telefoneHash;

    @Column(name = "instagram", length = 255)
    private String instagram;

    // Cada usuário pode gerenciar somente uma ONG.
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false, unique = true)
    private Usuario usuario;

    // Relacionamento 1:1 com Endereço.
    // Se a ONG for removida, o endereço é removido.
    @OneToOne(
        mappedBy = "ong",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private Endereco endereco;

    // Relacionamento 1:N com Descrições.
    // Se a ONG for removida, as descrições são removidas.
    @OneToMany(
        mappedBy = "ong",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private List<Descricao> descricoes = new ArrayList<>();

    // Relacionamento 1:N com Imagens.
    // Se a ONG for removida, os registros são removidos.
    @OneToMany(
        mappedBy = "ong",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private List<Imagem> imagens = new ArrayList<>();

    // Relacionamento 1:N com OngCategoria.
    // Se a ONG for removida, os vínculos são removidos.
    @OneToMany(
        mappedBy = "ong",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private List<OngCategoria> categorias = new ArrayList<>();

    public Ong() {}

    public Ong(
            Long idOng,
            String nome,
            String cnpj,
            String cnpjHash,
            String telefone,
            String telefoneHash,
            String instagram,
            Usuario usuario) {

        this.idOng = idOng;
        this.nome = nome;
        this.cnpj = cnpj;
        this.cnpjHash = cnpjHash;
        this.telefone = telefone;
        this.telefoneHash = telefoneHash;
        this.instagram = instagram;
        this.usuario = usuario;
    }

    public void setEndereco(Endereco endereco) {

        if (endereco == null) {

            if (this.endereco != null) {
                this.endereco.setOng(null);
            }

        } else {
            endereco.setOng(this);
        }

        this.endereco = endereco;
    }

    public void addDescricao(Descricao descricao) {

        if (descricao == null) return;

        descricoes.add(descricao);
        descricao.setOng(this);
    }

    public void removeDescricao(Descricao descricao) {

        if (descricao == null) return;

        if (descricoes.remove(descricao)) {
            descricao.setOng(null);
        }
    }

    public void addImagem(Imagem imagem) {

        if (imagem == null) return;

        imagens.add(imagem);
        imagem.setOng(this);
    }

    public void removeImagem(Imagem imagem) {

        if (imagem == null) return;

        if (imagens.remove(imagem)) {
            imagem.setOng(null);
        }
    }

    public void addCategoria(OngCategoria categoria) {

        if (categoria == null) return;

        categorias.add(categoria);
        categoria.setOng(this);
    }

    public void removeCategoria(OngCategoria categoria) {

        if (categoria == null) return;

        if (categorias.remove(categoria)) {
            categoria.setOng(null);
        }
    }

    public Long getIdOng() {
        return idOng;
    }

    public void setIdOng(Long idOng) {
        this.idOng = idOng;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCnpj() {
        return cnpj;
    }

    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
    }

    public String getCnpjHash() {
        return cnpjHash;
    }

    public void setCnpjHash(String cnpjHash) {
        this.cnpjHash = cnpjHash;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getTelefoneHash() {
        return telefoneHash;
    }

    public void setTelefoneHash(String telefoneHash) {
        this.telefoneHash = telefoneHash;
    }

    public String getInstagram() {
        return instagram;
    }

    public void setInstagram(String instagram) {
        this.instagram = instagram;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Endereco getEndereco() {
        return endereco;
    }

    public List<Descricao> getDescricoes() {
        return descricoes;
    }

    public List<Imagem> getImagens() {
        return imagens;
    }

    public List<OngCategoria> getCategorias() {
        return categorias;
    }
}