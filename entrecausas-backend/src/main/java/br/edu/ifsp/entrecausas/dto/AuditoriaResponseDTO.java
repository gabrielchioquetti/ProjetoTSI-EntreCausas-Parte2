package br.edu.ifsp.entrecausas.dto;

import java.time.LocalDateTime;
import java.util.Map;

// Dados de auditoria enviados ao frontend.
public record AuditoriaResponseDTO(

                Long id,
                LocalDateTime dataHora,
                String operacao,
                String tabela,
                Long registroId,
                String tipoSolicitacao,
                String evento,
                String nomeOng,
                String acao,
                AtorDTO ator,
                Map<String, Object> dadosAnteriores,
                Map<String, Object> dadosNovos

) {
        // Identifica o responsável pelo evento.
        public record AtorDTO(
                        Long id,
                        String nome,
                        String perfil) {
        }
}