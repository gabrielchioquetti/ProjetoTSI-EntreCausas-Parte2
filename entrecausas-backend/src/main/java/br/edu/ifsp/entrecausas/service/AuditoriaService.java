package br.edu.ifsp.entrecausas.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.edu.ifsp.entrecausas.dto.AuditoriaResponseDTO;
import br.edu.ifsp.entrecausas.entity.Auditoria;
import br.edu.ifsp.entrecausas.entity.Ong;
import br.edu.ifsp.entrecausas.entity.StatusSolicitacao;
import br.edu.ifsp.entrecausas.entity.Usuario;
import br.edu.ifsp.entrecausas.repository.AuditoriaRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

@Service
@Transactional(readOnly = true)
public class AuditoriaService {

    private final AuditoriaRepository auditoriaRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public AuditoriaService(
            AuditoriaRepository auditoriaRepository) {
        this.auditoriaRepository = auditoriaRepository;
    }

    // Lista os registros mais recentes.
    public Page<AuditoriaResponseDTO> listar(
            int pagina,
            int tamanho) {

        Pageable pageable = criarPaginacao(pagina, tamanho);

        return auditoriaRepository
                .findAllByOrderByDataRegistroDescIdAuditoriaDesc(pageable)
                .map(this::converterParaDTO);
    }

    // Consulta o histórico de uma solicitação.
    public Page<AuditoriaResponseDTO> listarPorSolicitacao(
            Long idSolicitacao,
            int pagina,
            int tamanho) {

        Pageable pageable = criarPaginacao(pagina, tamanho);

        return auditoriaRepository
                .findByIdSolicitacaoOrderByDataRegistroDescIdAuditoriaDesc(
                        idSolicitacao,
                        pageable
                )
                .map(this::converterParaDTO);
    }

    // Consulta o histórico de uma ONG.
    public Page<AuditoriaResponseDTO> listarPorOng(
            Long idOng,
            int pagina,
            int tamanho) {

        Pageable pageable = criarPaginacao(pagina, tamanho);

        return auditoriaRepository
                .findByIdOngOrderByDataRegistroDescIdAuditoriaDesc(
                        idOng,
                        pageable
                )
                .map(this::converterParaDTO);
    }

    // Consulta os registros por tipo de solicitação.
    public Page<AuditoriaResponseDTO> listarPorTipo(
            String tipoSolicitacao,
            int pagina,
            int tamanho) {

        Pageable pageable = criarPaginacao(pagina, tamanho);

        return auditoriaRepository
                .findByTipoSolicitacaoOrderByDataRegistroDescIdAuditoriaDesc(
                        tipoSolicitacao,
                        pageable
                )
                .map(this::converterParaDTO);
    }

    // Consulta o histórico aplicando os filtros da página.
    public Page<AuditoriaResponseDTO> listarFiltrado(
            LocalDate dataInicial,
            LocalDate dataFinal,
            String operacao,
            String tabela,
            int pagina,
            int tamanho) {

        Pageable pageable = criarPaginacao(pagina, tamanho);

        CriteriaBuilder cb = entityManager.getCriteriaBuilder();

        CriteriaQuery<Auditoria> consulta =
                cb.createQuery(Auditoria.class);

        Root<Auditoria> raiz = consulta.from(Auditoria.class);

        List<Predicate> filtros = criarFiltros(
                cb,
                raiz,
                dataInicial,
                dataFinal,
                operacao,
                tabela
        );

        consulta.select(raiz)
                .where(filtros.toArray(new Predicate[0]))
                .orderBy(
                        cb.desc(raiz.get("dataRegistro")),
                        cb.desc(raiz.get("idAuditoria"))
                );

        List<Auditoria> registros = entityManager
                .createQuery(consulta)
                .setFirstResult((int) pageable.getOffset())
                .setMaxResults(pageable.getPageSize())
                .getResultList();

        CriteriaQuery<Long> consultaTotal =
                cb.createQuery(Long.class);

        Root<Auditoria> raizTotal =
                consultaTotal.from(Auditoria.class);

        List<Predicate> filtrosTotal = criarFiltros(
                cb,
                raizTotal,
                dataInicial,
                dataFinal,
                operacao,
                tabela
        );

        consultaTotal.select(cb.count(raizTotal))
                .where(filtrosTotal.toArray(new Predicate[0]));

        Long total = entityManager
                .createQuery(consultaTotal)
                .getSingleResult();

        List<AuditoriaResponseDTO> conteudo = registros
                .stream()
                .map(this::converterParaDTO)
                .toList();

        return new PageImpl<>(conteudo, pageable, total);
    }

