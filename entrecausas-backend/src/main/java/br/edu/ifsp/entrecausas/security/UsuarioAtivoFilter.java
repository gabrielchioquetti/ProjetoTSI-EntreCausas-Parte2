package br.edu.ifsp.entrecausas.security;

import br.edu.ifsp.entrecausas.entity.Usuario;
import br.edu.ifsp.entrecausas.repository.UsuarioRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

public class UsuarioAtivoFilter extends OncePerRequestFilter {

    private final UsuarioRepository usuarioRepository;
    private final SessionRegistry sessionRegistry;

    public UsuarioAtivoFilter(
            UsuarioRepository usuarioRepository,
            SessionRegistry sessionRegistry) {

        this.usuarioRepository = usuarioRepository;
        this.sessionRegistry = sessionRegistry;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        Authentication autenticacao =
                SecurityContextHolder.getContext()
                        .getAuthentication();

        // Requisições sem autenticação continuam normalmente.
        if (autenticacao == null
                || !autenticacao.isAuthenticated()
                || autenticacao instanceof
                        org.springframework.security.authentication.AnonymousAuthenticationToken) {

            filterChain.doFilter(request, response);
            return;
        }

        // A autenticação do EntreCausas usa o e-mail.
        String email = autenticacao.getName();

        Optional<Usuario> resultado =
                usuarioRepository.findByEmail(email);

        // Bloqueia contas inexistentes ou desativadas.
        if (resultado.isEmpty() || !resultado.get().isAtivo()) {

            HttpSession sessao = request.getSession(false);

            if (sessao != null) {
                sessionRegistry.removeSessionInformation(
                        sessao.getId()
                );

                sessao.invalidate();
            }

            SecurityContextHolder.clearContext();

            response.setStatus(
                    HttpServletResponse.SC_UNAUTHORIZED
            );
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            response.getWriter().write(
                    "{\"codigo\":\"CONTA_DESATIVADA\","
                    + "\"mensagem\":\"Sua conta não está mais ativa.\"}"
            );

            return;
        }

        filterChain.doFilter(request, response);
    }
}