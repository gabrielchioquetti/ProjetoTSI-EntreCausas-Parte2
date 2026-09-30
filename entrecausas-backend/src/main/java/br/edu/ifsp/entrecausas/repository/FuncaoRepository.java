package br.edu.ifsp.entrecausas.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.edu.ifsp.entrecausas.entity.Funcao;

// A anotação @Repository é desnecessária pois o Spring Data JPA já reconhece interfaces que estendem JpaRepository.
public interface FuncaoRepository extends JpaRepository<Funcao, Long> {

    // Busca uma função pelo nome.
    // O Optional permite tratar o caso em que a função não existe.
    Optional<Funcao> findByNome(String nome);
}
