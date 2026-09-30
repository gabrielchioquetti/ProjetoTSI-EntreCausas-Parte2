package br.edu.ifsp.entrecausas.security;

import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;

@Component
public class AesCryptoUtil {

    // Algoritmo utilizado para criptografia.
    private static final String ALGORITHM = "AES";

    // AES-GCM fornece confidencialidade e integridade.
    private static final String TRANSFORMATION =
            "AES/GCM/NoPadding";

    // Tamanho do IV utilizado pelo GCM.
    private static final int IV_SIZE = 12;

    // Tamanho da tag de autenticação.
    private static final int TAG_SIZE = 128;

    // Tamanho obrigatório da chave AES-256.
    private static final int KEY_SIZE = 32;

    // Chave configurada no application.properties.
    private final String secretKey;

    // Gerador seguro para criar IVs aleatórios.
    private final SecureRandom secureRandom;

    public AesCryptoUtil(
            @Value("${app.security.aes-key}") String secretKey) {

        this.secretKey = secretKey;
        this.secureRandom = new SecureRandom();
    }

    // Valida a chave quando o Spring inicializa o componente.
    @PostConstruct
    public void validarChave() {

        if (secretKey == null || secretKey.isBlank()) {
            throw new IllegalStateException(
                "A chave AES não foi configurada."
            );
        }

        byte[] chave =
            secretKey.getBytes(StandardCharsets.UTF_8);

        if (chave.length != KEY_SIZE) {
            throw new IllegalStateException(
                "A chave AES deve possuir exatamente 32 bytes."
            );
        }
    }

    // Criptografa um texto utilizando AES-256-GCM.
    public String encrypt(String value) {

        if (value == null) {
            return null;
        }

        try {
            // Cria um IV novo para cada criptografia.
            byte[] iv = new byte[IV_SIZE];
            secureRandom.nextBytes(iv);

            SecretKeySpec keySpec =
                new SecretKeySpec(
                    secretKey.getBytes(StandardCharsets.UTF_8),
                    ALGORITHM
                );

            GCMParameterSpec gcmSpec =
                new GCMParameterSpec(TAG_SIZE, iv);

            Cipher cipher =
                Cipher.getInstance(TRANSFORMATION);

            cipher.init(
                Cipher.ENCRYPT_MODE,
                keySpec,
                gcmSpec
            );

            byte[] encrypted =
                cipher.doFinal(
                    value.getBytes(StandardCharsets.UTF_8)
                );

            // Junta IV + conteúdo criptografado.
            byte[] resultado =
                new byte[IV_SIZE + encrypted.length];

            System.arraycopy(
                iv,
                0,
                resultado,
                0,
                IV_SIZE
            );

            System.arraycopy(
                encrypted,
                0,
                resultado,
                IV_SIZE,
                encrypted.length
            );

            // Base64 facilita o armazenamento no banco.
            return Base64.getEncoder()
                    .encodeToString(resultado);

        } catch (Exception e) {

            throw new IllegalStateException(
                "Erro ao criptografar dado sensível.",
                e
            );
        }
    }

    // Descriptografa um valor protegido por AES-256-GCM.
    public String decrypt(String encryptedValue) {

        if (encryptedValue == null) {
            return null;
        }

        try {
            byte[] dados =
                Base64.getDecoder()
                    .decode(encryptedValue);

            // Verifica se existe espaço suficiente para o IV.
            if (dados.length <= IV_SIZE) {
                throw new IllegalArgumentException(
                    "Valor criptografado inválido."
                );
            }

            // Recupera o IV armazenado no início do valor.
            byte[] iv =
                new byte[IV_SIZE];

            System.arraycopy(
                dados,
                0,
                iv,
                0,
                IV_SIZE
            );

            // Recupera o conteúdo criptografado.
            byte[] encrypted =
                new byte[dados.length - IV_SIZE];

            System.arraycopy(
                dados,
                IV_SIZE,
                encrypted,
                0,
                encrypted.length
            );

            SecretKeySpec keySpec =
                new SecretKeySpec(
                    secretKey.getBytes(StandardCharsets.UTF_8),
                    ALGORITHM
                );

            GCMParameterSpec gcmSpec =
                new GCMParameterSpec(TAG_SIZE, iv);

            Cipher cipher =
                Cipher.getInstance(TRANSFORMATION);

            cipher.init(
                Cipher.DECRYPT_MODE,
                keySpec,
                gcmSpec
            );

            byte[] decrypted =
                cipher.doFinal(encrypted);

            return new String(
                decrypted,
                StandardCharsets.UTF_8
            );

        } catch (Exception e) {

            throw new IllegalStateException(
                "Erro ao descriptografar dado sensível.",
                e
            );
        }
    }
}