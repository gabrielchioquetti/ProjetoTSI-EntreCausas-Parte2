package br.edu.ifsp.entrecausas.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import br.edu.ifsp.entrecausas.dto.ImagemResponseDTO;
import br.edu.ifsp.entrecausas.service.ImagemService;

@RestController
@RequestMapping("/api/imagens")
public class ImagemController {

    private final ImagemService imagemService;

    // Injeção de dependência via construtor.
    public ImagemController(
            ImagemService imagemService) {

        this.imagemService = imagemService;
    }

    // Upload de UMA imagem.
    @PostMapping(
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
        value = "/lote",
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
    @GetMapping
    public ResponseEntity<List<ImagemResponseDTO>>
            listarTodas() {

        return ResponseEntity.ok(
            imagemService.listarTodas()
        );
    }

    // Busca uma imagem pelo ID.
    @GetMapping("/{id}")
    public ResponseEntity<ImagemResponseDTO> buscarPorId(
            @PathVariable Long id) {

        return ResponseEntity.ok(
            imagemService.buscarPorId(id)
        );
    }

    // Lista as imagens de uma ONG.
    @GetMapping("/ong/{idOng}")
    public ResponseEntity<List<ImagemResponseDTO>>
            listarPorOng(
                @PathVariable Long idOng) {

        return ResponseEntity.ok(
            imagemService.listarPorOng(idOng)
        );
    }

    // Atualiza uma imagem com arquivo opcional.
    @PutMapping(
        value = "/{id}",
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
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(
            @PathVariable Long id) {

        imagemService.deletar(id);

        return ResponseEntity
            .noContent()
            .build();
    }
}