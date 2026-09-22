package br.edu.ifsp.entrecausas.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.edu.ifsp.entrecausas.entity.Organizacao;

public interface OrganizacaoRepository extends JpaRepository<Organizacao, Integer>{
    Optional<Organizacao> findByEmailResponsavel(String emailResponsavel);
}
