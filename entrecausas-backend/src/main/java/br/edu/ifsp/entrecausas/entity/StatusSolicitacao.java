package br.edu.ifsp.entrecausas.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// Mapeamento da tabela status_solicitacao.
@Entity
@Table(name = "status_solicitacao")
public class StatusSolicitacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_status")
    private Long idStatus;

    // Nome do status da solicitação.
    // Exemplos: PENDENTE, APROVADO e REJEITADO.
    @NotBlank(
        message = "O nome do status é obrigatório."
    )
    @Size(
        max = 50,
        message =
            "O nome do status não pode exceder 50 caracteres."
    )
    @Column(
        name = "nome",
        nullable = false,
        length = 50,
        unique = true
    )
    private String nome;

    // Construtor padrão exigido pelo JPA.
    public StatusSolicitacao() {
    }

    // Construtor completo.
    public StatusSolicitacao(
            Long idStatus,
            String nome) {

        this.idStatus = idStatus;
        this.nome = nome;
    }

    // Construtor para novos registros.
    public StatusSolicitacao(String nome) {
        this.nome = nome;
    }

    public Long getIdStatus() {
        return idStatus;
    }

    public void setIdStatus(Long idStatus) {
        this.idStatus = idStatus;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }
}