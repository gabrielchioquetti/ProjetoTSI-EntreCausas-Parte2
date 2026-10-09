package br.edu.ifsp.entrecausas.controller;

import br.edu.ifsp.entrecausas.dto.LoginRequestDTO;
import br.edu.ifsp.entrecausas.dto.UsuarioResponseDTO;
import br.edu.ifsp.entrecausas.entity.Usuario;
import br.edu.ifsp.entrecausas.repository.UsuarioRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final SecurityContextRepository securityContextRepository;

    public AuthController(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            SecurityContextRepository securityContextRepository) {

        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.securityContextRepository = securityContextRepository;
    }

    // Realiza o login e cria a sessão autenticada.
    @PostMapping("/login")
    @Transactional(readOnly = true)
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequestDTO dto,
            HttpServletRequest request,
            HttpServletResponse response) {

        Optional<Usuario> resultado =
            usuarioRepository.findByEmail(dto.email().trim());

        // Não revela se o e-mail existe no banco.
        if (resultado.isEmpty()
                || !passwordEncoder.matches(
                    dto.senha(),
                    resultado.get().getSenha())) {

            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of(
                    "mensagem",
                    "E-mail ou senha inválidos."
                ));
        }

        Usuario usuario = resultado.get();

        // A função vem do banco, nunca do formulário.
        String funcao = usuario.getFuncao().getNome();

        var autoridades = List.of(
            new SimpleGrantedAuthority("ROLE_" + funcao)
        );

        Authentication autenticacao =
            new UsernamePasswordAuthenticationToken(
                usuario.getEmail(),
                null,
                autoridades
            );

        // Renova o identificador se já existir uma sessão.
        if (request.getSession(false) != null) {
            request.changeSessionId();
        }

        // Salva a autenticação na sessão HTTP.
        SecurityContext contexto =
            SecurityContextHolder.createEmptyContext();

        contexto.setAuthentication(autenticacao);
        SecurityContextHolder.setContext(contexto);

        securityContextRepository.saveContext(
            contexto,
            request,
            response
        );

        return ResponseEntity.ok(
            converterParaDTO(usuario)
        );
    }

    // Retorna o usuário da sessão atual.
    @GetMapping("/me")
    @Transactional(readOnly = true)
    public ResponseEntity<?> usuarioAutenticado(
            Authentication autenticacao) {

        Optional<Usuario> resultado =
            usuarioRepository.findByEmail(
                autenticacao.getName()
            );

        if (resultado.isEmpty()) {
            SecurityContextHolder.clearContext();

            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of(
                    "mensagem",
                    "A sessão não possui um usuário válido."
                ));
        }

        return ResponseEntity.ok(
            converterParaDTO(resultado.get())
        );
    }

    // Fornece o token CSRF necessário às requisições.
    @GetMapping("/csrf")
    public Map<String, String> obterTokenCsrf(
            CsrfToken csrfToken) {

        return Map.of(
            "token",
            csrfToken.getToken()
        );
    }

    // Converte a entidade sem expor a senha ou dados sensíveis.
    private UsuarioResponseDTO converterParaDTO(
            Usuario usuario) {

        return new UsuarioResponseDTO(
            usuario.getIdUsuario(),
            usuario.getNome(),
            usuario.getEmail(),
            usuario.getFotoPerfil(),
            usuario.getFotoAlt(),
            usuario.getFuncao().getNome()
        );
    }
}