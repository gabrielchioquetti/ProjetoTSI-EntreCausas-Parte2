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
@Table(name = "usuario")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long idUsuario;

    @Column(
        name = "nome",
        nullable = false,
        length = 100
    )
    private String nome;

    @Column(
        name = "email",
        nullable = false,
        unique = true,
        length = 100
    )
    private String email;

    // Armazena somente o hash da senha.
    @Column(
        name = "senha",
        nullable = false,
        length = 255
    )
    private String senha;

    // CPF armazenado criptografado.
    @Column(
        name = "cpf",
        nullable = false,
        length = 255
    )
    private String cpf;

    // HMAC usado para verificar CPF duplicado.
    @Column(
        name = "cpf_hash",
        nullable = false,
        unique = true,
        length = 64
    )
    private String cpfHash;

    // Telefone armazenado criptografado.
    @Column(
        name = "telefone",
        nullable = false,
        length = 255
    )
    private String telefone;

    // HMAC usado para verificar telefone duplicado.
    @Column(
        name = "telefone_hash",
        nullable = false,
        unique = true,
        length = 64
    )
    private String telefoneHash;

    // Nome do arquivo armazenado no diretório de uploads.
    @Column(
        name = "foto_perfil",
        length = 255
    )
    private String fotoPerfil;

    // Texto alternativo da foto de perfil.
    @Column(
        name = "foto_alt",
        length = 255
    )
    private String fotoAlt;

    // Função/perfil de acesso do usuário.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "id_funcao",
        nullable = false
    )
    private Funcao funcao;

    // Construtor padrão exigido pelo JPA.
    public Usuario() {
    }

    // Construtor completo.
    public Usuario(
            Long idUsuario,
            String nome,
            String email,
            String senha,
            String cpf,
            String cpfHash,
            String telefone,
            String telefoneHash,
            String fotoPerfil,
            String fotoAlt,
            Funcao funcao) {

        this.idUsuario = idUsuario;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.cpf = cpf;
        this.cpfHash = cpfHash;
        this.telefone = telefone;
        this.telefoneHash = telefoneHash;
        this.fotoPerfil = fotoPerfil;
        this.fotoAlt = fotoAlt;
        this.funcao = funcao;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getCpfHash() {
        return cpfHash;
    }

    public void setCpfHash(String cpfHash) {
        this.cpfHash = cpfHash;
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

    public String getFotoPerfil() {
        return fotoPerfil;
    }

    public void setFotoPerfil(String fotoPerfil) {
        this.fotoPerfil = fotoPerfil;
    }

    public String getFotoAlt() {
        return fotoAlt;
    }

    public void setFotoAlt(String fotoAlt) {
        this.fotoAlt = fotoAlt;
    }

    public Funcao getFuncao() {
        return funcao;
    }

    public void setFuncao(Funcao funcao) {
        this.funcao = funcao;
    }
}