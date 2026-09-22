package br.edu.ifsp.entrecausas.controller;

import br.edu.ifsp.entrecausas.dto.PostagemRequestDTO;
import br.edu.ifsp.entrecausas.dto.PostagemResponseDTO;
import br.edu.ifsp.entrecausas.dto.SolicitacaoPostagemDTO;
import br.edu.ifsp.entrecausas.service.EmailService;
import br.edu.ifsp.entrecausas.service.PostagemService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/postagens")
public class PostagemController {

    private final PostagemService postagemService;
    private final EmailService emailService;

    // Injeção de todas as dependências no construtor
    public PostagemController(PostagemService postagemService, EmailService emailService) {
        this.postagemService = postagemService;
        this.emailService = emailService;
    }

    @GetMapping
    public List<PostagemResponseDTO> listarTodas() {
        return postagemService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostagemResponseDTO> buscarPorId(@PathVariable Integer id) {
        return postagemService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<PostagemResponseDTO> salvar(@RequestBody PostagemRequestDTO dto) {
        PostagemResponseDTO salva = postagemService.salvar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(salva);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PostagemResponseDTO> atualizar(@PathVariable Integer id, @RequestBody PostagemRequestDTO dto) {
        PostagemResponseDTO atualizada = postagemService.atualizar(id, dto);

        if (atualizada != null) {
            return ResponseEntity.ok(atualizada);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Integer id) {
        postagemService.excluir(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/solicitar")
    public ResponseEntity<?> solicitarPublicacao(@RequestBody SolicitacaoPostagemDTO dto) {
        try {
            emailService.enviarEmailModeracao(dto);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace(); // Imprime o erro completo com o motivo no terminal
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro no envio de e-mail: " + e.getMessage());
        }
    }
}