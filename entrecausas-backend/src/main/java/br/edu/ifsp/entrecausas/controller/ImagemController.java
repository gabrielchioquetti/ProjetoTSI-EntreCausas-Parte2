package br.edu.ifsp.entrecausas.controller;

import br.edu.ifsp.entrecausas.dto.ImagemRequestDTO;
import br.edu.ifsp.entrecausas.dto.ImagemResponseDTO;
import br.edu.ifsp.entrecausas.service.ImagemService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/imagens")
public class ImagemController {

    private final ImagemService imagemService;

    public ImagemController(ImagemService imagemService) {
        this.imagemService = imagemService;
    }

    @GetMapping
    public List<ImagemResponseDTO> listarTodas() {
        return imagemService.listarTodas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ImagemResponseDTO> buscarPorId(@PathVariable Integer id) {
        return imagemService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ImagemResponseDTO> salvar(@RequestBody ImagemRequestDTO dto) {
        ImagemResponseDTO salva = imagemService.salvar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(salva);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ImagemResponseDTO> atualizar(@PathVariable Integer id, @RequestBody ImagemRequestDTO dto) {
        ImagemResponseDTO atualizada = imagemService.atualizar(id, dto);

        if (atualizada != null) {
            return ResponseEntity.ok(atualizada);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Integer id) {
        imagemService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}