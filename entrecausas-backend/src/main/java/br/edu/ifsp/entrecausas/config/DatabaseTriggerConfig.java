package br.edu.ifsp.entrecausas.config;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class DatabaseTriggerConfig {

    @Bean
    public ApplicationRunner configurarAuditoria(JdbcTemplate jdbcTemplate) {
        return args -> {

            // Registra a criação de uma solicitação.
            if (!triggerExiste(jdbcTemplate, "trg_solicitacao_insert")) {
                jdbcTemplate.execute("""
                    CREATE TRIGGER trg_solicitacao_insert
                    AFTER INSERT ON solicitacao
                    FOR EACH ROW
                    INSERT INTO auditoria_solicitacao (
                        id_solicitacao,
                        id_ong,
                        id_usuario,
                        id_administrador,
                        tipo_solicitacao,
                        evento,
                        id_status_anterior,
                        id_status_novo,
                        motivo_rejeicao
                    )
                    VALUES (
                        NEW.id_solicitacao,
                        NEW.id_ong,
                        NEW.id_usuario,
                        NEW.id_administrador,
                        COALESCE(NEW.tipo_solicitacao, 'CADASTRO'),
                        'CRIACAO',
                        NULL,
                        NEW.id_status,
                        NEW.motivo_rejeicao
                    )
                """);
            }

            // Registra alterações no status de uma solicitação.
            if (!triggerExiste(jdbcTemplate, "trg_solicitacao_update")) {
                jdbcTemplate.execute("""
                    CREATE TRIGGER trg_solicitacao_update
                    AFTER UPDATE ON solicitacao
                    FOR EACH ROW
                    BEGIN
                        IF NOT (OLD.id_status <=> NEW.id_status) THEN
                            INSERT INTO auditoria_solicitacao (
                                id_solicitacao,
                                id_ong,
                                id_usuario,
                                id_administrador,
                                tipo_solicitacao,
                                evento,
                                id_status_anterior,
                                id_status_novo,
                                motivo_rejeicao
                            )
                            VALUES (
                                NEW.id_solicitacao,
                                NEW.id_ong,
                                NEW.id_usuario,
                                NEW.id_administrador,
                                COALESCE(NEW.tipo_solicitacao, 'CADASTRO'),
                                'ALTERACAO_STATUS',
                                OLD.id_status,
                                NEW.id_status,
                                NEW.motivo_rejeicao
                            );
                        END IF;
                    END
                """);
            }
        };
    }

    // Verifica se a trigger já existe no banco de dados.
    private boolean triggerExiste(
            JdbcTemplate jdbcTemplate,
            String nomeTrigger) {

        Integer quantidade = jdbcTemplate.queryForObject("""
            SELECT COUNT(*)
            FROM information_schema.TRIGGERS
            WHERE TRIGGER_SCHEMA = DATABASE()
              AND TRIGGER_NAME = ?
        """, Integer.class, nomeTrigger);

        return quantidade != null && quantidade > 0;
    }
}