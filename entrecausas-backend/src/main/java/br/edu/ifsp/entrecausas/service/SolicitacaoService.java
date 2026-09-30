package br.edu.ifsp.entrecausas.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.edu.ifsp.entrecausas.dto.SolicitacaoAnaliseDTO;
import br.edu.ifsp.entrecausas.dto.SolicitacaoCriacaoDTO;
import br.edu.ifsp.entrecausas.dto.SolicitacaoResponseDTO;
import br.edu.ifsp.entrecausas.entity.Ong;
import br.edu.ifsp.entrecausas.entity.Solicitacao;
import br.edu.ifsp.entrecausas.entity.StatusSolicitacao;
import br.edu.ifsp.entrecausas.entity.Usuario;
import br.edu.ifsp.entrecausas.exception.ConflitoException;
import br.edu.ifsp.entrecausas.exception.RecursoNaoEncontradoException;
import br.edu.ifsp.entrecausas.repository.OngRepository;
import br.edu.ifsp.entrecausas.repository.SolicitacaoRepository;
import br.edu.ifsp.entrecausas.repository.StatusSolicitacaoRepository;
import br.edu.ifsp.entrecausas.repository.UsuarioRepository;

// Camada de serviço responsável pelo fluxo
// de moderação e análise de solicitações.
@Service
public class SolicitacaoService {

    private final SolicitacaoRepository solicitacaoRepository;
    private final OngRepository ongRepository;
    private final UsuarioRepository usuarioRepository;
    private final StatusSolicitacaoRepository statusSolicitacaoRepository;

    // Injeção de dependências via construtor.
    public SolicitacaoService(
            SolicitacaoRepository solicitacaoRepository,
            OngRepository ongRepository,
            UsuarioRepository usuarioRepository,
            StatusSolicitacaoRepository statusSolicitacaoRepository) {

        this.solicitacaoRepository = solicitacaoRepository;
        this.ongRepository = ongRepository;
        this.usuarioRepository = usuarioRepository;
        this.statusSolicitacaoRepository =
            statusSolicitacaoRepository;
    }

    // Registra uma nova solicitação.
    @Transactional
    public SolicitacaoResponseDTO criar(
            SolicitacaoCriacaoDTO dto) {

        // Verifica se a ONG existe.
        Ong ong = buscarOng(dto.idOng());

        // Verifica se o usuário existe.
        Usuario usuario = buscarUsuario(dto.idUsuario());

        // Busca o status inicial PENDENTE.
        StatusSolicitacao statusPendente =
            buscarStatusPorNome("PENDENTE");

        // Cria a solicitação com status pendente.
        Solicitacao solicitacao =
            new Solicitacao(
                ong,
                usuario,
                statusPendente
            );

        Solicitacao salva =
            solicitacaoRepository.save(solicitacao);

        return converterParaDTO(salva);
    }

    // Processa a análise da solicitação.
    // O administrador pode aprovar ou rejeitar.
    @Transactional
    public SolicitacaoResponseDTO analisar(
            Long idSolicitacao,
            SolicitacaoAnaliseDTO dto) {

        // Busca a solicitação.
        Solicitacao solicitacao =
            buscarSolicitacao(idSolicitacao);

        // A solicitação só pode ser analisada uma vez.
        validarSolicitacaoPendente(solicitacao);

        // Busca o administrador.
        Usuario administrador =
            buscarUsuario(dto.idAdministrador());

        // Verifica se o usuário é administrador.
        validarAdministrador(administrador);

        // Busca o novo status.
        StatusSolicitacao novoStatus =
            buscarStatus(dto.idStatus());

        String nomeStatus =
            novoStatus.getNome().toUpperCase();

        // A análise só aceita APROVADO ou REJEITADO.
        if (!nomeStatus.equals("APROVADO")
                && !nomeStatus.equals("REJEITADO")) {

            throw new ConflitoException(
                "A análise deve resultar em "
                + "APROVADO ou REJEITADO."
            );
        }

        // Valida o motivo conforme o resultado.
        validarMotivoRejeicao(
            nomeStatus,
            dto.motivoRejeicao()
        );

        // Registra o administrador responsável.
        solicitacao.setAdministrador(administrador);

        // Atualiza o status.
        solicitacao.setStatus(novoStatus);

        // Registra a data da análise.
        solicitacao.setDataAnalise(
            LocalDateTime.now()
        );

        // O motivo só é armazenado quando houver rejeição.
        if (nomeStatus.equals("REJEITADO")) {
            solicitacao.setMotivoRejeicao(
                dto.motivoRejeicao().trim()
            );
        } else {
            solicitacao.setMotivoRejeicao(null);
        }

        Solicitacao atualizada =
            solicitacaoRepository.save(solicitacao);

        return converterParaDTO(atualizada);
    }

    // Lista todas as solicitações.
    @Transactional(readOnly = true)
    public List<SolicitacaoResponseDTO> listarTodas() {

        return solicitacaoRepository.findAll()
            .stream()
            .map(this::converterParaDTO)
            .collect(Collectors.toList());
    }

    // Busca uma solicitação pelo ID.
    @Transactional(readOnly = true)
    public SolicitacaoResponseDTO buscarPorId(
            Long id) {

        Solicitacao solicitacao =
            buscarSolicitacao(id);

        return converterParaDTO(solicitacao);
    }

