package br.edu.ifsp.entrecausas.controller;

import br.edu.ifsp.entrecausas.dto.AlterarSenhaDTO;
import br.edu.ifsp.entrecausas.dto.UsuarioRequestDTO;
import br.edu.ifsp.entrecausas.dto.UsuarioResponseDTO;
import br.edu.ifsp.entrecausas.dto.UsuarioUpdateDTO;
import br.edu.ifsp.entrecausas.service.UsuarioService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    // Cadastra um novo usuário.
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UsuarioResponseDTO> cadastrar(
            @Valid @RequestPart("usuario") UsuarioRequestDTO dto,
            @RequestPart(value = "foto", required = false) MultipartFile foto) {

        UsuarioResponseDTO usuario = usuarioService.cadastrar(dto, foto);

        return ResponseEntity.status(HttpStatus.CREATED).body(usuario);
    }

    // Lista todos os usuários. Exclusivo do MASTER.
    @PreAuthorize("hasRole('MASTER')")
    @GetMapping
    public ResponseEntity<List<UsuarioResponseDTO>> listarTodos() {

        return ResponseEntity.ok(usuarioService.listarTodos());
    }

    // Busca um usuário pelo ID.
    // O serviço verifica se é o proprietário ou MASTER.
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> buscarPorId(
            @PathVariable Long id) {

        return ResponseEntity.ok(usuarioService.buscarPorId(id));
    }

    // Atualiza os dados do usuário autenticado.
    @PutMapping(
            value = "/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<UsuarioResponseDTO> atualizar(
            @PathVariable Long id,
            @Valid @RequestPart("usuario") UsuarioUpdateDTO dto,
            @RequestPart(value = "foto", required = false) MultipartFile foto) {

        // O serviço verifica se o usuário é o proprietário.
        // Se o e-mail mudar, as sessões serão expiradas após o commit.
        UsuarioResponseDTO usuarioAtualizado =
                usuarioService.atualizar(id, dto, foto);

        return ResponseEntity.ok(usuarioAtualizado);
    }

    // Altera a senha do próprio usuário.
    @PutMapping("/{id}/senha")
    public ResponseEntity<Void> alterarSenha(
            @PathVariable Long id,
            @Valid @RequestBody AlterarSenhaDTO dto) {

        usuarioService.alterarSenha(id, dto);

        return ResponseEntity.noContent().build();
    }

    // Promove um usuário comum a administrador.
    // Operação exclusiva do MASTER.
    @PreAuthorize("hasRole('MASTER')")
    @PutMapping("/{id}/promover")
    public ResponseEntity<UsuarioResponseDTO> promover(
            @PathVariable Long id) {

        UsuarioResponseDTO usuario =
                usuarioService.promoverParaAdministrador(id);

        return ResponseEntity.ok(usuario);
    }

    // Exclui a própria conta, exceto a conta MASTER.
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {

        usuarioService.deletar(id);

        return ResponseEntity.noContent().build();
    }
}