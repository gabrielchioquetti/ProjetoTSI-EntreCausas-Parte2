package br.edu.ifsp.entrecausas.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class ImageStorageService {

    // Define o caminho absoluto para a pasta 'uploads' na raiz do projeto
    private final Path uploadRoot = Paths.get("uploads").toAbsolutePath().normalize();

    public ImageStorageService() {
        try {
            // Cria a pasta na raiz caso ela ainda não exista
            Files.createDirectories(this.uploadRoot);
        } catch (IOException e) {
            throw new RuntimeException("Não foi possível criar a pasta de uploads!", e);
        }
    }

    public String salvarImagem(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return "/img/default/ongs.png"; // Caminho padrão de fallback
        }

        try {
            // Gera um nome único para o arquivo (ex: a1b2c3d4-foto.jpg)
            String nomeOriginal = file.getOriginalFilename();
            String nomeUnico = UUID.randomUUID().toString() + "_" + nomeOriginal;

            // Define o destino final no sistema de arquivos
            Path destino = this.uploadRoot.resolve(nomeUnico);
            Files.copy(file.getInputStream(), destino, StandardCopyOption.REPLACE_EXISTING);

            // Retorna o caminho relativo/URL para salvar na coluna do MySQL
            return "/uploads/" + nomeUnico;
        } catch (IOException e) {
            throw new RuntimeException("Erro ao salvar arquivo de imagem", e);
        }
    }
}