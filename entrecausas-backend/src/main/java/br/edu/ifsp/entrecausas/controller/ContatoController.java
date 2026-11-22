package br.edu.ifsp.entrecausas.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.ifsp.entrecausas.dto.ContatoRequestDTO;
import br.edu.ifsp.entrecausas.service.ContatoService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/contato")
public class ContatoController {

        private final ContatoService contatoService;

        public ContatoController(ContatoService contatoService) {
                this.contatoService = contatoService;
        }

        // Recebe mensagens do Fale Conosco sem exigir autenticação.
        @PostMapping
        public ResponseEntity<Map<String, String>> enviarMensagem(
                        @Valid @RequestBody ContatoRequestDTO contato,
                        HttpServletRequest request) {

                // Identifica o endereço IP da conexão.
                String enderecoIp = request.getRemoteAddr();

                // Limita a quantidade de mensagens enviadas por IP.
                if (!contatoService.permitirEnvio(enderecoIp)) {
                        return ResponseEntity
                                        .status(HttpStatus.TOO_MANY_REQUESTS)
                                        .body(Map.of(
                                                        "mensagem",
                                                        "Você atingiu o limite de mensagens. "
                                                                        + "Aguarde alguns minutos antes de tentar novamente."));
                }

                boolean enviado = contatoService.enviarMensagem(contato);

                if (!enviado) {
                        return ResponseEntity
                                        .status(HttpStatus.SERVICE_UNAVAILABLE)
                                        .body(Map.of(
                                                        "mensagem",
                                                        "Não foi possível concluir o envio da mensagem. "
                                                                        + "Tente novamente mais tarde."));
                }

                return ResponseEntity.ok(Map.of(
                                "mensagem",
                                "Sua mensagem foi enviada com sucesso!"));
        }
}