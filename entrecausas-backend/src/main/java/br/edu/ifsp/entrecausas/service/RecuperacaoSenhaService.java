package br.edu.ifsp.entrecausas.service;

import br.edu.ifsp.entrecausas.dto.RedefinirSenhaDTO;
import br.edu.ifsp.entrecausas.dto.SolicitarRecuperacaoSenhaDTO;
import br.edu.ifsp.entrecausas.dto.ValidarCodigoRecuperacaoDTO;
import br.edu.ifsp.entrecausas.entity.RecuperacaoSenha;
import br.edu.ifsp.entrecausas.entity.Usuario;
import br.edu.ifsp.entrecausas.repository.RecuperacaoSenhaRepository;
import br.edu.ifsp.entrecausas.repository.UsuarioRepository;

import org.springframework.security.core.session.SessionInformation;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Optional;

@Service
public class RecuperacaoSenhaService {

    private static final int DURACAO_CODIGO_MINUTOS = 10;
    private static final int DURACAO_AUTORIZACAO_MINUTOS = 10;
    private static final int INTERVALO_SOLICITACAO_SEGUNDOS = 60;
    private static final int MAXIMO_TENTATIVAS = 5;

    private static final String MENSAGEM_CODIGO_INVALIDO =
            "Código inválido ou expirado.";

    private static final String MENSAGEM_AUTORIZACAO_INVALIDA =
            "Autorização inválida ou expirada.";

    private final UsuarioRepository usuarioRepository;
    private final RecuperacaoSenhaRepository recuperacaoRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final SessionRegistry sessionRegistry;

    private final SecureRandom secureRandom = new SecureRandom();

    public RecuperacaoSenhaService(
            UsuarioRepository usuarioRepository,
            RecuperacaoSenhaRepository recuperacaoRepository,
            EmailService emailService,
            PasswordEncoder passwordEncoder,
            SessionRegistry sessionRegistry
    ) {
        this.usuarioRepository = usuarioRepository;
        this.recuperacaoRepository = recuperacaoRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
        this.sessionRegistry = sessionRegistry;
    }

    // Solicita o envio de um código de recuperação.
    @Transactional
    public void solicitar(SolicitarRecuperacaoSenhaDTO dto) {

        String email = dto.email().trim();

        Optional<Usuario> usuarioOptional =
                usuarioRepository.findByEmail(email);

        // Não revela se o e-mail está cadastrado.
        if (usuarioOptional.isEmpty()) {
            return;
        }

        Usuario usuario = usuarioOptional.get();
        LocalDateTime agora = LocalDateTime.now();

        Optional<RecuperacaoSenha> ultimaRecuperacao =
                recuperacaoRepository
                        .findFirstByUsuarioIdUsuarioOrderByDataCriacaoDescIdRecuperacaoDesc(
                                usuario.getIdUsuario()
                        );

        // Evita solicitações repetidas em intervalos curtos.
        if (ultimaRecuperacao.isPresent()) {

            RecuperacaoSenha anterior = ultimaRecuperacao.get();

            LocalDateTime proximaSolicitacao =
                    anterior.getDataCriacao()
                            .plusSeconds(INTERVALO_SOLICITACAO_SEGUNDOS);

            if (agora.isBefore(proximaSolicitacao)) {
                return;
            }

            // Invalida a solicitação anterior.
            anterior.setUtilizado(true);
            recuperacaoRepository.save(anterior);
        }

        String codigo = gerarCodigo();

        RecuperacaoSenha recuperacao = new RecuperacaoSenha();

        recuperacao.setUsuario(usuario);
        recuperacao.setCodigoHash(
                passwordEncoder.encode(codigo)
        );
        recuperacao.setDataCriacao(agora);
        recuperacao.setDataExpiracao(
                agora.plusMinutes(DURACAO_CODIGO_MINUTOS)
        );
        recuperacao.setTentativas(0);
        recuperacao.setValidado(false);
        recuperacao.setUtilizado(false);

        recuperacaoRepository.save(recuperacao);

        boolean enviado = emailService.enviarCodigoRecuperacao(
                usuario.getNome(),
                usuario.getEmail(),
                codigo
        );

        // Desfaz o registro se o SMTP informar falha.
        if (!enviado) {
            throw new IllegalStateException(
                    "Não foi possível enviar o e-mail de recuperação."
            );
        }
    }

    // Valida o código e emite uma autorização temporária.
    @Transactional(noRollbackFor = CodigoInvalidoException.class)
    public String validar(ValidarCodigoRecuperacaoDTO dto) {

        Usuario usuario = usuarioRepository
                .findByEmail(dto.email().trim())
                .orElseThrow(this::codigoInvalido);

        RecuperacaoSenha recuperacao = buscarRecuperacaoBloqueada(
                usuario.getIdUsuario()
        );

        LocalDateTime agora = LocalDateTime.now();

        if (recuperacao.isUtilizado()
                || recuperacao.isValidado()
                || !agora.isBefore(recuperacao.getDataExpiracao())
                || recuperacao.getTentativas() >= MAXIMO_TENTATIVAS) {

            throw codigoInvalido();
        }

        if (!passwordEncoder.matches(
                dto.codigo(),
                recuperacao.getCodigoHash()
        )) {

            recuperacao.setTentativas(
                    recuperacao.getTentativas() + 1
            );

            recuperacaoRepository.save(recuperacao);

            throw codigoInvalido();
        }

        String autorizacao = gerarAutorizacao();

        recuperacao.setValidado(true);
        recuperacao.setAutorizacaoHash(
                calcularHashAutorizacao(autorizacao)
        );
        recuperacao.setAutorizacaoExpiracao(
                agora.plusMinutes(DURACAO_AUTORIZACAO_MINUTOS)
        );

        recuperacaoRepository.save(recuperacao);

        return autorizacao;
    }

