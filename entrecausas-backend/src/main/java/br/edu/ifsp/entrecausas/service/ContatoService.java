package br.edu.ifsp.entrecausas.service;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.edu.ifsp.entrecausas.dto.ContatoRequestDTO;
import br.edu.ifsp.entrecausas.entity.Usuario;
import br.edu.ifsp.entrecausas.repository.UsuarioRepository;

@Service
public class ContatoService {

    private static final Logger log = LoggerFactory.getLogger(ContatoService.class);

    private static final int LIMITE_MENSAGENS = 3;
    private static final Duration JANELA_LIMITE = Duration.ofMinutes(10);

    private final UsuarioRepository usuarioRepository;
    private final EmailService emailService;

    // Registra as tentativas de envio por endereço IP.
    private final Map<String, Deque<Instant>> tentativasPorIp = new ConcurrentHashMap<>();

    public ContatoService(UsuarioRepository usuarioRepository, EmailService emailService) {

        this.usuarioRepository = usuarioRepository;
        this.emailService = emailService;
    }

    // Verifica e registra a tentativa de envio do endereço IP.
    public boolean permitirEnvio(String enderecoIp) {

        if (enderecoIp == null || enderecoIp.isBlank()) {
            return false;
        }

        String ip = enderecoIp.trim();
        Instant agora = Instant.now();
        Instant inicioJanela = agora.minus(JANELA_LIMITE);

        boolean[] permitido = { false };

        tentativasPorIp.compute(ip, (chave, tentativas) -> {

            if (tentativas == null) {
                tentativas = new ArrayDeque<>();
            }

            while (!tentativas.isEmpty()
                    && !tentativas.peekFirst().isAfter(inicioJanela)) {
                tentativas.removeFirst();
            }

            if (tentativas.size() >= LIMITE_MENSAGENS) {

                log.warn(
                        "Limite de mensagens do Fale Conosco excedido para um endereço IP.");

                return tentativas;
            }

            tentativas.addLast(agora);
            permitido[0] = true;

            return tentativas;
        });

        return permitido[0];
    }

    // Encaminha a mensagem ao MASTER e aos administradores ativos.
    @Transactional(readOnly = true)
    public boolean enviarMensagem(ContatoRequestDTO contato) {

        List<Usuario> destinatarios = usuarioRepository.findByAtivoTrueAndFuncaoNomeIn(
                List.of("MASTER", "ADMINISTRADOR"));

        if (destinatarios.isEmpty()) {
            log.error(
                    "Não existem destinatários ativos para o Fale Conosco.");
            return false;
        }

        String nome = contato.nome().trim();
        String email = contato.email().trim();
        String assunto = contato.assunto().trim();
        String mensagem = contato.mensagem().trim();

        String assuntoEmail = "Fale Conosco - EntreCausas: " + assunto;

        String corpoEmail = """
                Nova mensagem recebida pelo Fale Conosco do EntreCausas.

                Nome: %s
                E-mail para resposta: %s
                Assunto: %s

                Mensagem:
                %s

                ----------------------------------------
                Mensagem enviada pelo formulário de contato
                da plataforma EntreCausas.
                """.formatted(
                nome,
                email,
                assunto,
                mensagem);

        int enviados = 0;
        int falhas = 0;

        // Envia individualmente, sem expor os demais destinatários.
        for (Usuario destinatario : destinatarios) {

            boolean enviado = emailService.enviarEmail(
                    destinatario.getEmail(),
                    assuntoEmail,
                    corpoEmail);

            if (enviado) {
                enviados++;
            } else {
                falhas++;

                log.warn(
                        "Falha ao encaminhar mensagem de contato ao usuário ID {}.",
                        destinatario.getIdUsuario());
            }
        }

        log.info(
                "Fale Conosco processado. Envios realizados: {}. Falhas: {}.",
                enviados,
                falhas);

        // Considera sucesso somente quando todos recebem.
        return falhas == 0 && enviados > 0;
    }
}