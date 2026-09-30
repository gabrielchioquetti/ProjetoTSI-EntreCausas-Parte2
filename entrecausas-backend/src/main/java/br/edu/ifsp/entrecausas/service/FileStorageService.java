package br.edu.ifsp.entrecausas.service;

import br.edu.ifsp.entrecausas.exception.ArquivoException;

import org.apache.tika.Tika;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;

import java.awt.image.BufferedImage;

import java.io.IOException;
import java.io.InputStream;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import java.util.Map;
import java.util.UUID;

// Serviço responsável pelos arquivos.
@Service
public class FileStorageService {

    // Tamanho máximo permitido.
    private static final long TAMANHO_MAXIMO =
        5 * 1024 * 1024;

    // Dimensão máxima da imagem.
    private static final int DIMENSAO_MAXIMA = 6000;

    // Somente JPG e PNG são aceitos.
    private static final Map<String, String> TIPOS_PERMITIDOS =
        Map.of(
            "image/jpeg", ".jpg",
            "image/png", ".png"
        );

    // Detecta o tipo real do arquivo.
    private final Tika tika = new Tika();

    // Diretório das imagens.
    private final Path diretorioUploads =
        Paths.get("uploads")
            .toAbsolutePath()
            .normalize();

    // Cria o diretório ao iniciar.
    public FileStorageService() {

        try {

            Files.createDirectories(
                diretorioUploads
            );

        } catch (IOException e) {

            throw new ArquivoException(
                "Não foi possível criar o diretório de uploads.",
                e
            );
        }
    }

    // Salva e valida uma imagem.
    public String salvarArquivo(
            MultipartFile arquivo) {

        if (arquivo == null || arquivo.isEmpty()) {
            return null;
        }

        validarTamanho(arquivo);

        String tipoArquivo =
            detectarTipoArquivo(arquivo);

        String extensao =
            TIPOS_PERMITIDOS.get(tipoArquivo);

        if (extensao == null) {

            throw new ArquivoException(
                "Tipo de arquivo não permitido. "
                + "Envie uma imagem JPG ou PNG."
            );
        }

        validarImagem(arquivo);

        String nomeUnico =
            UUID.randomUUID() + extensao;

        Path caminhoDestino =
            diretorioUploads
                .resolve(nomeUnico)
                .normalize();

        // Impede saída do diretório de uploads.
        if (!caminhoDestino.getParent()
                .equals(diretorioUploads)) {

            throw new ArquivoException(
                "Caminho de arquivo inválido."
            );
        }

        try (InputStream inputStream =
                arquivo.getInputStream()) {

            Files.copy(
                inputStream,
                caminhoDestino
            );

            return nomeUnico;

        } catch (IOException e) {

            throw new ArquivoException(
                "Erro ao salvar o arquivo.",
                e
            );
        }
    }

    // Remove uma imagem armazenada.
    public void deletarArquivo(
            String nomeArquivo) {

        if (nomeArquivo == null
                || nomeArquivo.isBlank()) {

            return;
        }

        Path caminhoArquivo =
            diretorioUploads
                .resolve(nomeArquivo)
                .normalize();

        // Impede acesso fora do diretório.
        if (!caminhoArquivo.getParent()
                .equals(diretorioUploads)) {

            throw new ArquivoException(
                "Caminho de arquivo inválido."
            );
        }

        try {

            Files.deleteIfExists(
                caminhoArquivo
            );

        } catch (IOException e) {

            throw new ArquivoException(
                "Erro ao remover o arquivo.",
                e
            );
        }
    }

    // Verifica o tamanho do arquivo.
    private void validarTamanho(
            MultipartFile arquivo) {

        if (arquivo.getSize() > TAMANHO_MAXIMO) {

            throw new ArquivoException(
                "A imagem deve ter no máximo 5 MB."
            );
        }
    }

    // Detecta o tipo real do arquivo.
    private String detectarTipoArquivo(
            MultipartFile arquivo) {

        try (InputStream inputStream =
                arquivo.getInputStream()) {

            return tika.detect(inputStream);

        } catch (IOException e) {

            throw new ArquivoException(
                "Não foi possível verificar "
                + "o tipo do arquivo.",
                e
            );
        }
    }

    // Valida o conteúdo da imagem.
    private void validarImagem(
            MultipartFile arquivo) {

        try (InputStream inputStream =
                arquivo.getInputStream()) {

            BufferedImage imagem =
                ImageIO.read(inputStream);

            if (imagem == null) {

                throw new ArquivoException(
                    "O arquivo enviado não é "
                    + "uma imagem válida."
                );
            }

            if (imagem.getWidth() > DIMENSAO_MAXIMA
                    || imagem.getHeight()
                    > DIMENSAO_MAXIMA) {

                throw new ArquivoException(
                    "A imagem não pode possuir "
                    + "largura ou altura superior "
                    + DIMENSAO_MAXIMA
                    + " pixels."
                );
            }

        } catch (IOException e) {

            throw new ArquivoException(
                "Não foi possível validar "
                + "a imagem enviada.",
                e
            );
        }
    }
}