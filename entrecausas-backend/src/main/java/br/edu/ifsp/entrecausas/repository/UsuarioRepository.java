package br.edu.ifsp.entrecausas.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.edu.ifsp.entrecausas.entity.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer>{

    
}
