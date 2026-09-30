package br.edu.ifsp.entrecausas.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.ifsp.entrecausas.dto.StatusSolicitacaoResponseDTO;
import br.edu.ifsp.entrecausas.service.StatusSolicitacaoService;

// Controller responsável pelos status das solicitações.
@RestController
@RequestMapping("/api/status-solicitacoes")
public class StatusSolicitacaoController {

    private final StatusSolicitacaoService statusSolicitacaoService;

    // Injeção de dependência via construtor.
    public StatusSolicitacaoController(StatusSolicitacaoService statusSolicitacaoService) {

        this.statusSolicitacaoService = statusSolicitacaoService;
    }

    // Lista todos os status disponíveis.
    @GetMapping
    public ResponseEntity<List<StatusSolicitacaoResponseDTO>> listarTodos() {

        return ResponseEntity.ok(statusSolicitacaoService.listarTodos());
    }

    // Busca um status pelo ID.
    @GetMapping("/{idStatus}")
    public ResponseEntity<StatusSolicitacaoResponseDTO> buscarPorId(@PathVariable Long idStatus) {

        return ResponseEntity.ok(
            statusSolicitacaoService.buscarPorId(idStatus)
        );
    }

    // Busca um status pelo nome.
    @GetMapping("/nome/{nome}")
    public ResponseEntity<StatusSolicitacaoResponseDTO> buscarPorNome(@PathVariable String nome){

        return ResponseEntity.ok(
            statusSolicitacaoService.buscarPorNome(nome)
        );
    }
}