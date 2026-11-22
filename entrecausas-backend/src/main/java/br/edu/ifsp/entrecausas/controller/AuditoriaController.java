package br.edu.ifsp.entrecausas.controller;

import java.time.LocalDate;

import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.edu.ifsp.entrecausas.dto.AuditoriaResponseDTO;
import br.edu.ifsp.entrecausas.service.AuditoriaService;

// Endpoints para consulta do histórico de auditoria.
@RestController
@RequestMapping("/api/auditoria")
@PreAuthorize("hasRole('MASTER')")
public class AuditoriaController {

        private final AuditoriaService auditoriaService;

        public AuditoriaController(
                        AuditoriaService auditoriaService) {

                this.auditoriaService = auditoriaService;
        }

        // Lista os registros com paginação e filtros opcionais.
        @GetMapping
        public ResponseEntity<Page<AuditoriaResponseDTO>> listar(
                        @RequestParam(defaultValue = "0") int pagina,
                        @RequestParam(defaultValue = "6") int tamanho,

                        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicial,

                        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFinal,

                        @RequestParam(required = false) String operacao,

                        @RequestParam(required = false) String tabela) {

                return ResponseEntity.ok(
                                auditoriaService.listarFiltrado(
                                                dataInicial,
                                                dataFinal,
                                                operacao,
                                                tabela,
                                                pagina,
                                                tamanho));
        }

        // Consulta o histórico de uma solicitação.
        @GetMapping("/solicitacao/{id}")
        public ResponseEntity<Page<AuditoriaResponseDTO>> listarPorSolicitacao(
                        @PathVariable Long id,
                        @RequestParam(defaultValue = "0") int pagina,
                        @RequestParam(defaultValue = "6") int tamanho) {

                return ResponseEntity.ok(
                                auditoriaService.listarPorSolicitacao(
                                                id,
                                                pagina,
                                                tamanho));
        }

        // Consulta o histórico de uma ONG.
        @GetMapping("/ong/{id}")
        public ResponseEntity<Page<AuditoriaResponseDTO>> listarPorOng(
                        @PathVariable Long id,
                        @RequestParam(defaultValue = "0") int pagina,
                        @RequestParam(defaultValue = "6") int tamanho) {

                return ResponseEntity.ok(
                                auditoriaService.listarPorOng(
                                                id,
                                                pagina,
                                                tamanho));
        }

        // Consulta os registros por tipo de solicitação.
        @GetMapping("/tipo/{tipoSolicitacao}")
        public ResponseEntity<Page<AuditoriaResponseDTO>> listarPorTipo(
                        @PathVariable String tipoSolicitacao,
                        @RequestParam(defaultValue = "0") int pagina,
                        @RequestParam(defaultValue = "6") int tamanho) {

                return ResponseEntity.ok(
                                auditoriaService.listarPorTipo(
                                                tipoSolicitacao,
                                                pagina,
                                                tamanho));
        }
}