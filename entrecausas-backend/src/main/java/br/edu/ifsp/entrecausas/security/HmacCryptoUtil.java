package br.edu.ifsp.entrecausas.security;

import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import java.nio.charset.StandardCharsets;
import java.util.HexFormat;

@Component
public class HmacCryptoUtil {

    private static final String ALGORITHM =
            "HmacSHA256";

    private static final int KEY_SIZE = 32;

    private final String secretKey;

    public HmacCryptoUtil(
            @Value("${app.security.hmac-key}") String secretKey) {

        this.secretKey = secretKey;
    }

    // Valida a chave ao iniciar a aplicação.
    @PostConstruct
    public void validarChave() {

        if (secretKey == null || secretKey.isBlank()) {
            throw new IllegalStateException(
                "A chave HMAC não foi configurada."
            );
        }

        byte[] chave =
            secretKey.getBytes(StandardCharsets.UTF_8);

        if (chave.length != KEY_SIZE) {
            throw new IllegalStateException(
                "A chave HMAC deve possuir exatamente 32 bytes."
            );
        }
    }

    // Gera o HMAC-SHA-256 do valor informado.
    public String gerarHash(String valor) {

        if (valor == null) {
            return null;
        }

        try {
            byte[] chave =
                secretKey.getBytes(StandardCharsets.UTF_8);

            SecretKeySpec keySpec =
                new SecretKeySpec(
                    chave,
                    ALGORITHM
                );

            Mac mac =
                Mac.getInstance(ALGORITHM);

            mac.init(keySpec);

            byte[] hash =
                mac.doFinal(
                    valor.getBytes(StandardCharsets.UTF_8)
                );

            // Retorna 64 caracteres hexadecimais.
            return HexFormat.of().formatHex(hash);

        } catch (Exception e) {

            throw new IllegalStateException(
                "Erro ao gerar hash HMAC.",
                e
            );
        }
    }
}