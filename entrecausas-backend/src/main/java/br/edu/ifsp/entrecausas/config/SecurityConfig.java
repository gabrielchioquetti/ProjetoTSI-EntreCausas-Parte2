package br.edu.ifsp.entrecausas.config;

import br.edu.ifsp.entrecausas.repository.UsuarioRepository;
import br.edu.ifsp.entrecausas.security.UsuarioAtivoFilter;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;

import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.session.SessionRegistry;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.intercept.AuthorizationFilter;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.security.web.session.ConcurrentSessionFilter;
import org.springframework.security.web.session.SessionInformationExpiredStrategy;

import org.springframework.web.filter.CorsFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    // Persiste a autenticação na sessão HTTP.
    @Bean
    public SecurityContextRepository securityContextRepository() {
        return new HttpSessionSecurityContextRepository();
    }

    // A autenticação é realizada pelo AuthController,
    // utilizando os usuários cadastrados no banco.
    // Impede a criação automática do usuário em memória.
    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            throw new UsernameNotFoundException(
                "Autenticação realizada pelo AuthController."
            );
        };
    }

    // Retorna HTTP 401 quando uma sessão foi expirada.
    @Bean
    public SessionInformationExpiredStrategy sessionInformationExpiredStrategy() {

        return event -> {
            HttpServletResponse response = event.getResponse();

            response.setStatus(
                HttpServletResponse.SC_UNAUTHORIZED
            );

            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            response.getWriter().write(
                "{\"codigo\":\"SESSAO_EXPIRADA\","
                + "\"mensagem\":\"Sua sessão foi encerrada por segurança. Entre novamente na sua conta.\"}"
            );
        };
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            SecurityContextRepository securityContextRepository,
            SessionRegistry sessionRegistry,
            SessionInformationExpiredStrategy
                    sessionInformationExpiredStrategy,
            UsuarioRepository usuarioRepository)
            throws Exception {

        http
            // Integra o CORS configurado no WebConfig.
            .cors(Customizer.withDefaults())

            // Protege requisições que modificam dados.
            .csrf(csrf -> csrf
                .csrfTokenRepository(
                    CookieCsrfTokenRepository.withHttpOnlyFalse()
                )
                .csrfTokenRequestHandler(
                    new CsrfTokenRequestAttributeHandler()
                )
            )

            // Mantém a autenticação na sessão.
            .securityContext(context -> context
                .securityContextRepository(
                    securityContextRepository
                )
            )

            .sessionManagement(session -> session
                .sessionCreationPolicy(
                    SessionCreationPolicy.IF_REQUIRED
                )
            )

            .authorizeHttpRequests(auth -> auth

                // Permite requisições de preflight do CORS.
                .requestMatchers(
                    HttpMethod.OPTIONS,
                    "/**"
                ).permitAll()

                // Permite o cadastro de novos usuários.
                .requestMatchers(
                    HttpMethod.POST,
                    "/api/usuarios"
                ).permitAll()

                // Permite iniciar uma sessão.
                .requestMatchers(
                    HttpMethod.POST,
                    "/api/auth/login"
                ).permitAll()

                // Permite obter o token CSRF.
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/auth/csrf"
                ).permitAll()

                // O logout é permitido, mas continua protegido
                // pela validação CSRF.
                .requestMatchers(
                    HttpMethod.POST,
                    "/api/auth/logout"
                ).permitAll()

                // Permite solicitar e validar a recuperação
                // de senha sem estar autenticado.
                .requestMatchers(
                    HttpMethod.POST,
                    "/api/recuperacao-senha/solicitar",
                    "/api/recuperacao-senha/validar",
                    "/api/recuperacao-senha/redefinir"
                ).permitAll()


                // Somente o MASTER pode consultar o histórico de auditoria.
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/auditoria",
                    "/api/auditoria/**"
                ).hasRole("MASTER")

                // Bloqueia outros métodos HTTP na auditoria.
                .requestMatchers(
                    "/api/auditoria",
                    "/api/auditoria/**"
                ).denyAll()

                // A listagem completa de usuários
                // é exclusiva do MASTER.
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/usuarios"
                ).hasRole("MASTER")

                // Somente o MASTER pode promover ou rebaixar usuários.
                .requestMatchers(
                    HttpMethod.PUT,
                    "/api/usuarios/*/promover",
                    "/api/usuarios/*/rebaixar"
                ).hasRole("MASTER")

                // Impede a criação direta de solicitações.
                // O cadastro e a edição de ONGs criam
                // suas próprias solicitações internamente.
                .requestMatchers(
                    HttpMethod.POST,
                    "/api/solicitacoes"
                ).denyAll()

                // Administradores e MASTER consultam detalhes
                // completos das ONGs.
                .requestMatchers(
                    "/api/ongs/admin/**"
                ).hasAnyRole("ADMINISTRADOR", "MASTER")

                // Permite consultar as ONGs publicadas sem login.
                // O OngService filtra as organizações não aprovadas.
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/ongs",
                    "/api/ongs/{id}"
                ).permitAll()

                // Administradores e MASTER consultam
                // e analisam solicitações.
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/solicitacoes"
                ).hasAnyRole("ADMINISTRADOR", "MASTER")

                // Administradores e MASTER consultam
                // os status disponíveis para análise.
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/solicitacoes/status-opcoes"
                ).hasAnyRole("ADMINISTRADOR", "MASTER")

                // Administradores e MASTER consultam
                // solicitações por status.
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/solicitacoes/status/**"
                ).hasAnyRole("ADMINISTRADOR", "MASTER")

                // Administradores e MASTER consultam
                // solicitações por usuário ou ONG.
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/solicitacoes/usuario/*",
                    "/api/solicitacoes/ong/*"
                ).hasAnyRole("ADMINISTRADOR", "MASTER")

                // Administradores e MASTER podem comparar
                // os dados atuais e propostos de uma ONG.
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/solicitacoes/*/comparacao"
                ).hasAnyRole("ADMINISTRADOR", "MASTER")

                // Administradores e MASTER consultam
                // uma solicitação pelo ID.
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/solicitacoes/*"
                ).hasAnyRole("ADMINISTRADOR", "MASTER")

                // Administradores e MASTER podem
                // aprovar ou rejeitar solicitações.
                .requestMatchers(
                    HttpMethod.PUT,
                    "/api/solicitacoes/*/analise"
                ).hasAnyRole("ADMINISTRADOR", "MASTER")

                // Protege qualquer outra rota de solicitações
                // que venha a ser adicionada futuramente.
                .requestMatchers(
                    "/api/solicitacoes",
                    "/api/solicitacoes/**"
                ).hasAnyRole("ADMINISTRADOR", "MASTER")

                // Permite acessar o endpoint de imagens.
                // A autorização de cada arquivo é verificada
                // pelo ImagemService antes da entrega.
                .requestMatchers(
                    HttpMethod.GET,
                    "/uploads/*"
                ).permitAll()

                // Impede outros métodos HTTP
                // no caminho de uploads.
                .requestMatchers(
                    "/uploads/**"
                ).denyAll()

                // Impede alterações diretas que contornem
                // o processo de moderação das ONGs.
                .requestMatchers(
                    HttpMethod.POST,
                    "/api/imagens",
                    "/api/imagens/lote"
                ).denyAll()

                .requestMatchers(
                    HttpMethod.PUT,
                    "/api/imagens/*"
                ).denyAll()

                .requestMatchers(
                    HttpMethod.DELETE,
                    "/api/imagens/*"
                ).denyAll()

                // Administradores e MASTER consultam
                // a listagem geral de imagens.
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/imagens"
                ).hasAnyRole("ADMINISTRADOR", "MASTER")

                // Temporariamente, administradores e MASTER
                // consultam imagens por ID ou ONG.
                // A autorização por proprietário poderá
                // ser implementada no ImagemService.
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/imagens/**"
                ).hasAnyRole("ADMINISTRADOR", "MASTER")

                // Bloqueia outros métodos não previstos
                // para gerenciamento direto de imagens.
                .requestMatchers(
                    "/api/imagens",
                    "/api/imagens/**"
                ).denyAll()

                // Permite enviar mensagens pelo Fale Conosco sem login.
                .requestMatchers(
                    HttpMethod.POST,
                    "/api/contato"
                ).permitAll()

                // Os demais endpoints exigem autenticação.
                .anyRequest().authenticated()

            )

            // Retorna JSON quando falta autenticação
            // ou quando o acesso é negado.
            .exceptionHandling(ex -> ex

                .authenticationEntryPoint(
                    (request, response, exception) -> {

                        response.setStatus(
                            HttpServletResponse.SC_UNAUTHORIZED
                        );

                        response.setContentType(
                            "application/json"
                        );

                        response.setCharacterEncoding("UTF-8");

                        response.getWriter().write(
                            "{\"mensagem\":\"É necessário entrar na conta para acessar este recurso.\"}"
                        );
                    }
                )

                .accessDeniedHandler(
                    (request, response, exception) -> {

                        response.setStatus(
                            HttpServletResponse.SC_FORBIDDEN
                        );

                        response.setContentType(
                            "application/json"
                        );

                        response.setCharacterEncoding("UTF-8");

                        response.getWriter().write(
                            "{\"mensagem\":\"Você não tem permissão para realizar esta operação.\"}"
                        );
                    }
                )

            )

            // Desabilita o login por formulário do Spring.
            .formLogin(form -> form.disable())

            // Não utiliza autenticação HTTP Basic.
            .httpBasic(basic -> basic.disable())

            // Encerra a sessão ao sair da conta.
            .logout(logout -> logout
                .logoutUrl("/api/auth/logout")
                .invalidateHttpSession(true)
                .clearAuthentication(true)
                .deleteCookies("JSESSIONID")
                .logoutSuccessHandler(
                    (request, response, authentication) ->
                        response.setStatus(
                            HttpServletResponse.SC_NO_CONTENT
                        )
                )
            );

        // Verifica se a sessão foi marcada como expirada.
        // Executa após o processamento CORS.
        http.addFilterAfter(
            new ConcurrentSessionFilter(
                sessionRegistry,
                sessionInformationExpiredStrategy
            ),
            CorsFilter.class
        );

        // Bloqueia sessões de usuários inexistentes
        // ou com contas desativadas.
        // Executa após o carregamento da autenticação
        // e antes da autorização dos endpoints.
        http.addFilterBefore(
            new UsuarioAtivoFilter(
                usuarioRepository,
                sessionRegistry
            ),
            AuthorizationFilter.class
        );

        return http.build();
    }
}