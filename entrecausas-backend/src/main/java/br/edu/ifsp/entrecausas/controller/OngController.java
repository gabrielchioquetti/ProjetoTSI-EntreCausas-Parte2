package br.edu.ifsp.entrecausas.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import br.edu.ifsp.entrecausas.dto.OngDetalhesAdminResponseDTO;
import br.edu.ifsp.entrecausas.dto.OngMinhaResponseDTO;
import br.edu.ifsp.entrecausas.dto.OngRequestDTO;
import br.edu.ifsp.entrecausas.dto.OngResponseDTO;
import br.edu.ifsp.entrecausas.dto.OngPublicaResponseDTO;
import br.edu.ifsp.entrecausas.service.OngService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/ongs")
public class OngController {

    private final OngService ongService;

    public OngController(OngService ongService) {
        this.ongService = ongService;
    }

    // Cadastra uma ONG e cria uma solicitação pendente.
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
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

        // Exige uma sessão autenticada.
        if (!autenticado(authentication)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
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

        return ResponseEntity.status(HttpStatus.CREATED).body(ong);
    }

    // Envia uma proposta de edição para análise administrativa.
    @PostMapping(
        value = "/{id}/solicitar-edicao",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<Long> solicitarEdicao(
            Authentication authentication,
            @PathVariable Long id,
            @RequestParam String nome,
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
            @RequestParam(required = false)
                List<Long> imagensMantidas,
            @RequestParam(required = false)
                List<MultipartFile> novasImagens,
            @RequestParam String senhaAtual) {

        // Exige uma sessão autenticada.
        if (!autenticado(authentication)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Long idSolicitacao = ongService.solicitarEdicao(
            id,
            authentication.getName(),
            nome,
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
            imagensMantidas,
            novasImagens,
            senhaAtual
        );

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(idSolicitacao);
    }

    // Lista somente as ONGs aprovadas.
    @GetMapping
    public ResponseEntity<List<OngPublicaResponseDTO>> listarTodas() {

        return ResponseEntity.ok(ongService.listarTodas());
    }

    // Consulta os dados completos para análise administrativa.
    @GetMapping("/admin/{id}/detalhes")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<OngDetalhesAdminResponseDTO> buscarDetalhesAdmin(
            @PathVariable Long id) {

        return ResponseEntity.ok(
            ongService.buscarDetalhesAdmin(id)
        );
    }

    // Busca a ONG pertencente ao usuário autenticado.
    @GetMapping("/minha")
    public ResponseEntity<OngMinhaResponseDTO> buscarMinhaOng(
            Authentication authentication) {

        if (!autenticado(authentication)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<OngMinhaResponseDTO> ong =
            ongService.buscarMinhaOng(authentication.getName());

        return ong.map(ResponseEntity::ok)
            .orElseGet(() ->
                ResponseEntity.noContent().build()
            );
    }

    // Busca uma ONG aprovada pelo identificador.
    @GetMapping("/{id}")
    public ResponseEntity<OngPublicaResponseDTO> buscarPorId(
            @PathVariable Long id) {

        return ResponseEntity.ok(
            ongService.buscarPorId(id)
        );
    }

    // Impede alterações diretas sem aprovação administrativa.
    @PutMapping("/{id}")
    public ResponseEntity<Void> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody OngRequestDTO dto) {

        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    // Impede a exclusão direta de ONGs.
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(
            @PathVariable Long id) {

        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    // Verifica se existe uma autenticação válida.
    private boolean autenticado(Authentication authentication) {

        return authentication != null
            && authentication.isAuthenticated()
            && !"anonymousUser".equals(
                authentication.getPrincipal()
            );
    }
}