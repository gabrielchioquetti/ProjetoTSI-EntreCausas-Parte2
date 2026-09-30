package br.edu.ifsp.entrecausas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.edu.ifsp.entrecausas.entity.Imagem;

// Repository responsável pelas imagens.
public interface ImagemRepository extends JpaRepository<Imagem, Long> {

    // Lista as imagens de uma ONG.
    List<Imagem> findByOngIdOng(Long idOng);
}