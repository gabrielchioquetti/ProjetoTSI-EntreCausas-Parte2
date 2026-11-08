package br.edu.ifsp.entrecausas.service;

import br.edu.ifsp.entrecausas.exception.ArquivoException;

import org.apache.tika.Tika;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;

import java.awt.image.BufferedImage;

import java.io.IOException;
import java.io.InputStream;

import java.net.MalformedURLException;

import java.nio.file.Files;
import java.nio.file.LinkOption;
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
    private final Path diretorioUploads;

    // Cria o diretório ao iniciar.
    // Utiliza UPLOAD_DIR quando configurado.
    public FileStorageService(
            @Value("${UPLOAD_DIR:uploads}") String uploadDir) {

        diretorioUploads = Paths.get(uploadDir)
            .toAbsolutePath()
            .normalize();

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
            resolverCaminhoSeguro(nomeUnico);

        try (InputStream inputStream =
                arquivo.getInputStream()) {

            Files.copy(
                inputStream,
                caminhoDestino
            );

            return nomeUnico;

        } catch (IOException e) {

            // Remove um arquivo parcialmente gravado.
            try {
                Files.deleteIfExists(caminhoDestino);
            } catch (IOException erroExclusao) {
                e.addSuppressed(erroExclusao);
            }

            throw new ArquivoException(
                "Erro ao salvar o arquivo.",
                e
            );
        }
    }

    // Carrega uma imagem para entrega autorizada.
    // A permissão deve ser verificada antes desta chamada.
    public Resource carregarArquivo(String nomeArquivo) {

        Path caminhoArquivo =
            resolverCaminhoSeguro(nomeArquivo);

        // Impede a leitura de arquivos inexistentes
        // ou de links simbólicos.
        if (!Files.isRegularFile(
                caminhoArquivo,
                LinkOption.NOFOLLOW_LINKS)) {

            throw new ArquivoException(
                "Arquivo não encontrado."
            );
        }

        try {

            Resource recurso =
                new UrlResource(
                    caminhoArquivo.toUri()
                );

            if (!recurso.isReadable()) {

                throw new ArquivoException(
                    "Arquivo não disponível para leitura."
                );
            }

            return recurso;

        } catch (MalformedURLException e) {

            throw new ArquivoException(
                "Não foi possível carregar o arquivo.",
                e
            );
        }
    }

    // Identifica o tipo de conteúdo pelo nome validado.
    public String obterTipoConteudo(String nomeArquivo) {

        validarNomeArquivo(nomeArquivo);

        if (nomeArquivo.endsWith(".jpg")) {
            return "image/jpeg";
        }

        return "image/png";
    }

    // Remove uma imagem armazenada.
    public void deletarArquivo(
            String nomeArquivo) {

        if (nomeArquivo == null
                || nomeArquivo.isBlank()) {

            return;
        }

        Path caminhoArquivo =
            resolverCaminhoSeguro(nomeArquivo);

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

    // Resolve o caminho sem permitir acesso fora de uploads.
    private Path resolverCaminhoSeguro(
            String nomeArquivo) {

        validarNomeArquivo(nomeArquivo);

        Path caminhoArquivo =
            diretorioUploads
                .resolve(nomeArquivo)
                .normalize();

        // Impede saída do diretório de uploads.
        if (!caminhoArquivo.getParent()
                .equals(diretorioUploads)) {

            throw new ArquivoException(
                "Caminho de arquivo inválido."
            );
        }

        return caminhoArquivo;
    }

    // Aceita somente nomes UUID gerados pelo armazenamento.
    private void validarNomeArquivo(
            String nomeArquivo) {

        if (nomeArquivo == null
                || !nomeArquivo.matches(
                    "^[0-9a-fA-F]{8}-"
                    + "[0-9a-fA-F]{4}-"
                    + "[0-9a-fA-F]{4}-"
                    + "[0-9a-fA-F]{4}-"
                    + "[0-9a-fA-F]{12}\\.(jpg|png)$"
                )) {

            throw new ArquivoException(
                "Nome de arquivo inválido."
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