package br.edu.ifsp.entrecausas.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

import br.edu.ifsp.entrecausas.dto.SolicitacaoAnaliseDTO;
import br.edu.ifsp.entrecausas.dto.SolicitacaoComparacaoDTO;
import br.edu.ifsp.entrecausas.dto.SolicitacaoCriacaoDTO;
import br.edu.ifsp.entrecausas.dto.SolicitacaoResponseDTO;
import br.edu.ifsp.entrecausas.dto.StatusSolicitacaoResponseDTO;
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

    // Impede a criação direta de solicitações.
    // O cadastro e a edição de ONGs criam suas próprias solicitações.
    @PostMapping
    public ResponseEntity<SolicitacaoResponseDTO> criar(
            @Valid @RequestBody SolicitacaoCriacaoDTO dto) {

        return ResponseEntity
            .status(HttpStatus.FORBIDDEN)
            .build();
    }

    // Lista todas as solicitações.
    @GetMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<SolicitacaoResponseDTO>>
            listarTodas() {

        return ResponseEntity.ok(
            solicitacaoService.listarTodas()
        );
    }

    // Busca uma solicitação pelo ID.
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<SolicitacaoResponseDTO> buscarPorId(
            @PathVariable Long id) {

        return ResponseEntity.ok(
            solicitacaoService.buscarPorId(id)
        );
    }

    // Lista solicitações pelo status.
    @GetMapping("/status/{idStatus}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<SolicitacaoResponseDTO>>
            listarPorStatus(
                @PathVariable Long idStatus) {

        return ResponseEntity.ok(
            solicitacaoService.listarPorStatus(idStatus)
        );
    }

    // Lista os status disponíveis para análise.
    @GetMapping("/status-opcoes")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<StatusSolicitacaoResponseDTO>>
            listarStatus() {

        return ResponseEntity.ok(
            solicitacaoService.listarStatus()
        );
    }

    // Lista solicitações abertas por um usuário.
    @GetMapping("/usuario/{idUsuario}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<SolicitacaoResponseDTO>>
            listarPorUsuario(
                @PathVariable Long idUsuario) {

        return ResponseEntity.ok(
            solicitacaoService.listarPorUsuario(idUsuario)
        );
    }

    // Lista solicitações associadas a uma ONG.
    @GetMapping("/ong/{idOng}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<SolicitacaoResponseDTO>>
            listarPorOng(
                @PathVariable Long idOng) {

        return ResponseEntity.ok(
            solicitacaoService.listarPorOng(idOng)
        );
    }

    // Consulta os dados atuais e propostos de uma edição.
    @GetMapping("/{id}/comparacao")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<SolicitacaoComparacaoDTO> compararEdicao(
            @PathVariable Long id,
            Authentication authentication) {

        return ResponseEntity.ok(
            solicitacaoService.compararEdicao(
                id,
                authentication.getName()
            )
        );
    }

    // Aprova ou rejeita uma solicitação.
    @PutMapping("/{id}/analise")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<SolicitacaoResponseDTO> analisar(
            @PathVariable Long id,
            @Valid @RequestBody SolicitacaoAnaliseDTO dto,
            Authentication authentication) {

        SolicitacaoResponseDTO response =
            solicitacaoService.analisar(
                id,
                dto,
                authentication.getName()
            );

        return ResponseEntity.ok(response);
    }
}