    // Monta os filtros aplicados diretamente no banco.
    private List<Predicate> criarFiltros(
            CriteriaBuilder cb,
            Root<Auditoria> raiz,
            LocalDate dataInicial,
            LocalDate dataFinal,
            String operacao,
            String tabela) {

        List<Predicate> filtros = new ArrayList<>();

        if (dataInicial != null) {
            filtros.add(
                    cb.greaterThanOrEqualTo(
                            raiz.get("dataRegistro"),
                            dataInicial.atStartOfDay()
                    )
            );
        }

        if (dataFinal != null) {
            filtros.add(
                    cb.lessThan(
                            raiz.get("dataRegistro"),
                            dataFinal.plusDays(1).atStartOfDay()
                    )
            );
        }

        if (operacao != null && !operacao.isBlank()) {
            switch (operacao.toUpperCase()) {
                case "INSERT" -> filtros.add(
                        cb.equal(raiz.get("evento"), "CRIACAO")
                );

                case "UPDATE" -> filtros.add(
                        cb.equal(
                                raiz.get("evento"),
                                "ALTERACAO_STATUS"
                        )
                );

                default -> filtros.add(cb.disjunction());
            }
        }

        // Atualmente somente a tabela solicitacao é auditada.
        if (tabela != null
                && !tabela.isBlank()
                && !"solicitacao".equalsIgnoreCase(tabela)) {
            filtros.add(cb.disjunction());
        }

        return filtros;
    }

    // Converte o registro do banco para a resposta da API.
    private AuditoriaResponseDTO converterParaDTO(
            Auditoria auditoria) {

        boolean criacao = "CRIACAO".equals(auditoria.getEvento());

        String operacao = criacao ? "INSERT" : "UPDATE";

        Ong ong = entityManager.find(
                Ong.class,
                auditoria.getIdOng()
        );

        String nomeOng = ong != null
                ? ong.getNome()
                : null;

        Long idResponsavel = criacao
                ? auditoria.getIdUsuario()
                : auditoria.getIdAdministrador();

        Usuario responsavel = idResponsavel != null
                ? entityManager.find(Usuario.class, idResponsavel)
                : null;

        String nomeResponsavel = responsavel != null
                ? responsavel.getNome()
                : null;

        String perfil = responsavel != null
                && responsavel.getFuncao() != null
                ? responsavel.getFuncao().getNome()
                : null;

        String statusAnterior = buscarStatus(
                auditoria.getIdStatusAnterior()
        );

        String statusNovo = buscarStatus(
                auditoria.getIdStatusNovo()
        );

        Map<String, Object> dadosAnteriores = null;

        if (!criacao) {
            dadosAnteriores = new LinkedHashMap<>();

            dadosAnteriores.put(
                    "status",
                    statusAnterior
            );

            dadosAnteriores.put(
                    "idStatus",
                    auditoria.getIdStatusAnterior()
            );
        }

        Map<String, Object> dadosNovos = new LinkedHashMap<>();

        dadosNovos.put("status", statusNovo);

        dadosNovos.put(
                "idStatus",
                auditoria.getIdStatusNovo()
        );

        dadosNovos.put(
                "tipoSolicitacao",
                auditoria.getTipoSolicitacao()
        );

        dadosNovos.put(
                "idOng",
                auditoria.getIdOng()
        );

        dadosNovos.put(
                "idAdministrador",
                auditoria.getIdAdministrador()
        );

        dadosNovos.put(
                "motivoRejeicao",
                auditoria.getMotivoRejeicao()
        );

        AuditoriaResponseDTO.AtorDTO ator =
                new AuditoriaResponseDTO.AtorDTO(
                        idResponsavel,
                        nomeResponsavel,
                        perfil
                );

        String acao = montarDescricao(
                auditoria,
                nomeOng,
                statusNovo
        );

        return new AuditoriaResponseDTO(
                auditoria.getIdAuditoria(),
                auditoria.getDataRegistro(),
                operacao,
                "solicitacao",
                auditoria.getIdSolicitacao(),
                auditoria.getTipoSolicitacao(),
                auditoria.getEvento(),
                nomeOng,
                acao,
                ator,
                dadosAnteriores,
                dadosNovos
        );
    }

    // Consulta o nome do status pelo identificador.
    private String buscarStatus(Long idStatus) {

        if (idStatus == null) {
            return null;
        }

        StatusSolicitacao status = entityManager.find(
                StatusSolicitacao.class,
                idStatus
        );

        return status != null ? status.getNome() : null;
    }

    // Monta uma descrição com os dados registrados.
    private String montarDescricao(
            Auditoria auditoria,
            String nomeOng,
            String statusNovo) {

        String tipo = auditoria.getTipoSolicitacao();

        String descricaoTipo = switch (
                tipo != null ? tipo : "CADASTRO") {

            case "EDICAO" -> "edição";
            case "EXCLUSAO" -> "exclusão";
            default -> "cadastro";
        };

        String organizacao = nomeOng != null
                ? nomeOng
                : "ONG #" + auditoria.getIdOng();

        if ("CRIACAO".equals(auditoria.getEvento())) {
            return "Solicitação de "
                    + descricaoTipo
                    + " registrada para "
                    + organizacao;
        }

        String novoStatus = statusNovo != null
                ? statusNovo
                : "ID " + auditoria.getIdStatusNovo();

        return "Status da solicitação de "
                + descricaoTipo
                + " de "
                + organizacao
                + " alterado para "
                + novoStatus;
    }

    // Define os limites da paginação.
    private Pageable criarPaginacao(
            int pagina,
            int tamanho) {

        int paginaValida = Math.max(0, pagina);
        int tamanhoValido = Math.min(100, Math.max(1, tamanho));

        return PageRequest.of(paginaValida, tamanhoValido);
    }
}