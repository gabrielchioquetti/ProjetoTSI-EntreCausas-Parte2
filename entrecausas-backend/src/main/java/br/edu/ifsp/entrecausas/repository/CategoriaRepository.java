package br.edu.ifsp.entrecausas.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.edu.ifsp.entrecausas.entity.Categoria;

// Repository responsável pelas categorias fixas do sistema.
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    // Verifica se a categoria já existe pelo nome.
    // A busca ignora diferenças entre maiúsculas e minúsculas.
    boolean existsByNomeIgnoreCase(String nome);

    // Busca uma categoria pelo nome.
    // A busca ignora diferenças entre maiúsculas e minúsculas.
    Optional<Categoria> findByNomeIgnoreCase(String nome);
}