package br.edu.ifsp.entrecausas.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
    private final JavaMailSender mailSender;
    private final String emailRemetente;

    public EmailService(JavaMailSender mailSender,
            @Value("${spring.mail.username}") String emailRemetente) {
        this.mailSender = mailSender;
        this.emailRemetente = emailRemetente;
    }

    // Envia uma mensagem de texto pelo Gmail.
    public boolean enviarEmail(String destinatario, String assunto, String mensagem) {

        if (destinatario == null || destinatario.isBlank()) {
            log.warn("Envio de e-mail ignorado: destinatário vazio.");
            return false;
        }

        try {
            SimpleMailMessage email = new SimpleMailMessage();

            email.setFrom(emailRemetente);
            email.setTo(destinatario.trim());
            email.setSubject(assunto);
            email.setText(mensagem);

            mailSender.send(email);

            return true;

        } catch (MailException erro) {
            log.error("Falha no envio de e-mail pelo serviço SMTP.", erro);
            return false;
        }
    }

    // Envia uma mensagem de boas-vindas ao usuário.
    public boolean enviarBoasVindas(String nomeUsuario, String emailUsuario) {

        String assunto = "Bem-vindo ao EntreCausas!";

        String mensagem = """
                Olá, %s!

                Seja bem-vindo ao EntreCausas!

                Sua conta foi cadastrada com sucesso.

                Agora você pode conhecer organizações,
                acompanhar suas atividades e participar
                da nossa comunidade.

                Atenciosamente,
                Equipe EntreCausas
                """.formatted(nomeUsuario);

        return enviarEmail(emailUsuario, assunto, mensagem);
    }

    // Confirma o recebimento de uma solicitação de ONG.
    public boolean enviarConfirmacaoSolicitacao(
            String nomeUsuario,
            String emailUsuario,
            String nomeOng,
            String tipoSolicitacao) {

        String assunto = "Solicitação recebida - EntreCausas";

        String mensagem = """
                Olá, %s!

                Recebemos sua solicitação referente à ONG %s.

                Tipo de solicitação: %s

                Sua solicitação está pendente de análise
                pela equipe administrativa.

                Você será informado quando houver
                uma decisão.

                Atenciosamente,
                Equipe EntreCausas
                """.formatted(
                nomeUsuario,
                nomeOng,
                descricaoTipo(tipoSolicitacao));

        return enviarEmail(emailUsuario, assunto, mensagem);
    }

    // Notifica um administrador sobre uma nova solicitação.
    public boolean enviarNovaSolicitacaoAdministrador(
            String emailAdministrador,
            String nomeOng,
            String tipoSolicitacao) {

        String assunto = "Nova solicitação pendente - EntreCausas";

        String mensagem = """
                Olá!

                Uma nova solicitação foi registrada no EntreCausas.

                ONG: %s
                Tipo: %s
                Status: Pendente

                Acesse o painel administrativo
                para analisar a solicitação.

                Atenciosamente,
                Sistema EntreCausas
                """.formatted(
                nomeOng,
                descricaoTipo(tipoSolicitacao));

        return enviarEmail(emailAdministrador, assunto, mensagem);
    }

    // Informa a aprovação de uma solicitação.
    public boolean enviarAprovacao(
            String nomeUsuario,
            String emailUsuario,
            String nomeOng,
            String tipoSolicitacao) {

        String assunto = "Solicitação aprovada - EntreCausas";

        String mensagem = """
                Olá, %s!

                Sua solicitação referente à ONG %s
                foi aprovada!

                Tipo de solicitação: %s

                A decisão já foi registrada no sistema.

                Atenciosamente,
                Equipe EntreCausas
                """.formatted(
                nomeUsuario,
                nomeOng,
                descricaoTipo(tipoSolicitacao));

        return enviarEmail(emailUsuario, assunto, mensagem);
    }

    // Informa a rejeição e sua justificativa.
    public boolean enviarRejeicao(
            String nomeUsuario,
            String emailUsuario,
            String nomeOng,
            String tipoSolicitacao,
            String motivoRejeicao) {

        String assunto = "Solicitação rejeitada - EntreCausas";

        String mensagem = """
                Olá, %s!

                Sua solicitação referente à ONG %s
                não foi aprovada.

                Tipo de solicitação: %s

                Motivo da rejeição:
                %s

                Acesse o EntreCausas para consultar
                a situação da sua organização.

                Atenciosamente,
                Equipe EntreCausas
                """.formatted(
                nomeUsuario,
                nomeOng,
                descricaoTipo(tipoSolicitacao),
                motivoRejeicao);

        return enviarEmail(emailUsuario, assunto, mensagem);
    }

    // Envia o código de recuperação de senha ao usuário.
    public boolean enviarCodigoRecuperacao(
            String nomeUsuario,
            String emailUsuario,
            String codigo) {
        String assunto = "EntreCausas - Recuperação de senha";

        String mensagem = """
                Olá, %s!

                Recebemos uma solicitação de recuperação de senha
                para sua conta no EntreCausas.

                Seu código de verificação é:

                %s

                Este código é válido por 10 minutos.

                Se você não solicitou a recuperação de senha,
                ignore este e-mail.

                Atenciosamente,
                Equipe EntreCausas
                """.formatted(nomeUsuario, codigo);

        return enviarEmail(emailUsuario, assunto, mensagem);
    }

    // Confirma a desativação e anonimização da conta.
    public boolean enviarConfirmacaoExclusaoConta(
            String nomeUsuario,
            String emailUsuario) {
        String assunto = "Conta excluída - EntreCausas";

        String mensagem = """
                Olá, %s!

                Confirmamos que sua conta no EntreCausas
                foi desativada conforme sua solicitação.

                O acesso à conta foi encerrado e os dados
                pessoais vinculados ao seu cadastro foram
                anonimizados no sistema.

                Agradecemos por ter participado
                da comunidade EntreCausas.

                Atenciosamente,
                Equipe EntreCausas
                """.formatted(nomeUsuario);

        return enviarEmail(emailUsuario, assunto, mensagem);
    }

    // Notifica a promoção de usuário para administrador.
    public boolean enviarPromocaoAdministrador(
            String nomeUsuario,
            String emailUsuario) {
        String assunto = "Promoção para administrador - EntreCausas";

        String mensagem = """
                Olá, %s!

                Informamos que sua conta no EntreCausas
                foi promovida pelo MASTER.

                Função anterior: USUARIO
                Nova função: ADMINISTRADOR

                Agora você possui acesso às funcionalidades
                administrativas autorizadas para sua função.

                Por segurança, suas sessões anteriores
                foram encerradas.

                Entre novamente no EntreCausas para
                utilizar suas novas permissões.

                Caso não reconheça essa alteração,
                entre em contato com nossa equipe.

                Atenciosamente,
                Equipe EntreCausas
                """.formatted(nomeUsuario);

        return enviarEmail(emailUsuario, assunto, mensagem);
    }

    // Notifica o rebaixamento de administrador para usuário.
    public boolean enviarRebaixamentoUsuario(
            String nomeUsuario,
            String emailUsuario) {
        String assunto = "Alteração de função - EntreCausas";

        String mensagem = """
                Olá, %s!

                Informamos que a função da sua conta
                no EntreCausas foi alterada pelo MASTER.

                Função anterior: ADMINISTRADOR
                Nova função: USUARIO

                Suas permissões administrativas foram removidas.

                Você poderá continuar utilizando as
                funcionalidades disponíveis para usuários comuns.

                Por segurança, suas sessões anteriores
                foram encerradas.

                Entre novamente no EntreCausas para
                continuar utilizando sua conta.

                Caso não reconheça essa alteração,
                entre em contato com nossa equipe.

                Atenciosamente,
                Equipe EntreCausas
                """.formatted(nomeUsuario);

        return enviarEmail(emailUsuario, assunto, mensagem);
    }

    // Converte o tipo técnico para uma descrição legível.
    private String descricaoTipo(String tipoSolicitacao) {

        if (tipoSolicitacao == null) {
            return "Cadastro de ONG";
        }

        return switch (tipoSolicitacao.toUpperCase()) {
            case "CADASTRO" -> "Cadastro de ONG";
            case "EDICAO" -> "Edição de ONG";
            case "EXCLUSAO" -> "Exclusão de ONG";
            default -> "Solicitação de ONG";
        };
    }
}