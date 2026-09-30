package br.edu.ifsp.entrecausas.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

import br.edu.ifsp.entrecausas.dto.DescricaoRequestDTO;
import br.edu.ifsp.entrecausas.dto.DescricaoResponseDTO;
import br.edu.ifsp.entrecausas.service.DescricaoService;

@RestController
@RequestMapping("/api/descricoes")
public class DescricaoController {

    private final DescricaoService descricaoService;

    // Injeção por construtor.
    public DescricaoController(
            DescricaoService descricaoService) {

        this.descricaoService = descricaoService;
    }

    // Endpoint POST: Cria uma nova descrição.
    @PostMapping
    public ResponseEntity<DescricaoResponseDTO> cadastrar(
            @Valid @RequestBody DescricaoRequestDTO dto) {

        DescricaoResponseDTO response =
            descricaoService.cadastrar(dto);

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(response);
    }

    // Endpoint GET: Retorna todas as descrições registradas.
    @GetMapping
    public ResponseEntity<List<DescricaoResponseDTO>> listar() {

        return ResponseEntity.ok(
            descricaoService.listarTodas()
        );
    }

    // Endpoint GET: Busca uma descrição por ID.
    @GetMapping("/{id}")
    public ResponseEntity<DescricaoResponseDTO> buscarPorId(
            @PathVariable Long id) {

        return ResponseEntity.ok(
            descricaoService.buscarPorId(id)
        );
    }

    // Endpoint GET: Retorna as descrições de uma ONG.
    @GetMapping("/ong/{idOng}")
    public ResponseEntity<List<DescricaoResponseDTO>> listarPorOng(
            @PathVariable Long idOng) {

        return ResponseEntity.ok(
            descricaoService.listarPorOng(idOng)
        );
    }

    // Endpoint PUT: Atualiza uma descrição existente.
    @PutMapping("/{id}")
    public ResponseEntity<DescricaoResponseDTO> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody DescricaoRequestDTO dto) {

        DescricaoResponseDTO response =
            descricaoService.atualizar(id, dto);

        return ResponseEntity.ok(response);
    }

    // Endpoint DELETE: Remove uma descrição.
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(
            @PathVariable Long id) {

        descricaoService.deletar(id);

        // Retorna HTTP 204 No Content.
        return ResponseEntity.noContent().build();
    }
}