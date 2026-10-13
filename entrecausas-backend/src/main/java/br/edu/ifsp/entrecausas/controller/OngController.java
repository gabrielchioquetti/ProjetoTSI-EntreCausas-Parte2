
package br.edu.ifsp.entrecausas.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;

import br.edu.ifsp.entrecausas.dto.OngRequestDTO;
import br.edu.ifsp.entrecausas.dto.OngResponseDTO;
import br.edu.ifsp.entrecausas.service.OngService;

@RestController
@RequestMapping("/api/ongs")
public class OngController {

    private final OngService ongService;

    // Construtor único para injeção de dependência.
    public OngController(OngService ongService) {
        this.ongService = ongService;
    }

    // Cadastra uma ONG com todos os dados do formulário.
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<OngResponseDTO> cadastrar(
            Authentication autenticacao,
            @RequestParam("nome") String nome,
            @RequestParam("cnpj") String cnpj,
            @RequestParam("telefone") String telefone,
            @RequestParam(value = "instagram", required = false)
                String instagram,
            @RequestParam("descricaoCurta") String descricaoCurta,
            @RequestParam("descricaoCompleta") String descricaoCompleta,
            @RequestParam("categorias") List<Long> categorias,
            @RequestParam("cep") String cep,
            @RequestParam("logradouro") String logradouro,
            @RequestParam("numero") String numero,
            @RequestParam(value = "complemento", required = false)
                String complemento,
            @RequestParam("bairro") String bairro,
            @RequestParam("cidade") String cidade,
            @RequestParam("estado") String estado,
            @RequestParam("imagens") List<MultipartFile> imagens) {

        // Impede o cadastro sem uma sessão autenticada.
        if (autenticacao == null
                || !autenticacao.isAuthenticated()
                || autenticacao instanceof AnonymousAuthenticationToken) {

            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .build();
        }

        // O serviço identifica o usuário pelo e-mail da sessão.
        OngResponseDTO response = ongService.cadastrar(
            autenticacao.getName(),
            nome,
            cnpj,
            telefone,
            instagram,
            descricaoCurta,
            descricaoCompleta,
            categorias,
            cep,
            logradouro,
            numero,
            complemento,
            bairro,
            cidade,
            estado,
            imagens
        );

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(response);
    }

    // Lista todas as ONGs cadastradas.
    @GetMapping
    public ResponseEntity<List<OngResponseDTO>> listar() {
        return ResponseEntity.ok(ongService.listarTodas());
    }

    // Busca uma ONG pelo ID.
    @GetMapping("/{id}")
    public ResponseEntity<OngResponseDTO> buscarPorId(
            @PathVariable Long id) {

        return ResponseEntity.ok(ongService.buscarPorId(id));
    }

    // Atualiza os dados de uma ONG.
    @PutMapping("/{id}")
    public ResponseEntity<OngResponseDTO> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody OngRequestDTO dto) {

        OngResponseDTO response = ongService.atualizar(id, dto);

        return ResponseEntity.ok(response);
    }

    // Remove uma ONG pelo ID.
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        ongService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
