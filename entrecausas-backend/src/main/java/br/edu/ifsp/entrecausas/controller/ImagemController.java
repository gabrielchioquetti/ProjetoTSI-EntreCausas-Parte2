package br.edu.ifsp.entrecausas.controller;

import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import br.edu.ifsp.entrecausas.dto.ImagemResponseDTO;
import br.edu.ifsp.entrecausas.service.FileStorageService;
import br.edu.ifsp.entrecausas.service.ImagemService;

@RestController
public class ImagemController {

    private final ImagemService imagemService;
    private final FileStorageService fileStorageService;

    // Injeção de dependência via construtor.
    public ImagemController(
            ImagemService imagemService,
            FileStorageService fileStorageService) {

        this.imagemService = imagemService;
        this.fileStorageService = fileStorageService;
    }

    // Upload de UMA imagem.
    @PostMapping(
        value = "/api/imagens",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<ImagemResponseDTO> cadastrar(
            @RequestParam("idOng") Long idOng,
            @RequestParam(
                value = "textoAlternativo",
                required = false
            )
            String textoAlternativo,
            @RequestParam("file") MultipartFile file) {

        ImagemResponseDTO response =
            imagemService.cadastrar(
                idOng,
                textoAlternativo,
                file
            );

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(response);
    }

    // Upload em lote de imagens.
    @PostMapping(
        value = "/api/imagens/lote",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<List<ImagemResponseDTO>>
            cadastrarEmLote(
                @RequestParam("idOng") Long idOng,
                @RequestParam(
                    value = "textosAlternativos",
                    required = false
                )
                List<String> textosAlternativos,
                @RequestParam("files")
                List<MultipartFile> files) {

        List<ImagemResponseDTO> responses =
            imagemService.cadastrarEmLote(
                idOng,
                textosAlternativos,
                files
            );

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(responses);
    }

    // Lista todas as imagens.
    @GetMapping("/api/imagens")
    public ResponseEntity<List<ImagemResponseDTO>>
            listarTodas() {

        return ResponseEntity.ok(
            imagemService.listarTodas()
        );
    }

    // Busca uma imagem pelo ID.
    @GetMapping("/api/imagens/{id}")
    public ResponseEntity<ImagemResponseDTO> buscarPorId(
            @PathVariable Long id) {

        return ResponseEntity.ok(
            imagemService.buscarPorId(id)
        );
    }

    // Lista as imagens de uma ONG.
    @GetMapping("/api/imagens/ong/{idOng}")
    public ResponseEntity<List<ImagemResponseDTO>>
            listarPorOng(
                @PathVariable Long idOng) {

        return ResponseEntity.ok(
            imagemService.listarPorOng(idOng)
        );
    }

    // Atualiza uma imagem com arquivo opcional.
    @PutMapping(
        value = "/api/imagens/{id}",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<ImagemResponseDTO> atualizar(
            @PathVariable Long id,
            @RequestParam("idOng") Long idOng,
            @RequestParam(
                value = "textoAlternativo",
                required = false
            )
            String textoAlternativo,
            @RequestParam(
                value = "file",
                required = false
            )
            MultipartFile file) {

        ImagemResponseDTO response =
            imagemService.atualizar(
                id,
                idOng,
                textoAlternativo,
                file
            );

        return ResponseEntity.ok(response);
    }

    // Remove a imagem do banco e do arquivo físico.
    @DeleteMapping("/api/imagens/{id}")
    public ResponseEntity<Void> deletar(
            @PathVariable Long id) {

        imagemService.deletar(id);

        return ResponseEntity
            .noContent()
            .build();
    }

    // Entrega uma imagem após verificar a autorização.
    @GetMapping("/uploads/{nomeArquivo:.+}")
    public ResponseEntity<Resource> visualizarImagem(
            @PathVariable String nomeArquivo,
            Authentication authentication) {

        // Verifica se o visitante pode acessar a imagem.
        imagemService.verificarAcesso(
            nomeArquivo,
            authentication
        );

        // Carrega o arquivo somente após a autorização.
        Resource recurso =
            fileStorageService.carregarArquivo(nomeArquivo);

        String tipoConteudo =
            fileStorageService.obterTipoConteudo(nomeArquivo);

        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(tipoConteudo))
            .header(
                HttpHeaders.CONTENT_DISPOSITION,
                "inline"
            )
            .header(
                "X-Content-Type-Options",
                "nosniff"
            )
            .cacheControl(
                CacheControl.noStore()
            )
            .body(recurso);
    }
}