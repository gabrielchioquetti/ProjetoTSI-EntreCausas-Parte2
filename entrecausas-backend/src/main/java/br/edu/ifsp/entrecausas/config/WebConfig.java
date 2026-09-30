package br.edu.ifsp.entrecausas.config;

import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// Configurações do Spring MVC.
@Configuration
public class WebConfig implements WebMvcConfigurer {

    // Configura o acesso do frontend à API.
    @Override
    public void addCorsMappings(CorsRegistry registry) {

        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173", "http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*");
    }

    // Permite acessar os arquivos enviados pela aplicação.
    @Override
    public void addResourceHandlers(
            ResourceHandlerRegistry registry) {

        Path uploadDir = Paths.get("uploads");

        String uploadPath = uploadDir.toFile().getAbsolutePath();

        // Mapeia /uploads/** para a pasta física.
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadPath + "/");
    }
}
