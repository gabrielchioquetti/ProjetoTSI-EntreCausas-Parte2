package br.edu.ifsp.entrecausas.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

import br.edu.ifsp.entrecausas.dto.OngCategoriaRequestDTO;
import br.edu.ifsp.entrecausas.dto.OngCategoriaResponseDTO;
import br.edu.ifsp.entrecausas.service.OngCategoriaService;

// Controller responsável pelas associações entre ONGs e categorias.
@RestController
@RequestMapping("/api/ong-categorias")
public class OngCategoriaController {

    private final OngCategoriaService ongCategoriaService;

    // Injeção de dependência via construtor.
    public OngCategoriaController(
            OngCategoriaService ongCategoriaService) {

        this.ongCategoriaService = ongCategoriaService;
    }

    // Associa uma categoria a uma ONG.
    @PostMapping
    public ResponseEntity<OngCategoriaResponseDTO> associar(
            @Valid @RequestBody OngCategoriaRequestDTO dto) {

        OngCategoriaResponseDTO response =
            ongCategoriaService.associar(dto);

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(response);
    }

    // Lista as categorias associadas a uma ONG.
    @GetMapping("/ong/{idOng}")
    public ResponseEntity<List<OngCategoriaResponseDTO>>
            listarPorOng(
                @PathVariable Long idOng) {

        return ResponseEntity.ok(
            ongCategoriaService.listarPorOng(idOng)
        );
    }

    // Lista as ONGs associadas a uma categoria.
    @GetMapping("/categoria/{idCategoria}")
    public ResponseEntity<List<OngCategoriaResponseDTO>>
            listarPorCategoria(
                @PathVariable Long idCategoria) {

        return ResponseEntity.ok(
            ongCategoriaService.listarPorCategoria(
                idCategoria
            )
        );
    }

    // Remove uma associação pelo ID do vínculo.
    @DeleteMapping("/{idOngCategoria}")
    public ResponseEntity<Void> desassociar(
            @PathVariable Long idOngCategoria) {

        ongCategoriaService.desassociar(
            idOngCategoria
        );

        return ResponseEntity
            .noContent()
            .build();
    }

    // Remove uma associação diretamente pela ONG e categoria.
    @DeleteMapping(
        "/ong/{idOng}/categoria/{idCategoria}"
    )
    public ResponseEntity<Void> desassociar(
            @PathVariable Long idOng,
            @PathVariable Long idCategoria) {

        ongCategoriaService.desassociar(
            idOng,
            idCategoria
        );

        return ResponseEntity
            .noContent()
            .build();
    }
}