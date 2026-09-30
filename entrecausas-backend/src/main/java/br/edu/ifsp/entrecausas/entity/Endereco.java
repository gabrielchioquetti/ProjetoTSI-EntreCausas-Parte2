package br.edu.ifsp.entrecausas.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "endereco")
public class Endereco {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_endereco")
    private Long idEndereco;

    // CEP do endereço.
    @Column(
        name = "cep",
        nullable = false,
        length = 10
    )
    private String cep;

    // Rua, avenida ou praça.
    @Column(
        name = "logradouro",
        nullable = false,
        length = 150
    )
    private String logradouro;

    // Número do imóvel.
    @Column(
        name = "numero",
        nullable = false,
        length = 20
    )
    private String numero;

    // Informação adicional opcional.
    @Column(
        name = "complemento",
        length = 100
    )
    private String complemento;

    // Bairro do endereço.
    @Column(
        name = "bairro",
        nullable = false,
        length = 100
    )
    private String bairro;

    // Cidade do endereço.
    @Column(
        name = "cidade",
        nullable = false,
        length = 100
    )
    private String cidade;

    // Sigla do estado.
    @Column(
        name = "estado",
        nullable = false,
        length = 2
    )
    private String estado;

    // Cada ONG possui apenas um endereço.
    @OneToOne(
        fetch = FetchType.LAZY
    )
    @JoinColumn(
        name = "id_ong",
        nullable = false,
        unique = true
    )
    private Ong ong;

    // Construtor padrão exigido pelo JPA.
    public Endereco() {
    }

    // Construtor completo.
    public Endereco(
            Long idEndereco,
            String cep,
            String logradouro,
            String numero,
            String complemento,
            String bairro,
            String cidade,
            String estado,
            Ong ong) {

        this.idEndereco = idEndereco;
        this.cep = cep;
        this.logradouro = logradouro;
        this.numero = numero;
        this.complemento = complemento;
        this.bairro = bairro;
        this.cidade = cidade;
        this.estado = estado;
        this.ong = ong;
    }

    public Long getIdEndereco() {
        return idEndereco;
    }

    public void setIdEndereco(Long idEndereco) {
        this.idEndereco = idEndereco;
    }

    public String getCep() {
        return cep;
    }

    public void setCep(String cep) {
        this.cep = cep;
    }

    public String getLogradouro() {
        return logradouro;
    }

    public void setLogradouro(String logradouro) {
        this.logradouro = logradouro;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public String getComplemento() {
        return complemento;
    }

    public void setComplemento(String complemento) {
        this.complemento = complemento;
    }

    public String getBairro() {
        return bairro;
    }

    public void setBairro(String bairro) {
        this.bairro = bairro;
    }

    public String getCidade() {
        return cidade;
    }

    public void setCidade(String cidade) {
        this.cidade = cidade;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public Ong getOng() {
        return ong;
    }

    public void setOng(Ong ong) {
        this.ong = ong;
    }
}