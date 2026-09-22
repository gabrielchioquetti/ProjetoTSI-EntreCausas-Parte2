package br.edu.ifsp.entrecausas.controller;

import br.edu.ifsp.entrecausas.dto.FuncaoRequestDTO;
import br.edu.ifsp.entrecausas.dto.FuncaoResponseDTO;
import br.edu.ifsp.entrecausas.service.FuncaoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/funcoes")
public class FuncaoController {

    private final FuncaoService funcaoService;

    public FuncaoController(FuncaoService funcaoService) {
        this.funcaoService = funcaoService;
    }

    @GetMapping
    public List<FuncaoResponseDTO> listarTodas() {
        return funcaoService.listarTodas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<FuncaoResponseDTO> buscarPorId(@PathVariable Integer id) {
        return funcaoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<FuncaoResponseDTO> salvar(@RequestBody FuncaoRequestDTO dto) {
        FuncaoResponseDTO salva = funcaoService.salvar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(salva);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FuncaoResponseDTO> atualizar(@PathVariable Integer id, @RequestBody FuncaoRequestDTO dto) {
        FuncaoResponseDTO atualizada = funcaoService.atualizar(id, dto);
        
        if (atualizada != null) {
            return ResponseEntity.ok(atualizada);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Integer id) {
        funcaoService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}