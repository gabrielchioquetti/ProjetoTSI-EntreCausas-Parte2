
package br.edu.ifsp.entrecausas.controller;

import br.edu.ifsp.entrecausas.dto.LoginRequestDTO;
import br.edu.ifsp.entrecausas.dto.UsuarioPerfilDTO;
import br.edu.ifsp.entrecausas.dto.UsuarioResponseDTO;

import br.edu.ifsp.entrecausas.entity.Usuario;

import br.edu.ifsp.entrecausas.repository.UsuarioRepository;

import br.edu.ifsp.entrecausas.security.AesCryptoUtil;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
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
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final SecurityContextRepository securityContextRepository;
    private final AesCryptoUtil aesCryptoUtil;

    public AuthController(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            SecurityContextRepository securityContextRepository,
            AesCryptoUtil aesCryptoUtil) {

        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.securityContextRepository = securityContextRepository;
        this.aesCryptoUtil = aesCryptoUtil;
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
        Authentication autenticacao =
            criarAutenticacao(usuario);

        // Renova o identificador se já existir uma sessão.
        if (request.getSession(false) != null) {
            request.changeSessionId();
        }

        // Salva a autenticação na sessão HTTP.
        salvarAutenticacao(
            autenticacao,
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
            Authentication autenticacao,
            HttpServletRequest request) {

        Optional<Usuario> resultado =
            buscarUsuarioAutenticado(
                autenticacao,
                request
            );

        if (resultado.isEmpty()) {
            return respostaNaoAutorizada();
        }

        return ResponseEntity.ok(
            converterParaDTO(resultado.get())
        );
    }

    // Retorna os dados privados do próprio perfil.
    @GetMapping("/perfil")
    @Transactional(readOnly = true)
    public ResponseEntity<?> consultarPerfil(
            Authentication autenticacao,
            HttpServletRequest request) {

        Optional<Usuario> resultado =
            buscarUsuarioAutenticado(
                autenticacao,
                request
            );

        if (resultado.isEmpty()) {
            return respostaNaoAutorizada();
        }

        Usuario usuario = resultado.get();

        String cpf =
            aesCryptoUtil.decrypt(usuario.getCpf());

        String telefone =
            aesCryptoUtil.decrypt(usuario.getTelefone());

        UsuarioPerfilDTO perfil =
            new UsuarioPerfilDTO(
                usuario.getIdUsuario(),
                usuario.getNome(),
                usuario.getEmail(),
                mascararCpf(cpf),
                telefone,
                usuario.getFotoPerfil(),
                usuario.getFotoAlt(),
                usuario.getFuncao().getNome()
            );

        return ResponseEntity.ok(perfil);
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

    // Atualiza a autenticação com os dados retornados pelo serviço.
    public void atualizarAutenticacao(
            UsuarioResponseDTO usuario,
            HttpServletRequest request,
            HttpServletResponse response) {

        String funcao = usuario.funcaoNome()
            .trim()
            .toUpperCase(Locale.ROOT);

        var autoridades = List.of(
            new SimpleGrantedAuthority("ROLE_" + funcao)
        );

        Authentication autenticacao =
            new UsernamePasswordAuthenticationToken(
                usuario.email(),
                null,
                autoridades
            );

        salvarAutenticacao(
            autenticacao,
            request,
            response
        );
    }

    // Atualiza a autenticação após uma mudança de e-mail.
    public void atualizarAutenticacao(
            Usuario usuario,
            HttpServletRequest request,
            HttpServletResponse response) {

        Authentication autenticacao =
            criarAutenticacao(usuario);

        salvarAutenticacao(
            autenticacao,
            request,
            response
        );
    }

    // Cria a autenticação com a função definida no banco.
    private Authentication criarAutenticacao(
            Usuario usuario) {

        String funcao = usuario.getFuncao()
            .getNome()
            .trim()
            .toUpperCase(Locale.ROOT);

        var autoridades = List.of(
            new SimpleGrantedAuthority("ROLE_" + funcao)
        );

        return new UsernamePasswordAuthenticationToken(
            usuario.getEmail(),
            null,
            autoridades
        );
    }

    // Persiste a autenticação na sessão HTTP.
    private void salvarAutenticacao(
            Authentication autenticacao,
            HttpServletRequest request,
            HttpServletResponse response) {

        SecurityContext contexto =
            SecurityContextHolder.createEmptyContext();

        contexto.setAuthentication(autenticacao);
        SecurityContextHolder.setContext(contexto);

        securityContextRepository.saveContext(
            contexto,
            request,
            response
        );
    }

    // Busca somente o usuário da sessão autenticada.
    private Optional<Usuario> buscarUsuarioAutenticado(
            Authentication autenticacao,
            HttpServletRequest request) {

        if (autenticacao == null
                || !autenticacao.isAuthenticated()
                || "anonymousUser".equals(
                    autenticacao.getPrincipal())) {

            return Optional.empty();
        }

        Optional<Usuario> resultado =
            usuarioRepository.findByEmail(
                autenticacao.getName()
            );

        if (resultado.isEmpty()) {

            // Limpa a autenticação da requisição atual.
            SecurityContextHolder.clearContext();

            // Invalida a sessão HTTP existente.
            HttpSession sessao = request.getSession(false);

            if (sessao != null) {
                sessao.invalidate();
            }
        }

        return resultado;
    }

    // Resposta para sessões não autenticadas ou inválidas.
    private ResponseEntity<?> respostaNaoAutorizada() {

        return ResponseEntity
            .status(HttpStatus.UNAUTHORIZED)
            .body(Map.of(
                "mensagem",
                "É necessário entrar na conta."
            ));
    }

    // Oculta o CPF, preservando somente os três dígitos centrais.
    private String mascararCpf(String cpf) {

        if (cpf == null || !cpf.matches("\\d{11}")) {
            return "***.***.***-**";
        }

        return "***." + cpf.substring(3, 6) + ".***-**";
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