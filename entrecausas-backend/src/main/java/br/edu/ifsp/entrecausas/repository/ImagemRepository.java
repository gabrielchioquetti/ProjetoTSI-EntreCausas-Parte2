package br.edu.ifsp.entrecausas.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.edu.ifsp.entrecausas.entity.Imagem;

public interface ImagemRepository extends JpaRepository<Imagem, Integer>{
    
}
