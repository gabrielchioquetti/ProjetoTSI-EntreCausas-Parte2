package br.edu.ifsp.entrecausas.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.edu.ifsp.entrecausas.entity.Endereco;

// Repository responsável pelo acesso aos endereços.
public interface EnderecoRepository extends JpaRepository<Endereco, Long> {

    // Busca o endereço de uma ONG.
    Optional<Endereco> findByOngIdOng(Long idOng);

    // Verifica se a ONG já possui um endereço.
    boolean existsByOngIdOng(Long idOng);
}