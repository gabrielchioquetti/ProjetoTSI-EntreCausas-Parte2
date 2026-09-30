package br.edu.ifsp.entrecausas.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// Mapeamento da entidade JPA correspondente à tabela categoria.
@Entity
@Table(name = "categoria")
public class Categoria {

    // Identificador único da categoria.
    // O valor é gerado automaticamente pelo banco.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_categoria")
    private Long idCategoria;

    // Nome da categoria fixa do sistema.
    // Exemplos: "Causa Animal" e "Educação".
    @NotBlank(message = "O nome da categoria é obrigatório.")
    @Size(
        max = 100,
        message = "O nome da categoria não pode exceder 100 caracteres."
    )
    @Column(
        name = "nome",
        nullable = false,
        length = 100,
        unique = true
    )
    private String nome;

    // Construtor padrão exigido pelo JPA.
    public Categoria() {}

    // Construtor completo para inicialização dos dados.
    public Categoria(
            Long idCategoria,
            String nome) {
        this.idCategoria = idCategoria;
        this.nome = nome;
    }

    // Construtor auxiliar para novas categorias.
    public Categoria(String nome) {
        this.nome = nome;
    }

    public Long getIdCategoria() {
        return idCategoria;
    }

    public void setIdCategoria(Long idCategoria) {
        this.idCategoria = idCategoria;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }
}