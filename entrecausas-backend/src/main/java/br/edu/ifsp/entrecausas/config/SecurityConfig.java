package br.edu.ifsp.entrecausas.config;

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
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;

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

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            SecurityContextRepository securityContextRepository)
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

                // Impede a criação direta de solicitações.
                // O cadastro e a edição de ONGs criam
                // suas próprias solicitações internamente.
                .requestMatchers(
                    HttpMethod.POST,
                    "/api/solicitacoes"
                ).denyAll()

                // Somente administradores consultam detalhes
                // completos das ONGs.
                .requestMatchers(
                    "/api/ongs/admin/**"
                ).hasRole("ADMINISTRADOR")

                // Permite consultar as ONGs publicadas sem login.
                // O OngService filtra as organizações não aprovadas.
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/ongs",
                    "/api/ongs/{id}"
                ).permitAll()

                // Somente administradores consultam
                // e analisam solicitações.
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/solicitacoes"
                ).hasRole("ADMINISTRADOR")

                // Somente administradores consultam
                // os status disponíveis para análise.
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/solicitacoes/status-opcoes"
                ).hasRole("ADMINISTRADOR")

                // Somente administradores consultam
                // solicitações por status.
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/solicitacoes/status/**"
                ).hasRole("ADMINISTRADOR")

                // Somente administradores consultam
                // solicitações por usuário ou ONG.
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/solicitacoes/usuario/*",
                    "/api/solicitacoes/ong/*"
                ).hasRole("ADMINISTRADOR")

                // Somente administradores podem comparar
                // os dados atuais e propostos de uma ONG.
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/solicitacoes/*/comparacao"
                ).hasRole("ADMINISTRADOR")

                // Somente administradores consultam
                // uma solicitação pelo ID.
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/solicitacoes/*"
                ).hasRole("ADMINISTRADOR")

                // Somente administradores podem
                // aprovar ou rejeitar solicitações.
                .requestMatchers(
                    HttpMethod.PUT,
                    "/api/solicitacoes/*/analise"
                ).hasRole("ADMINISTRADOR")

                // Protege qualquer outra rota de solicitações
                // que venha a ser adicionada futuramente.
                .requestMatchers(
                    "/api/solicitacoes",
                    "/api/solicitacoes/**"
                ).hasRole("ADMINISTRADOR")

                // Permite acessar o endpoint de imagens.
                // A autorização de cada arquivo é verificada
                // pelo ImagemService antes da entrega.
                .requestMatchers(
                    HttpMethod.GET,
                    "/uploads/*"
                ).permitAll()

                // Impede outros métodos HTTP no caminho de uploads.
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

                // Somente administradores consultam
                // a listagem geral de imagens.
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/imagens"
                ).hasRole("ADMINISTRADOR")

                // Temporariamente, somente administradores
                // consultam imagens por ID ou ONG.
                // A autorização por proprietário poderá
                // ser implementada no ImagemService.
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/imagens/**"
                ).hasRole("ADMINISTRADOR")

                // Bloqueia outros métodos não previstos
                // para gerenciamento direto de imagens.
                .requestMatchers(
                    "/api/imagens",
                    "/api/imagens/**"
                ).denyAll()

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

        return http.build();
    }
}