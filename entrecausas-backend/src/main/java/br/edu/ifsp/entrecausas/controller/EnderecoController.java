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

import br.edu.ifsp.entrecausas.dto.EnderecoRequestDTO;
import br.edu.ifsp.entrecausas.dto.EnderecoResponseDTO;
import br.edu.ifsp.entrecausas.service.EnderecoService;

@RestController
@RequestMapping("/api/enderecos")
public class EnderecoController {

    private final EnderecoService enderecoService;

    // Injeção de dependência via construtor.
    public EnderecoController(
            EnderecoService enderecoService) {

        this.enderecoService = enderecoService;
    }

    // Endpoint POST: Cadastra um novo endereço.
    @PostMapping
    public ResponseEntity<EnderecoResponseDTO> cadastrar(
            @Valid @RequestBody EnderecoRequestDTO dto) {

        EnderecoResponseDTO response =
            enderecoService.cadastrar(dto);

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(response);
    }

    // Endpoint GET: Lista todos os endereços do sistema.
    @GetMapping
    public ResponseEntity<List<EnderecoResponseDTO>> listar() {

        return ResponseEntity.ok(
            enderecoService.listarTodos()
        );
    }

    // Endpoint GET: Busca um endereço por ID.
    @GetMapping("/{id}")
    public ResponseEntity<EnderecoResponseDTO> buscarPorId(
            @PathVariable Long id) {

        return ResponseEntity.ok(
            enderecoService.buscarPorId(id)
        );
    }

    // Endpoint GET: Busca o endereço de uma ONG.
    @GetMapping("/ong/{idOng}")
    public ResponseEntity<EnderecoResponseDTO> buscarPorOng(
            @PathVariable Long idOng) {

        return ResponseEntity.ok(
            enderecoService.buscarPorOng(idOng)
        );
    }

    // Endpoint PUT: Atualiza um endereço existente pelo ID.
    @PutMapping("/{id}")
    public ResponseEntity<EnderecoResponseDTO> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody EnderecoRequestDTO dto) {

        EnderecoResponseDTO response =
            enderecoService.atualizar(id, dto);

        return ResponseEntity.ok(response);
    }

    // Endpoint DELETE: Remove um endereço pelo ID.
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(
            @PathVariable Long id) {

        enderecoService.deletar(id);

        return ResponseEntity
            .noContent()
            .build();
    }
}