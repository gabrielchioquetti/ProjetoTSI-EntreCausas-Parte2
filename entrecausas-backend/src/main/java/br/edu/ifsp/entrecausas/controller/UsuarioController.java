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

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    // Injeta o serviço pelo construtor.
    public UsuarioController(
            UsuarioService usuarioService) {

        this.usuarioService = usuarioService;
    }

    // Cadastra um novo usuário.
    @PostMapping(
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<UsuarioResponseDTO> cadastrar(

            @RequestPart("usuario")
            @Valid UsuarioRequestDTO dto,

            @RequestPart(
                value = "foto",
                required = false
            )
            MultipartFile foto) {

        UsuarioResponseDTO response =
            usuarioService.cadastrar(
                dto,
                foto
            );

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(response);
    }

    // Lista todos os usuários.
    @GetMapping
    public ResponseEntity<List<UsuarioResponseDTO>> listar() {

        return ResponseEntity.ok(
            usuarioService.listarTodos()
        );
    }

    // Busca um usuário pelo ID.
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> buscarPorId(
            @PathVariable Long id) {

        return ResponseEntity.ok(
            usuarioService.buscarPorId(id)
        );
    }

    // Atualiza os dados do perfil.
    @PutMapping(
        value = "/{id}",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<UsuarioResponseDTO> atualizar(

            @PathVariable Long id,

            @RequestPart("usuario")
            @Valid UsuarioUpdateDTO dto,

            @RequestPart(
                value = "foto",
                required = false
            )
            MultipartFile foto) {

        UsuarioResponseDTO response =
            usuarioService.atualizar(
                id,
                dto,
                foto
            );

        return ResponseEntity.ok(response);
    }

    // Altera a senha do usuário.
    @PutMapping(
        value = "/{id}/senha",
        consumes = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<Void> alterarSenha(

            @PathVariable Long id,

            @RequestBody
            @Valid AlterarSenhaDTO dto) {

        usuarioService.alterarSenha(
            id,
            dto
        );

        return ResponseEntity
            .noContent()
            .build();
    }

    // Remove um usuário.
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(
            @PathVariable Long id) {

        usuarioService.deletar(id);

        return ResponseEntity
            .noContent()
            .build();
    }
}