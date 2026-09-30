package br.edu.ifsp.entrecausas.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.edu.ifsp.entrecausas.entity.Ong;

// Repository responsável pelo acesso às ONGs.
public interface OngRepository extends JpaRepository<Ong, Long> {

    // Verifica se o CNPJ já está cadastrado.
    boolean existsByCnpjHash(String cnpjHash);

    // Verifica CNPJ em outra ONG durante atualização.
    boolean existsByCnpjHashAndIdOngNot(String cnpjHash, Long idOng);

    // Verifica se o telefone já está cadastrado.
    boolean existsByTelefoneHash(String telefoneHash);

    // Verifica telefone em outra ONG durante atualização.
    boolean existsByTelefoneHashAndIdOngNot(String telefoneHash, Long idOng);

    // Busca a ONG pelo usuário responsável.
    Optional<Ong> findByUsuarioIdUsuario(Long idUsuario);

    // Verifica se o usuário já possui uma ONG.
    boolean existsByUsuarioIdUsuario(Long idUsuario);
}