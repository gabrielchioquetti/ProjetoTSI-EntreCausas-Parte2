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

            // Cria a tabela de auditoria.
            jdbcTemplate.execute("""
                CREATE TABLE IF NOT EXISTS auditoria_solicitacao (
                    id_auditoria BIGINT AUTO_INCREMENT PRIMARY KEY,
                    id_solicitacao BIGINT NOT NULL,
                    id_ong BIGINT NOT NULL,
                    id_usuario BIGINT NOT NULL,
                    id_administrador BIGINT,
                    evento VARCHAR(30) NOT NULL,
                    id_status_anterior BIGINT,
                    id_status_novo BIGINT NOT NULL,
                    motivo_rejeicao TEXT,
                    data_registro DATETIME NOT NULL
                        DEFAULT CURRENT_TIMESTAMP
                )
                """);

            // Cria a trigger de cadastro.
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
                        'CRIACAO',
                        NULL,
                        NEW.id_status,
                        NEW.motivo_rejeicao
                    )
                    """);
            }

            // Cria a trigger de análise.
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

    // Verifica se a trigger já foi criada.
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