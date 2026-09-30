package br.edu.ifsp.entrecausas.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

import br.edu.ifsp.entrecausas.dto.SolicitacaoAnaliseDTO;
import br.edu.ifsp.entrecausas.dto.SolicitacaoCriacaoDTO;
import br.edu.ifsp.entrecausas.dto.SolicitacaoResponseDTO;
import br.edu.ifsp.entrecausas.service.SolicitacaoService;

// Controller responsável pelas solicitações de ONG.
@RestController
@RequestMapping("/api/solicitacoes")
public class SolicitacaoController {

    private final SolicitacaoService solicitacaoService;

    // Injeção de dependência via construtor.
    public SolicitacaoController(
            SolicitacaoService solicitacaoService) {

        this.solicitacaoService = solicitacaoService;
    }

    // Cria uma nova solicitação.
    @PostMapping
    public ResponseEntity<SolicitacaoResponseDTO> criar(
            @Valid @RequestBody SolicitacaoCriacaoDTO dto) {

        SolicitacaoResponseDTO response =
            solicitacaoService.criar(dto);

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(response);
    }

    // Lista todas as solicitações.
    @GetMapping
    public ResponseEntity<List<SolicitacaoResponseDTO>>
            listarTodas() {

        return ResponseEntity.ok(
            solicitacaoService.listarTodas()
        );
    }

    // Busca uma solicitação pelo ID.
    @GetMapping("/{id}")
    public ResponseEntity<SolicitacaoResponseDTO> buscarPorId(
            @PathVariable Long id) {

        return ResponseEntity.ok(
            solicitacaoService.buscarPorId(id)
        );
    }

    // Lista solicitações pelo status.
    @GetMapping("/status/{idStatus}")
    public ResponseEntity<List<SolicitacaoResponseDTO>>
            listarPorStatus(
                @PathVariable Long idStatus) {

        return ResponseEntity.ok(
            solicitacaoService.listarPorStatus(idStatus)
        );
    }

    // Lista solicitações abertas por um usuário.
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<SolicitacaoResponseDTO>>
            listarPorUsuario(
                @PathVariable Long idUsuario) {

        return ResponseEntity.ok(
            solicitacaoService.listarPorUsuario(
                idUsuario
            )
        );
    }

    // Lista solicitações associadas a uma ONG.
    @GetMapping("/ong/{idOng}")
    public ResponseEntity<List<SolicitacaoResponseDTO>>
            listarPorOng(
                @PathVariable Long idOng) {

        return ResponseEntity.ok(
            solicitacaoService.listarPorOng(idOng)
        );
    }

    // Aprova ou rejeita uma solicitação.
    @PutMapping("/{id}/analise")
    public ResponseEntity<SolicitacaoResponseDTO> analisar(
            @PathVariable Long id,
            @Valid @RequestBody SolicitacaoAnaliseDTO dto) {

        SolicitacaoResponseDTO response =
            solicitacaoService.analisar(id, dto);

        return ResponseEntity.ok(response);
    }
}