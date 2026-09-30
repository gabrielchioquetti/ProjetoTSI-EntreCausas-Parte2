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

import br.edu.ifsp.entrecausas.dto.OngRequestDTO;
import br.edu.ifsp.entrecausas.dto.OngResponseDTO;
import br.edu.ifsp.entrecausas.service.OngService;

@RestController
@RequestMapping("/api/ongs")
public class OngController {

    private final OngService ongService;

    // Construtor único para injeção de dependência.
    public OngController(OngService ongService) {
        this.ongService = ongService;
    }

    // Cadastra uma nova ONG.
    @PostMapping
    public ResponseEntity<OngResponseDTO> cadastrar(
            @Valid @RequestBody OngRequestDTO dto) {

        OngResponseDTO response = ongService.cadastrar(dto);

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(response);
    }

    // Lista todas as ONGs cadastradas.
    @GetMapping
    public ResponseEntity<List<OngResponseDTO>> listar() {

        return ResponseEntity.ok(
            ongService.listarTodas()
        );
    }

    // Busca uma ONG pelo ID.
    @GetMapping("/{id}")
    public ResponseEntity<OngResponseDTO> buscarPorId(
            @PathVariable Long id) {

        return ResponseEntity.ok(
            ongService.buscarPorId(id)
        );
    }

    // Atualiza os dados de uma ONG.
    @PutMapping("/{id}")
    public ResponseEntity<OngResponseDTO> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody OngRequestDTO dto) {

        OngResponseDTO response =
            ongService.atualizar(id, dto);

        return ResponseEntity.ok(response);
    }

    // Remove uma ONG pelo ID.
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(
            @PathVariable Long id) {

        ongService.deletar(id);

        return ResponseEntity.noContent().build();
    }
}