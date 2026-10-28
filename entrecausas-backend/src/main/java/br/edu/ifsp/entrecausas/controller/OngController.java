package br.edu.ifsp.entrecausas.controller;

import br.edu.ifsp.entrecausas.dto.OngDetalhesAdminResponseDTO;
import br.edu.ifsp.entrecausas.dto.OngMinhaResponseDTO;
import br.edu.ifsp.entrecausas.dto.OngRequestDTO;
import br.edu.ifsp.entrecausas.dto.OngResponseDTO;
import br.edu.ifsp.entrecausas.service.OngService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/ongs")
public class OngController {

    private final OngService ongService;

    // Injeção de dependência realizada pelo construtor.
    public OngController(OngService ongService) {
        this.ongService = ongService;
    }

    // Cadastra uma ONG com os dados das três etapas.
    @PostMapping
    public ResponseEntity<OngResponseDTO> cadastrar(
            Authentication authentication,
            @RequestParam String nome,
            @RequestParam String cnpj,
            @RequestParam String telefone,
            @RequestParam(required = false) String instagram,
            @RequestParam String descricaoCurta,
            @RequestParam String descricaoCompleta,
            @RequestParam List<Long> categorias,
            @RequestParam String cep,
            @RequestParam String logradouro,
            @RequestParam String numero,
            @RequestParam(required = false) String complemento,
            @RequestParam String bairro,
            @RequestParam String cidade,
            @RequestParam String estado,
            @RequestParam List<MultipartFile> imagens) {

        // Identifica o usuário autenticado.
        if (authentication == null
                || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.status(401).build();
        }

        OngResponseDTO ong = ongService.cadastrar(
                authentication.getName(),
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

        return ResponseEntity.ok(ong);
    }

    // Lista todas as ONGs cadastradas.
    @GetMapping
    public ResponseEntity<List<OngResponseDTO>> listarTodas() {
        return ResponseEntity.ok(ongService.listarTodas());
    }

    // Consulta os detalhes completos para análise administrativa.
    @GetMapping("/admin/{id}/detalhes")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<OngDetalhesAdminResponseDTO> buscarDetalhesAdmin(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                ongService.buscarDetalhesAdmin(id)
        );
    }

    // Consulta a ONG pertencente ao usuário autenticado.
    @GetMapping("/minha")
    public ResponseEntity<OngMinhaResponseDTO> buscarMinhaOng(
            Authentication authentication) {

        // Exige uma sessão autenticada.
        if (authentication == null
                || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.status(401).build();
        }

        // Busca somente a ONG vinculada ao usuário.
        return ongService.buscarMinhaOng(authentication.getName())
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.noContent().build());
    }

    // Busca uma ONG pelo identificador.
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

        return ResponseEntity.ok(
                ongService.atualizar(id, dto)
        );
    }

    // Remove uma ONG cadastrada.
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(
            @PathVariable Long id) {

        ongService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}