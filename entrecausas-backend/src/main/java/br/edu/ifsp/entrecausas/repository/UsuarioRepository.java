package br.edu.ifsp.entrecausas.repository;

import br.edu.ifsp.entrecausas.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

// A anotação @Repository é desnecessária pois o Spring Data JPA reconhece automaticamente interfaces que estendem JpaRepository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Busca usuário pelo e-mail.
    Optional<Usuario> findByEmail(String email);

    // Verifica se o e-mail já está cadastrado.
    boolean existsByEmail(String email);

    // Verifica se o CPF já está cadastrado.
    boolean existsByCpfHash(String cpfHash);

    // Verifica se o telefone já está cadastrado.
    boolean existsByTelefoneHash(String telefoneHash);

    // Verifica CPF em outro usuário durante atualização.
    boolean existsByCpfHashAndIdUsuarioNot(
            String cpfHash,
            Long idUsuario
    );

    // Verifica telefone em outro usuário durante atualização.
    boolean existsByTelefoneHashAndIdUsuarioNot(
            String telefoneHash,
            Long idUsuario
    );
}