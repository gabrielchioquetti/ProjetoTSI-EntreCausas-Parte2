package br.edu.ifsp.entrecausas.config;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;

@Configuration
public class SecurityConfig {

    // Persiste a autenticação na sessão HTTP.
    @Bean
    public SecurityContextRepository securityContextRepository() {
        return new HttpSessionSecurityContextRepository();
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

                // Os demais endpoints exigem autenticação.
                .anyRequest().authenticated()
            )

            // Retorna JSON quando falta autenticação.
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