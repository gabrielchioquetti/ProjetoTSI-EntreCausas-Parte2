package br.edu.ifsp.entrecausas.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/uploads")
public class UploadController {

    // Caminho onde as imagens serão guardadas no servidor
    private static final String UPLOAD_DIR = "uploads/";

    @PostMapping
    public ResponseEntity<Map<String, String>> uploadImagem(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Ficheiro vazio"));
        }

        try {
            // Cria a pasta /uploads se ela não existir
            File pasta = new File(UPLOAD_DIR);
            if (!pasta.exists()) {
                pasta.mkdirs();
            }

            // Gera um nome único para evitar sobrepor ficheiros com o mesmo nome
            String nomeUnico = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path caminhoCompleto = Paths.get(UPLOAD_DIR + nomeUnico);

            // Salva o ficheiro no disco
            Files.write(caminhoCompleto, file.getBytes());

            // Retorna a URL onde a imagem pode ser acedida
            String urlImagem = "http://localhost:8080/uploads/" + nomeUnico;

            return ResponseEntity.ok(Map.of("url", urlImagem));

        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of("erro", "Erro ao guardar imagem"));
        }
    }
}