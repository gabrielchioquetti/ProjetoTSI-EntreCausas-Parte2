package br.edu.ifsp.entrecausas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.edu.ifsp.entrecausas.entity.OngCategoria;

// Repository responsável pelos vínculos entre ONGs e categorias.
public interface OngCategoriaRepository extends JpaRepository<OngCategoria, Long> {

    // Verifica se o vínculo já existe.
    boolean existsByOngIdOngAndCategoriaIdCategoria(Long idOng, Long idCategoria);

    // Lista as categorias de uma ONG.
    List<OngCategoria> findByOngIdOng(Long idOng);

    // Lista as ONGs de uma categoria.
    List<OngCategoria> findByCategoriaIdCategoria(Long idCategoria);

    // Remove um vínculo específico.
    void deleteByOngIdOngAndCategoriaIdCategoria(Long idOng, Long idCategoria);
}