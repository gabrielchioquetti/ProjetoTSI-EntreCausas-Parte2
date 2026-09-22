package br.edu.ifsp.entrecausas.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.edu.ifsp.entrecausas.entity.Postagem;

public interface PostagemRepository extends JpaRepository<Postagem, Integer>{
    
}
