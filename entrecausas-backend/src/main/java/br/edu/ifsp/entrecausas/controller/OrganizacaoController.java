package br.edu.ifsp.entrecausas.controller;

import br.edu.ifsp.entrecausas.dto.OrganizacaoRequestDTO;
import br.edu.ifsp.entrecausas.dto.OrganizacaoResponseDTO;
import br.edu.ifsp.entrecausas.service.OrganizacaoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/organizacoes")
public class OrganizacaoController {

    private final OrganizacaoService organizacaoService;

    public OrganizacaoController(OrganizacaoService organizacaoService) {
        this.organizacaoService = organizacaoService;
    }

    @GetMapping
    public List<OrganizacaoResponseDTO> listarTodas() {
        return organizacaoService.listarTodas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrganizacaoResponseDTO> buscarPorId(@PathVariable Integer id) {
        return organizacaoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<OrganizacaoResponseDTO> salvar(@RequestBody OrganizacaoRequestDTO dto) {
        OrganizacaoResponseDTO salva = organizacaoService.salvar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(salva);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrganizacaoResponseDTO> atualizar(@PathVariable Integer id, @RequestBody OrganizacaoRequestDTO dto) {
        OrganizacaoResponseDTO atualizada = organizacaoService.atualizar(id, dto);

        if (atualizada != null) {
            return ResponseEntity.ok(atualizada);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Integer id) {
        organizacaoService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}