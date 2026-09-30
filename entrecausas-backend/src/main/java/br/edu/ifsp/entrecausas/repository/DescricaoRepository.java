package br.edu.ifsp.entrecausas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.edu.ifsp.entrecausas.entity.Descricao;

// Repository responsável pelas descrições.
public interface DescricaoRepository extends JpaRepository<Descricao, Long> {

    // Lista as descrições de uma ONG.
    List<Descricao> findByOngIdOng(Long idOng);
}