    // Lista solicitações pelo status.
    @Transactional(readOnly = true)
    public List<SolicitacaoResponseDTO> listarPorStatus(
            Long idStatus) {

        // Verifica se o status existe.
        buscarStatus(idStatus);

        return solicitacaoRepository
            .findByStatusIdStatus(idStatus)
            .stream()
            .map(this::converterParaDTO)
            .collect(Collectors.toList());
    }

    // Lista solicitações abertas por um usuário.
    @Transactional(readOnly = true)
    public List<SolicitacaoResponseDTO> listarPorUsuario(
            Long idUsuario) {

        // Verifica se o usuário existe.
        buscarUsuario(idUsuario);

        return solicitacaoRepository
            .findByUsuarioIdUsuario(idUsuario)
            .stream()
            .map(this::converterParaDTO)
            .collect(Collectors.toList());
    }

    // Lista solicitações associadas a uma ONG.
    @Transactional(readOnly = true)
    public List<SolicitacaoResponseDTO> listarPorOng(
            Long idOng) {

        // Verifica se a ONG existe.
        buscarOng(idOng);

        return solicitacaoRepository
            .findByOngIdOng(idOng)
            .stream()
            .map(this::converterParaDTO)
            .collect(Collectors.toList());
    }

    // Busca uma ONG ou lança uma exceção 404.
    private Ong buscarOng(Long idOng) {

        return ongRepository.findById(idOng)
            .orElseThrow(() ->
                new RecursoNaoEncontradoException(
                    "ONG não encontrada com o ID: "
                    + idOng
                )
            );
    }

    // Busca um usuário ou lança uma exceção 404.
    private Usuario buscarUsuario(Long idUsuario) {

        return usuarioRepository.findById(idUsuario)
            .orElseThrow(() ->
                new RecursoNaoEncontradoException(
                    "Usuário não encontrado com o ID: "
                    + idUsuario
                )
            );
    }

    // Busca uma solicitação ou lança uma exceção 404.
    private Solicitacao buscarSolicitacao(
            Long idSolicitacao) {

        return solicitacaoRepository
            .findById(idSolicitacao)
            .orElseThrow(() ->
                new RecursoNaoEncontradoException(
                    "Solicitação não encontrada com o ID: "
                    + idSolicitacao
                )
            );
    }

    // Busca um status pelo ID.
    private StatusSolicitacao buscarStatus(
            Long idStatus) {

        return statusSolicitacaoRepository
            .findById(idStatus)
            .orElseThrow(() ->
                new RecursoNaoEncontradoException(
                    "Status não encontrado com o ID: "
                    + idStatus
                )
            );
    }

    // Busca um status pelo nome.
    private StatusSolicitacao buscarStatusPorNome(
            String nome) {

        return statusSolicitacaoRepository
            .findByNome(nome)
            .orElseThrow(() ->
                new RecursoNaoEncontradoException(
                    "Status '" + nome
                    + "' não encontrado no sistema."
                )
            );
    }

    // Garante que a solicitação ainda está pendente.
    private void validarSolicitacaoPendente(
            Solicitacao solicitacao) {

        String status =
            solicitacao.getStatus()
                .getNome()
                .toUpperCase();

        if (!status.equals("PENDENTE")) {
            throw new ConflitoException(
                "Esta solicitação já foi analisada."
            );
        }
    }

    // Verifica se o usuário possui função de administrador.
    private void validarAdministrador(
            Usuario administrador) {

        if (administrador.getFuncao() == null
                || administrador.getFuncao().getNome() == null
                || !administrador.getFuncao()
                    .getNome()
                    .equalsIgnoreCase("ADMINISTRADOR")) {

            throw new ConflitoException(
                "O usuário informado não possui "
                + "permissão de administrador."
            );
        }
    }

    // Valida o motivo conforme o status escolhido.
    private void validarMotivoRejeicao(
            String nomeStatus,
            String motivoRejeicao) {

        if (nomeStatus.equals("REJEITADO")
                && (motivoRejeicao == null
                || motivoRejeicao.isBlank())) {

            throw new ConflitoException(
                "O motivo da rejeição é obrigatório."
            );
        }

        if (nomeStatus.equals("APROVADO")
                && motivoRejeicao != null
                && !motivoRejeicao.isBlank()) {

            throw new ConflitoException(
                "O motivo da rejeição não deve "
                + "ser informado ao aprovar."
            );
        }
    }

    // Converte a entidade para o DTO de resposta.
    private SolicitacaoResponseDTO converterParaDTO(
            Solicitacao solicitacao) {

        Usuario administrador =
            solicitacao.getAdministrador();

        Long idAdministrador =
            administrador != null
                ? administrador.getIdUsuario()
                : null;

        String nomeAdministrador =
            administrador != null
                ? administrador.getNome()
                : null;

        return new SolicitacaoResponseDTO(
            solicitacao.getIdSolicitacao(),

            solicitacao.getOng().getIdOng(),
            solicitacao.getOng().getNome(),

            solicitacao.getUsuario().getIdUsuario(),
            solicitacao.getUsuario().getNome(),

            idAdministrador,
            nomeAdministrador,

            solicitacao.getStatus().getIdStatus(),
            solicitacao.getStatus().getNome(),

            solicitacao.getDataAnalise(),
            solicitacao.getMotivoRejeicao()
        );
    }
}