package br.edu.ifsp.entrecausas.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import br.edu.ifsp.entrecausas.dto.AlterarSenhaDTO;
import br.edu.ifsp.entrecausas.dto.ExcluirContaDTO;
import br.edu.ifsp.entrecausas.dto.UsuarioRequestDTO;
import br.edu.ifsp.entrecausas.dto.UsuarioResponseDTO;
import br.edu.ifsp.entrecausas.dto.UsuarioUpdateDTO;
import br.edu.ifsp.entrecausas.service.UsuarioService;
import jakarta.validation.Valid;

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
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UsuarioResponseDTO> atualizar(
            @PathVariable Long id,
            @Valid @RequestPart("usuario") UsuarioUpdateDTO dto,
            @RequestPart(value = "foto", required = false) MultipartFile foto) {

        // O serviço verifica se o usuário é o proprietário.
        // Se o e-mail mudar, as sessões serão expiradas após o commit.
        UsuarioResponseDTO usuarioAtualizado = usuarioService.atualizar(id, dto, foto);

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

        UsuarioResponseDTO usuario = usuarioService.promoverParaAdministrador(id);

        return ResponseEntity.ok(usuario);
    }

    // Rebaixa um administrador para usuário comum.
    // Operação exclusiva do MASTER.
    @PreAuthorize("hasRole('MASTER')")
    @PutMapping("/{id}/rebaixar")
    public ResponseEntity<UsuarioResponseDTO> rebaixar(@PathVariable Long id) {
        UsuarioResponseDTO usuario = usuarioService.rebaixarParaUsuario(id);
        return ResponseEntity.ok(usuario);
    }

    // Desativa e anonimiza a própria conta, exceto MASTER.
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(
            @PathVariable Long id,
            @Valid @RequestBody ExcluirContaDTO dto) {

        usuarioService.deletar(id, dto.senhaAtual());

        return ResponseEntity.noContent().build();
    }

}