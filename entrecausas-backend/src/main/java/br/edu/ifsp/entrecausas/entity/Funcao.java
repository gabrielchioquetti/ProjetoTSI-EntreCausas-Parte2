package br.edu.ifsp.entrecausas.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "funcao")
public class Funcao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_funcao")
    private Long idFuncao;

    // Nome da função/perfil do usuário.
    // Exemplos: "USUARIO" e "ADMINISTRADOR".
    // A função não deve ser duplicada no banco.
    @Column(name = "nome", nullable = false, unique = true, length = 50)
    private String nome;

    // Construtor padrão exigido pelo JPA.
    public Funcao() {
    }

    // Construtor completo.
    public Funcao(Long idFuncao, String nome) {
        this.idFuncao = idFuncao;
        this.nome = nome;
    }

    // Construtor utilizado quando ainda não existe um ID.
    public Funcao(String nome) {
        this.nome = nome;
    }

    public Long getIdFuncao() {
        return idFuncao;
    }

    public void setIdFuncao(Long idFuncao) {
        this.idFuncao = idFuncao;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }
}