    // Redefine a senha mediante autorização válida.
    @Transactional
    public void redefinir(RedefinirSenhaDTO dto) {

        if (!dto.novaSenha().equals(dto.confirmarSenha())) {
            throw new IllegalArgumentException(
                    "A confirmação da senha não corresponde à nova senha."
            );
        }

        String hashAutorizacao =
                calcularHashAutorizacao(dto.autorizacao());

        RecuperacaoSenha recuperacao =
                recuperacaoRepository
                        .findByAutorizacaoHash(hashAutorizacao)
                        .orElseThrow(this::autorizacaoInvalida);

        // Bloqueia o registro para impedir reutilização simultânea.
        recuperacao = recuperacaoRepository
                .buscarParaAtualizacao(
                        recuperacao.getIdRecuperacao()
                )
                .orElseThrow(this::autorizacaoInvalida);

        LocalDateTime agora = LocalDateTime.now();

        if (recuperacao.isUtilizado()
                || !recuperacao.isValidado()
                || recuperacao.getAutorizacaoExpiracao() == null
                || !agora.isBefore(
                        recuperacao.getAutorizacaoExpiracao()
                )
                || !hashAutorizacao.equals(
                        recuperacao.getAutorizacaoHash()
                )) {

            throw autorizacaoInvalida();
        }

        Usuario usuario = recuperacao.getUsuario();

        usuario.setSenha(
                passwordEncoder.encode(dto.novaSenha())
        );

        usuarioRepository.save(usuario);

        recuperacao.setUtilizado(true);
        recuperacao.setAutorizacaoHash(null);
        recuperacao.setAutorizacaoExpiracao(null);

        recuperacaoRepository.save(recuperacao);

        // Expira as sessões somente após confirmar
        // a alteração da senha no banco.
        String emailUsuario = usuario.getEmail();

        TransactionSynchronizationManager.registerSynchronization(
                new TransactionSynchronization() {

                    @Override
                    public void afterCommit() {
                        expirarSessoesUsuario(emailUsuario);
                    }
                }
        );
    }

    // Marca todas as sessões do usuário como expiradas.
    private void expirarSessoesUsuario(String email) {

        for (SessionInformation sessao :
                sessionRegistry.getAllSessions(email, false)) {

            sessao.expireNow();
        }
    }

    // Consulta e bloqueia a solicitação mais recente.
    private RecuperacaoSenha buscarRecuperacaoBloqueada(
            Long idUsuario
    ) {

        RecuperacaoSenha ultima = recuperacaoRepository
                .findFirstByUsuarioIdUsuarioOrderByDataCriacaoDescIdRecuperacaoDesc(
                        idUsuario
                )
                .orElseThrow(this::codigoInvalido);

        return recuperacaoRepository
                .buscarParaAtualizacao(
                        ultima.getIdRecuperacao()
                )
                .orElseThrow(this::codigoInvalido);
    }

    // Gera um código numérico de cinco dígitos.
    private String gerarCodigo() {

        int numero = secureRandom.nextInt(100000);

        return String.format("%05d", numero);
    }

    // Gera uma autorização aleatória de 256 bits.
    private String gerarAutorizacao() {

        byte[] bytes = new byte[32];

        secureRandom.nextBytes(bytes);

        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(bytes);
    }

    // Armazena somente o SHA-256 da autorização aleatória.
    private String calcularHashAutorizacao(String autorizacao) {

        try {

            MessageDigest digest =
                    MessageDigest.getInstance("SHA-256");

            byte[] hash = digest.digest(
                    autorizacao.getBytes(StandardCharsets.UTF_8)
            );

            return HexFormat.of().formatHex(hash);

        } catch (NoSuchAlgorithmException erro) {

            throw new IllegalStateException(
                    "Não foi possível processar a autorização.",
                    erro
            );
        }
    }

    private CodigoInvalidoException codigoInvalido() {

        return new CodigoInvalidoException(
                MENSAGEM_CODIGO_INVALIDO
        );
    }

    private IllegalArgumentException autorizacaoInvalida() {

        return new IllegalArgumentException(
                MENSAGEM_AUTORIZACAO_INVALIDA
        );
    }

    // Permite registrar tentativas inválidas sem desfazer a transação.
    public static class CodigoInvalidoException
            extends RuntimeException {

        public CodigoInvalidoException(String mensagem) {
            super(mensagem);
        }
    }
}