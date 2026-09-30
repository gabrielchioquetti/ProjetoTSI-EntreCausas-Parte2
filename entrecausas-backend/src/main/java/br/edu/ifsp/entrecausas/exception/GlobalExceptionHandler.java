package br.edu.ifsp.entrecausas.exception;

import org.springframework.dao.DataIntegrityViolationException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Trata erros de validação dos DTOs.
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>>
    tratarErroValidacao(
            MethodArgumentNotValidException ex) {

        Map<String, String> erros =
            new HashMap<>();

        ex.getBindingResult()
            .getFieldErrors()
            .forEach(erro ->
                erros.put(
                    erro.getField(),
                    erro.getDefaultMessage()
                )
            );

        return criarResposta(
            HttpStatus.BAD_REQUEST,
            "Erro de validação.",
            erros
        );
    }

    // Trata erros relacionados a arquivos.
    @ExceptionHandler(ArquivoException.class)
    public ResponseEntity<Map<String, Object>>
    tratarArquivo(ArquivoException ex) {

        return criarResposta(
            HttpStatus.BAD_REQUEST,
            ex.getMessage(),
            null
        );
    }

    // Trata arquivos que ultrapassam o limite.
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Map<String, Object>>
    tratarTamanhoExcedido(
            MaxUploadSizeExceededException ex) {

        return criarResposta(
            HttpStatus.BAD_REQUEST,
            "A imagem deve ter no máximo 5 MB.",
            null
        );
    }

    // Trata erros gerais do multipart.
    @ExceptionHandler(MultipartException.class)
    public ResponseEntity<Map<String, Object>>
    tratarErroMultipart(
            MultipartException ex) {

        return criarResposta(
            HttpStatus.BAD_REQUEST,
            "Não foi possível processar "
            + "o arquivo enviado.",
            null
        );
    }

    // Trata erros de regra de negócio.
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>>
    tratarErroNegocio(
            IllegalArgumentException ex) {

        return criarResposta(
            HttpStatus.BAD_REQUEST,
            ex.getMessage(),
            null
        );
    }

    // Trata recursos não encontrados.
    @ExceptionHandler(
        RecursoNaoEncontradoException.class
    )
    public ResponseEntity<Map<String, Object>>
    tratarRecursoNaoEncontrado(
            RecursoNaoEncontradoException ex) {

        return criarResposta(
            HttpStatus.NOT_FOUND,
            ex.getMessage(),
            null
        );
    }

    // Trata conflitos de dados.
    @ExceptionHandler(ConflitoException.class)
    public ResponseEntity<Map<String, Object>>
    tratarConflito(
            ConflitoException ex) {

        return criarResposta(
            HttpStatus.CONFLICT,
            ex.getMessage(),
            null
        );
    }

    // Trata violações de restrições do banco.
    @ExceptionHandler(
        DataIntegrityViolationException.class
    )
    public ResponseEntity<Map<String, Object>>
    tratarViolacaoBanco(
            DataIntegrityViolationException ex) {

        return criarResposta(
            HttpStatus.CONFLICT,
            "Não foi possível salvar os dados. "
            + "Verifique se algum dado já está cadastrado.",
            null
        );
    }

    // Trata erros inesperados.
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>>
    tratarErroInterno(Exception ex) {

        return criarResposta(
            HttpStatus.INTERNAL_SERVER_ERROR,
            "Ocorreu um erro interno no servidor.",
            null
        );
    }

    // Monta o padrão de resposta da API.
    private ResponseEntity<Map<String, Object>>
    criarResposta(
            HttpStatus status,
            String mensagem,
            Object detalhes) {

        Map<String, Object> resposta =
            new HashMap<>();

        resposta.put(
            "timestamp",
            LocalDateTime.now()
        );

        resposta.put(
            "status",
            status.value()
        );

        resposta.put(
            "erro",
            status.getReasonPhrase()
        );

        resposta.put(
            "mensagem",
            mensagem
        );

        if (detalhes != null) {
            resposta.put(
                "detalhes",
                detalhes
            );
        }

        return ResponseEntity
            .status(status)
            .body(resposta);
    }
}