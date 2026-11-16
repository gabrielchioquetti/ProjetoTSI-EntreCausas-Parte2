package br.edu.ifsp.entrecausas.repository;

import java.util.List;
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

    // Busca a ONG ativa pelo usuário responsável.
    Optional<Ong> findByUsuarioIdUsuarioAndAtivaTrue(Long idUsuario);

    // Verifica se o usuário possui uma ONG ativa.
    boolean existsByUsuarioIdUsuarioAndAtivaTrue(Long idUsuario);

    // Lista todas as ONGs do usuário, incluindo as desativadas.
    List<Ong> findByUsuarioIdUsuarioOrderByIdOngDesc(Long idUsuario);

    // Lista as ONGs desativadas do usuário.
    List<Ong> findByUsuarioIdUsuarioAndAtivaFalseOrderByIdOngDesc(
        Long idUsuario
    );
}