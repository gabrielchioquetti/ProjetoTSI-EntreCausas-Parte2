package br.edu.ifsp.entrecausas.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// Configurações do Spring MVC.
@Configuration
public class WebConfig implements WebMvcConfigurer {

    // Origens permitidas para acessar o backend.
    @Value("${CORS_ALLOWED_ORIGINS:http://localhost:5173,http://localhost:3000}")
    private String corsAllowedOrigins;

    // Configura o acesso do frontend à API.
    @Override
    public void addCorsMappings(CorsRegistry registry) {

        String[] origens = corsAllowedOrigins.split(",");

        for (int i = 0; i < origens.length; i++) {
            origens[i] = origens[i].trim();
        }

        registry.addMapping("/**")
                .allowedOrigins(origens)
                .allowedMethods(
                    "GET",
                    "POST",
                    "PUT",
                    "PATCH",
                    "DELETE",
                    "OPTIONS"
                )
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}