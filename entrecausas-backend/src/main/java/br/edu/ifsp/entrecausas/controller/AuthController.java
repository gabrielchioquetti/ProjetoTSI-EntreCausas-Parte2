package br.edu.ifsp.entrecausas.controller;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.session.SessionInformation;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final SecurityContextRepository securityContextRepository;
    private final AesCryptoUtil aesCryptoUtil;
    private final SessionRegistry sessionRegistry;

    public AuthController(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            SecurityContextRepository securityContextRepository,
            AesCryptoUtil aesCryptoUtil,
            SessionRegistry sessionRegistry) {

        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.securityContextRepository = securityContextRepository;
        this.aesCryptoUtil = aesCryptoUtil;
        this.sessionRegistry = sessionRegistry;
    }

    // Realiza o login e cria a sessão autenticada.
    @PostMapping("/login")
    @Transactional(readOnly = true)
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequestDTO dto,
            HttpServletRequest request,
            HttpServletResponse response) {

        Optional<Usuario> resultado = usuarioRepository.findByEmail(dto.email().trim());

        // Não revela se o e-mail existe ou se a conta está desativada.
        if (resultado.isEmpty()
                || !resultado.get().isAtivo()
                || !passwordEncoder.matches(
                        dto.senha(),
                        resultado.get().getSenha())) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "mensagem",
                            "E-mail ou senha inválidos."));
        }

        Usuario usuario = resultado.get();

        // A função vem do banco, nunca do formulário.
        Authentication autenticacao = criarAutenticacao(usuario);

        // Renova o identificador se já existir uma sessão.
        if (request.getSession(false) != null) {
            request.changeSessionId();
        }

        // Salva e registra a autenticação na sessão HTTP.
        salvarAutenticacao(
                autenticacao,
                request,
                response);

        return ResponseEntity.ok(
                converterParaDTO(usuario));
    }

    // Retorna o usuário da sessão atual.
    @GetMapping("/me")
    @Transactional(readOnly = true)
    public ResponseEntity<?> usuarioAutenticado(
            Authentication autenticacao,
            HttpServletRequest request) {

        Optional<Usuario> resultado = buscarUsuarioAutenticado(
                autenticacao,
                request);

        if (resultado.isEmpty()) {
            return respostaNaoAutorizada();
        }

        return ResponseEntity.ok(
                converterParaDTO(resultado.get()));
    }

    // Retorna os dados privados do próprio perfil.
    @GetMapping("/perfil")
    @Transactional(readOnly = true)
    public ResponseEntity<?> consultarPerfil(
            Authentication autenticacao,
            HttpServletRequest request) {

        Optional<Usuario> resultado = buscarUsuarioAutenticado(
                autenticacao,
                request);

        if (resultado.isEmpty()) {
            return respostaNaoAutorizada();
        }

        Usuario usuario = resultado.get();

        String cpf = aesCryptoUtil.decrypt(usuario.getCpf());

        String telefone = aesCryptoUtil.decrypt(usuario.getTelefone());

        UsuarioPerfilDTO perfil = new UsuarioPerfilDTO(
                usuario.getIdUsuario(),
                usuario.getNome(),
                usuario.getEmail(),
                mascararCpf(cpf),
                telefone,
                usuario.getFotoPerfil(),
                usuario.getFotoAlt(),
                usuario.getFuncao().getNome());

        return ResponseEntity.ok(perfil);
    }

    // Fornece o token CSRF necessário às requisições.
    @GetMapping("/csrf")
    public Map<String, String> obterTokenCsrf(
            CsrfToken csrfToken) {

        return Map.of(
                "token",
                csrfToken.getToken());
    }

    // Atualiza a autenticação com os dados retornados pelo serviço.
    public void atualizarAutenticacao(
            UsuarioResponseDTO usuario,
            HttpServletRequest request,
            HttpServletResponse response) {

        // Impede autenticar uma conta desativada.
        Usuario usuarioBanco = usuarioRepository
                .findById(usuario.idUsuario())
                .orElseThrow(() -> new AccessDeniedException(
                        "A conta não está disponível."));

        validarContaAtiva(usuarioBanco);

        String funcao = usuario.funcaoNome()
                .trim()
                .toUpperCase(Locale.ROOT);

        var autoridades = List.of(
                new SimpleGrantedAuthority("ROLE_" + funcao));

        Authentication autenticacao = new UsernamePasswordAuthenticationToken(
                usuario.email(),
                null,
                autoridades);

        salvarAutenticacao(
                autenticacao,
                request,
                response);
    }

    // Atualiza a autenticação após uma mudança de e-mail.
    public void atualizarAutenticacao(
            Usuario usuario,
            HttpServletRequest request,
            HttpServletResponse response) {

        validarContaAtiva(usuario);

        Authentication autenticacao = criarAutenticacao(usuario);

        salvarAutenticacao(
                autenticacao,
                request,
                response);
    }

    // Cria a autenticação com a função definida no banco.
    private Authentication criarAutenticacao(
            Usuario usuario) {

        validarContaAtiva(usuario);

        String funcao = usuario.getFuncao()
                .getNome()
                .trim()
                .toUpperCase(Locale.ROOT);

        var autoridades = List.of(
                new SimpleGrantedAuthority("ROLE_" + funcao));

        return new UsernamePasswordAuthenticationToken(
                usuario.getEmail(),
                null,
                autoridades);
    }

    // Confirma que a conta ainda está ativa.
    private void validarContaAtiva(Usuario usuario) {

        if (usuario == null || !usuario.isAtivo()) {
            throw new AccessDeniedException(
                    "Esta conta está desativada.");
        }
    }

    // Persiste a autenticação na sessão HTTP
    // e registra a sessão para controle de expiração.
    private void salvarAutenticacao(
            Authentication autenticacao,
            HttpServletRequest request,
            HttpServletResponse response) {

        SecurityContext contexto = SecurityContextHolder.createEmptyContext();

        contexto.setAuthentication(autenticacao);
        SecurityContextHolder.setContext(contexto);

        securityContextRepository.saveContext(
                contexto,
                request,
                response);

        HttpSession sessao = request.getSession(false);

        if (sessao != null) {
            String idSessao = sessao.getId();

            // Remove o registro anterior dessa sessão,
            // caso exista uma atualização de autenticação.
            SessionInformation registroAnterior = sessionRegistry.getSessionInformation(idSessao);

            if (registroAnterior != null) {
                sessionRegistry.removeSessionInformation(idSessao);
            }

            // Registra a sessão com o e-mail do usuário.
            sessionRegistry.registerNewSession(
                    idSessao,
                    autenticacao.getName());
        }
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

        Optional<Usuario> resultado = usuarioRepository.findByEmail(
                autenticacao.getName());

        // Rejeita contas inexistentes ou desativadas.
        if (resultado.isEmpty() || !resultado.get().isAtivo()) {

            // Limpa a autenticação da requisição atual.
            SecurityContextHolder.clearContext();

            // Invalida a sessão HTTP existente.
            HttpSession sessao = request.getSession(false);

            if (sessao != null) {
                sessionRegistry.removeSessionInformation(
                        sessao.getId());

                sessao.invalidate();
            }

            return Optional.empty();
        }

        return resultado;
    }

    // Resposta para sessões não autenticadas ou inválidas.
    private ResponseEntity<?> respostaNaoAutorizada() {

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of(
                        "mensagem",
                        "É necessário entrar na conta."));
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
                usuario.getFuncao().getNome());
    }
}