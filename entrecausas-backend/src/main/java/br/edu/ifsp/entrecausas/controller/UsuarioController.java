
package br.edu.ifsp.entrecausas.controller;

import br.edu.ifsp.entrecausas.dto.AlterarSenhaDTO;
import br.edu.ifsp.entrecausas.dto.UsuarioRequestDTO;
import br.edu.ifsp.entrecausas.dto.UsuarioResponseDTO;
import br.edu.ifsp.entrecausas.dto.UsuarioUpdateDTO;

import br.edu.ifsp.entrecausas.service.UsuarioService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;

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
    private final AuthController authController;

    public UsuarioController(
            UsuarioService usuarioService,
            AuthController authController) {

        this.usuarioService = usuarioService;
        this.authController = authController;
    }

    // Cadastra um novo usuário.
    @PostMapping(
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<UsuarioResponseDTO> cadastrar(
            @Valid @RequestPart("usuario")
            UsuarioRequestDTO dto,

            @RequestPart(
                value = "foto",
                required = false
            )
            MultipartFile foto) {

        UsuarioResponseDTO usuario =
            usuarioService.cadastrar(dto, foto);

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(usuario);
    }

    // Lista todos os usuários.
    @GetMapping
    public ResponseEntity<List<UsuarioResponseDTO>>
            listarTodos() {

        return ResponseEntity.ok(
            usuarioService.listarTodos()
        );
    }

    // Busca um usuário pelo ID.
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO>
            buscarPorId(@PathVariable Long id) {

        return ResponseEntity.ok(
            usuarioService.buscarPorId(id)
        );
    }

    // Atualiza os dados do usuário autenticado.
    @PutMapping(
        value = "/{id}",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<UsuarioResponseDTO> atualizar(
            @PathVariable Long id,

            @Valid @RequestPart("usuario")
            UsuarioUpdateDTO dto,

            @RequestPart(
                value = "foto",
                required = false
            )
            MultipartFile foto,

            Authentication autenticacao,

            HttpServletRequest request,
            HttpServletResponse response) {

        // O serviço verifica se o usuário é o proprietário.
        UsuarioResponseDTO usuarioAtualizado =
            usuarioService.atualizar(id, dto, foto);

        // Se o e-mail mudou, atualiza a autenticação.
        if (autenticacao != null
                && !autenticacao.getName().equals(
                    usuarioAtualizado.email())) {

            authController.atualizarAutenticacao(
                usuarioAtualizado,
                request,
                response
            );
        }

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

    // Exclui a própria conta.
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(
            @PathVariable Long id) {

        usuarioService.deletar(id);

        return ResponseEntity.noContent().build();
    }
}
