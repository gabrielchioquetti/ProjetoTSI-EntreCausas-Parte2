package br.edu.ifsp.entrecausas.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.List;

@Entity
@Table(name = "funcao")
public class Funcao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_funcao")
    private Integer idFuncao;

    @Column(name = "nome_cargo")
    private String nomeCargo;

    @Column(name = "descricao")
    private String descricao;

    @OneToMany(mappedBy = "funcao")
    private List<Usuario> usuarios;

    public Funcao(){

    }

    public Funcao(String nomeCargo, String descricao){
        this.nomeCargo = nomeCargo;
        this.descricao = descricao;
    }

    public Integer getIdFuncao() {
        return idFuncao;
    }

    public void setIdFuncao(Integer idFuncao) {
        this.idFuncao = idFuncao;
    }
    
    public String getNomeCargo() {
        return nomeCargo;
    }

    public void setNomeCargo(String nomeCargo) {
        this.nomeCargo = nomeCargo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public List<Usuario> getUsuarios() {
        return usuarios;
    }

    public void setUsuarios(List<Usuario> usuarios) {
        this.usuarios = usuarios;
    }
}