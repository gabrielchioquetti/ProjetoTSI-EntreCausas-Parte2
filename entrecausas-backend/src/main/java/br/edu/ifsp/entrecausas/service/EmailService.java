package br.edu.ifsp.entrecausas.service;

import br.edu.ifsp.entrecausas.dto.SolicitacaoPostagemDTO;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final String emailRemetente;

    // Injeta o JavaMailSender e o valor do properties diretamente no construtor
    public EmailService(
            JavaMailSender mailSender,
            @Value("${spring.mail.username}") String emailRemetente) {
        this.mailSender = mailSender;
        this.emailRemetente = emailRemetente;
    }

    public void enviarEmailModeracao(SolicitacaoPostagemDTO dto) {
        SimpleMailMessage message = new SimpleMailMessage();
        
        // Define tanto o remetente quanto o destinatário
        message.setFrom(emailRemetente);
        message.setTo(emailRemetente);
        message.setSubject("Nova Solicitação de Publicação: " + dto.titulo());

        String nomeOng = (dto.nomeOrganizacaoManual() != null && !dto.nomeOrganizacaoManual().isBlank())
                ? dto.nomeOrganizacaoManual() + " (Nova / Não cadastrada)"
                : "ONG ID #" + dto.organizacaoId();

        StringBuilder corpo = new StringBuilder();
        corpo.append("Uma nova publicação foi enviada para moderação!\n\n");
        corpo.append("Organização: ").append(nomeOng).append("\n");
        corpo.append("E-mail de Contato: ").append(dto.emailContato()).append("\n");
        corpo.append("Título: ").append(dto.titulo()).append("\n");
        corpo.append("Categoria: ").append(dto.categoria()).append("\n");
        corpo.append("Localização: ").append(dto.localizacao()).append("\n\n");
        corpo.append("Descrição:\n").append(dto.descricao()).append("\n\n");
        
        if (dto.imagensUrls() != null && !dto.imagensUrls().isEmpty()) {
            corpo.append("Imagens enviadas:\n");
            dto.imagensUrls().forEach(url -> corpo.append("- ").append(url).append("\n"));
        }

        message.setText(corpo.toString());
        mailSender.send(message);
    }
}