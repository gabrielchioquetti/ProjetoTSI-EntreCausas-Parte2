package br.edu.ifsp.entrecausas.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.ifsp.entrecausas.dto.RedefinirSenhaDTO;
import br.edu.ifsp.entrecausas.dto.SolicitarRecuperacaoSenhaDTO;
import br.edu.ifsp.entrecausas.dto.ValidarCodigoRecuperacaoDTO;
import br.edu.ifsp.entrecausas.service.RecuperacaoSenhaService;
import br.edu.ifsp.entrecausas.service.RecuperacaoSenhaService.CodigoInvalidoException;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/recuperacao-senha")
public class RecuperacaoSenhaController {

        private final RecuperacaoSenhaService recuperacaoSenhaService;

        public RecuperacaoSenhaController(
                        RecuperacaoSenhaService recuperacaoSenhaService) {
                this.recuperacaoSenhaService = recuperacaoSenhaService;
        }

        // Solicita o envio do código de recuperação.
        @PostMapping("/solicitar")
        public ResponseEntity<Map<String, String>> solicitar(
                        @Valid @RequestBody SolicitarRecuperacaoSenhaDTO dto) {
                recuperacaoSenhaService.solicitar(dto);

                return ResponseEntity.ok(Map.of(
                                "mensagem",
                                "Se o e-mail estiver cadastrado, você receberá um código de recuperação."));
        }

        // Valida o código recebido por e-mail.
        @PostMapping("/validar")
        public ResponseEntity<Map<String, String>> validar(
                        @Valid @RequestBody ValidarCodigoRecuperacaoDTO dto) {
                String autorizacao = recuperacaoSenhaService.validar(dto);

                return ResponseEntity.ok(Map.of(
                                "mensagem", "Código validado com sucesso.",
                                "autorizacao", autorizacao));
        }

        // Redefine a senha mediante autorização válida.
        @PostMapping("/redefinir")
        public ResponseEntity<Map<String, String>> redefinir(
                        @Valid @RequestBody RedefinirSenhaDTO dto) {
                recuperacaoSenhaService.redefinir(dto);

                return ResponseEntity.ok(Map.of(
                                "mensagem", "Senha redefinida com sucesso."));
        }

        // Responde de forma padronizada a códigos inválidos.
        @ExceptionHandler(CodigoInvalidoException.class)
        public ResponseEntity<Map<String, String>> tratarCodigoInvalido(
                        CodigoInvalidoException erro) {
                return ResponseEntity
                                .status(HttpStatus.BAD_REQUEST)
                                .body(Map.of("mensagem", erro.getMessage()));
        }

        // Responde a dados ou autorizações inválidas.
        @ExceptionHandler(IllegalArgumentException.class)
        public ResponseEntity<Map<String, String>> tratarArgumentoInvalido(IllegalArgumentException erro) {
                return ResponseEntity
                                .status(HttpStatus.BAD_REQUEST)
                                .body(Map.of("mensagem", erro.getMessage()));
        }
}