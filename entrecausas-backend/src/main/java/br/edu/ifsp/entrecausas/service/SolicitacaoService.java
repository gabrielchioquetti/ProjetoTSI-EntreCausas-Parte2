package br.edu.ifsp.entrecausas.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.web.server.ResponseStatusException;

import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;

import br.edu.ifsp.entrecausas.dto.OngEdicaoDadosDTO;
import br.edu.ifsp.entrecausas.dto.OngDetalhesAdminResponseDTO;
import br.edu.ifsp.entrecausas.dto.SolicitacaoAnaliseDTO;
import br.edu.ifsp.entrecausas.dto.SolicitacaoComparacaoDTO;
import br.edu.ifsp.entrecausas.dto.SolicitacaoCriacaoDTO;
import br.edu.ifsp.entrecausas.dto.SolicitacaoResponseDTO;
import br.edu.ifsp.entrecausas.dto.StatusSolicitacaoResponseDTO;

import br.edu.ifsp.entrecausas.entity.Categoria;
import br.edu.ifsp.entrecausas.entity.Descricao;
import br.edu.ifsp.entrecausas.entity.Endereco;
import br.edu.ifsp.entrecausas.entity.Imagem;
import br.edu.ifsp.entrecausas.entity.ImagemEdicaoPendente;
import br.edu.ifsp.entrecausas.entity.Ong;
import br.edu.ifsp.entrecausas.entity.OngCategoria;
import br.edu.ifsp.entrecausas.entity.OngEdicaoPendente;
import br.edu.ifsp.entrecausas.entity.Solicitacao;
import br.edu.ifsp.entrecausas.entity.StatusSolicitacao;
import br.edu.ifsp.entrecausas.entity.Usuario;

import br.edu.ifsp.entrecausas.exception.ConflitoException;
import br.edu.ifsp.entrecausas.exception.RecursoNaoEncontradoException;

import br.edu.ifsp.entrecausas.repository.CategoriaRepository;
import br.edu.ifsp.entrecausas.repository.ImagemEdicaoPendenteRepository;
import br.edu.ifsp.entrecausas.repository.OngEdicaoPendenteRepository;
import br.edu.ifsp.entrecausas.repository.OngRepository;
import br.edu.ifsp.entrecausas.repository.SolicitacaoRepository;
import br.edu.ifsp.entrecausas.repository.StatusSolicitacaoRepository;
import br.edu.ifsp.entrecausas.repository.UsuarioRepository;

import br.edu.ifsp.entrecausas.security.AesCryptoUtil;
import br.edu.ifsp.entrecausas.security.HmacCryptoUtil;

// Camada de serviço responsável pelo fluxo
// de moderação e análise de solicitações.
@Service
public class SolicitacaoService {

    private static final Logger log =
        LoggerFactory.getLogger(SolicitacaoService.class);

    private final SolicitacaoRepository solicitacaoRepository;
    private final OngRepository ongRepository;
    private final UsuarioRepository usuarioRepository;
    private final StatusSolicitacaoRepository statusSolicitacaoRepository;
    private final ImagemEdicaoPendenteRepository imagemEdicaoPendenteRepository;
    private final OngEdicaoPendenteRepository ongEdicaoPendenteRepository;
    private final CategoriaRepository categoriaRepository;

    private final AesCryptoUtil aesCryptoUtil;
    private final HmacCryptoUtil hmacCryptoUtil;
    private final FileStorageService fileStorageService;

    private final ObjectMapper objectMapper;
    private final EntityManager entityManager;
    private final OngService ongService;

    // Injeção de dependência via construtor.
    public SolicitacaoService(
            SolicitacaoRepository solicitacaoRepository,
            OngRepository ongRepository,
            UsuarioRepository usuarioRepository,
            StatusSolicitacaoRepository statusSolicitacaoRepository,
            OngEdicaoPendenteRepository ongEdicaoPendenteRepository,
            ImagemEdicaoPendenteRepository imagemEdicaoPendenteRepository,
            CategoriaRepository categoriaRepository,
            AesCryptoUtil aesCryptoUtil,
            HmacCryptoUtil hmacCryptoUtil,
            FileStorageService fileStorageService,
            ObjectMapper objectMapper,
            EntityManager entityManager,
            OngService ongService) {

        this.solicitacaoRepository = solicitacaoRepository;
        this.ongRepository = ongRepository;
        this.usuarioRepository = usuarioRepository;
        this.statusSolicitacaoRepository = statusSolicitacaoRepository;

        this.ongEdicaoPendenteRepository = ongEdicaoPendenteRepository;
        this.imagemEdicaoPendenteRepository = imagemEdicaoPendenteRepository;
        this.categoriaRepository = categoriaRepository;

        this.aesCryptoUtil = aesCryptoUtil;
        this.hmacCryptoUtil = hmacCryptoUtil;
        this.fileStorageService = fileStorageService;

        this.objectMapper = objectMapper;
        this.entityManager = entityManager;
        this.ongService = ongService;
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
        Solicitacao solicitacao = new Solicitacao(
            ong,
            usuario,
            statusPendente
        );

        solicitacao.setTipoSolicitacao("CADASTRO");

        Solicitacao salva =
            solicitacaoRepository.save(solicitacao);

        return converterParaDTO(salva);
    }

    // Processa a análise da solicitação.
    // O administrador é identificado pela sessão autenticada.
    @Transactional
    public SolicitacaoResponseDTO analisar(
            Long idSolicitacao,
            SolicitacaoAnaliseDTO dto,
            String emailAdministrador) {

        // Busca o usuário pela identidade autenticada.
        Usuario administrador =
            usuarioRepository.findByEmail(emailAdministrador)
                .orElseThrow(() ->
                    new RecursoNaoEncontradoException(
                        "Usuário autenticado não encontrado."
                    )
                );

        // Verifica se o usuário é administrador.
        validarAdministrador(administrador);

        // Busca a solicitação.
        Solicitacao solicitacao =
            buscarSolicitacao(idSolicitacao);

        // Bloqueia a ONG antes de analisar a solicitação.
        // Mantém a ordem de bloqueio utilizada na edição.
        Ong ong = entityManager.find(
            Ong.class,
            solicitacao.getOng().getIdOng(),
            LockModeType.PESSIMISTIC_WRITE
        );

        if (ong == null) {
            throw new RecursoNaoEncontradoException(
                "ONG vinculada à solicitação não encontrada."
            );
        }

        // Atualiza e bloqueia a solicitação durante a análise.
        entityManager.refresh(
            solicitacao,
            LockModeType.PESSIMISTIC_WRITE
        );

        // A solicitação só pode ser analisada uma vez.
        validarSolicitacaoPendente(solicitacao);

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

        // Identifica o tipo de solicitação.
        String tipoSolicitacao =
            solicitacao.getTipoSolicitacao();

        // Registros antigos sem tipo são tratados como cadastro.
        boolean edicao =
            "EDICAO".equalsIgnoreCase(tipoSolicitacao);

        if (edicao) {

            // Processa a proposta de edição.
            analisarEdicao(
                solicitacao,
                ong,
                nomeStatus
            );

        } else if (tipoSolicitacao != null
                && !tipoSolicitacao.equalsIgnoreCase("CADASTRO")) {

            throw new ConflitoException(
                "Tipo de solicitação não reconhecido."
            );
        }

        // Registra o administrador responsável.
        solicitacao.setAdministrador(administrador);

        // Atualiza o status.
        solicitacao.setStatus(novoStatus);

        // Registra a data da análise.
        solicitacao.setDataAnalise(LocalDateTime.now());

        // O motivo só é armazenado quando houver rejeição.
        if (nomeStatus.equals("REJEITADO")) {

            solicitacao.setMotivoRejeicao(
                dto.motivoRejeicao().trim()
            );

        } else {

            solicitacao.setMotivoRejeicao(null);
        }

        // Persiste as alterações na mesma transação.
        Solicitacao atualizada =
            solicitacaoRepository.saveAndFlush(solicitacao);

        return converterParaDTO(atualizada);
    }

    // Consulta os dados atuais e propostos de uma edição.
    // Somente administradores podem realizar a comparação.
    @Transactional(readOnly = true)
    public SolicitacaoComparacaoDTO compararEdicao(
            Long idSolicitacao,
            String emailAdministrador) {

        // Busca o usuário autenticado.
        Usuario administrador =
            usuarioRepository.findByEmail(emailAdministrador)
                .orElseThrow(() ->
                    new RecursoNaoEncontradoException(
                        "Usuário autenticado não encontrado."
                    )
                );

        // Confirma a permissão administrativa.
        validarAdministrador(administrador);

        // Busca a solicitação.
        Solicitacao solicitacao =
            buscarSolicitacao(idSolicitacao);

        // Apenas solicitações de edição possuem comparação.
        if (!"EDICAO".equalsIgnoreCase(
                solicitacao.getTipoSolicitacao())) {

            throw new ConflitoException(
                "Esta solicitação não é uma edição de ONG."
            );
        }

        // Recupera o registro de edição pendente.
        OngEdicaoPendente edicao =
            ongEdicaoPendenteRepository
                .findBySolicitacaoIdSolicitacao(idSolicitacao)
                .orElseThrow(() ->
                    new RecursoNaoEncontradoException(
                        "Os dados da edição não foram encontrados."
                    )
                );

        // Descriptografa e interpreta os dados propostos.
        OngEdicaoDadosDTO dadosPropostos =
            recuperarDadosEdicao(edicao);

        // Busca os dados atualmente cadastrados da ONG.
        OngDetalhesAdminResponseDTO dadosAtuais =
            ongService.buscarDetalhesAdmin(
                solicitacao.getOng().getIdOng()
            );

        // Retorna os dados atuais e propostos.
        return new SolicitacaoComparacaoDTO(
            solicitacao.getIdSolicitacao(),
            solicitacao.getOng().getIdOng(),
            dadosAtuais,
            dadosPropostos
        );
    }

    // Analisa os dados propostos para edição.
    private void analisarEdicao(
            Solicitacao solicitacao,
            Ong ong,
            String nomeStatus) {

        // Recupera os arquivos vinculados à solicitação analisada.
        List<ImagemEdicaoPendente> imagensPendentes =
            imagemEdicaoPendenteRepository
                .findBySolicitacaoIdSolicitacao(
                    solicitacao.getIdSolicitacao()
                );

        if ("APROVADO".equals(nomeStatus)) {

            // Recupera os dados propostos.
            OngEdicaoPendente edicao =
                ongEdicaoPendenteRepository
                    .findBySolicitacaoIdSolicitacao(
                        solicitacao.getIdSolicitacao()
                    )
                    .orElseThrow(() ->
                        new RecursoNaoEncontradoException(
                            "Os dados da edição não foram encontrados."
                        )
                    );

            // Descriptografa a proposta.
            OngEdicaoDadosDTO dados = recuperarDadosEdicao(edicao);

            // Confere os arquivos e seus vínculos.
            validarImagensPropostas(
                ong,
                dados,
                imagensPendentes
            );

            // Aplica somente as alterações aprovadas.
            aplicarEdicao(ong, dados);

        } else {

            // Rejeição: preserva os dados atuais da ONG.
            // Remove somente os arquivos desta solicitação.
            List<String> arquivosNovos = imagensPendentes.stream()
                .map(imagemPendente -> imagemPendente.getNomeArquivo())
                .toList();

            // Exclui os arquivos físicos somente após o commit.
            registrarExclusaoAposCommit(arquivosNovos);
        }

        // Remove os vínculos temporários após a análise.
        imagemEdicaoPendenteRepository.deleteAll(imagensPendentes);
    }

    // Descriptografa e interpreta os dados da proposta.
    private OngEdicaoDadosDTO recuperarDadosEdicao(OngEdicaoPendente edicao) {

        try {
            String json = aesCryptoUtil.decrypt(edicao.getDadosPropostos());
            OngEdicaoDadosDTO dados = objectMapper.readValue(json, OngEdicaoDadosDTO.class);

            if (dados == null) {
                throw new ConflitoException("A proposta de edição está vazia.");
            }

            return dados;

        } catch (JacksonException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Não foi possível interpretar os dados da edição.", e);
        }
    }

    // Confere se os caminhos propostos são válidos.
    // Valida os caminhos e os vínculos das imagens propostas.
    private void validarImagensPropostas(
            Ong ong,
            OngEdicaoDadosDTO dados,
            List<ImagemEdicaoPendente> imagensPendentes) {

        // A proposta deve conter de três a cinco imagens.
        if (dados.imagens() == null
                || dados.imagens().size() < 3
                || dados.imagens().size() > 5) {

            throw new ConflitoException(
                "A proposta deve conter de três a cinco imagens."
            );
        }

        // Impede caminhos nulos ou duplicados.
        Set<String> caminhosUnicos =
            new HashSet<>(dados.imagens());

        if (caminhosUnicos.contains(null)
                || caminhosUnicos.size() != dados.imagens().size()) {

            throw new ConflitoException(
                "A proposta contém imagens inválidas ou repetidas."
            );
        }

        // Recupera as imagens permanentes da ONG.
        Set<String> caminhosAtuais = ong.getImagens()
            .stream()
            .map(imagem -> imagem.getCaminho())
            .collect(Collectors.toSet());

        // Recupera os caminhos dos arquivos temporários
        // pertencentes exclusivamente à solicitação.
        Set<String> caminhosTemporarios = imagensPendentes
            .stream()
            .map(imagemPendente -> imagemPendente.getNomeArquivo())
            .map(nomeArquivo -> "/uploads/" + nomeArquivo)
            .collect(Collectors.toSet());

        // Impede vínculos temporários duplicados.
        if (caminhosTemporarios.size() != imagensPendentes.size()) {

            throw new ConflitoException(
                "A solicitação possui vínculos de imagens inválidos."
            );
        }

        // Impede que um arquivo temporário já esteja
        // vinculado permanentemente à ONG.
        if (!java.util.Collections.disjoint(
                caminhosAtuais,
                caminhosTemporarios)) {

            throw new ConflitoException(
                "Uma imagem temporária já pertence à ONG."
            );
        }

        // Identifica as imagens novas informadas na proposta.
        Set<String> imagensNovasPropostas = new HashSet<>();

        for (String caminho : dados.imagens()) {

            // Imagens existentes devem pertencer à ONG.
            if (caminhosAtuais.contains(caminho)) {
                continue;
            }

            // Valida o formato dos arquivos novos.
            if (!caminho.matches(
                    "^/uploads/[0-9a-fA-F-]{36}\\.(jpg|png)$")) {

                throw new ConflitoException(
                    "A proposta contém um caminho de imagem inválido."
                );
            }

            // Confirma que o arquivo pertence à solicitação.
            if (!caminhosTemporarios.contains(caminho)) {

                throw new ConflitoException(
                    "Uma imagem nova não pertence a esta solicitação."
                );
            }

            imagensNovasPropostas.add(caminho);
        }

        // Todos os arquivos temporários devem constar
        // na proposta enviada pelo responsável.
        if (!imagensNovasPropostas.equals(caminhosTemporarios)) {

            throw new ConflitoException(
                "Os arquivos temporários não correspondem à proposta."
            );
        }
    }

    // Aplica os dados aprovados à ONG.
    private void aplicarEdicao(
            Ong ong,
            OngEdicaoDadosDTO dados) {

        validarDadosAprovados(ong, dados);

        // Atualiza os dados básicos.
        ong.setNome(dados.nome().trim());
        ong.setInstagram(dados.instagram());

        // Atualiza o telefone criptografado e seu hash.
        String telefone = dados.telefone();

        ong.setTelefone(aesCryptoUtil.encrypt(telefone));
        ong.setTelefoneHash(
            hmacCryptoUtil.gerarHash(telefone)
        );

        // CNPJ e responsável permanecem inalterados.

        // Atualiza o endereço.
        Endereco endereco = ong.getEndereco();

        if (endereco == null) {
            endereco = new Endereco();
            ong.setEndereco(endereco);
        }

        endereco.setCep(dados.cep());
        endereco.setLogradouro(dados.logradouro());
        endereco.setNumero(dados.numero());
        endereco.setComplemento(dados.complemento());
        endereco.setBairro(dados.bairro());
        endereco.setCidade(dados.cidade());
        endereco.setEstado(dados.estado());

        // Atualiza as descrições.
        atualizarDescricoes(ong, dados);

        // Atualiza as categorias.
        atualizarCategorias(ong, dados.categorias());

        // Atualiza as imagens.
        atualizarImagens(ong, dados.imagens());

        // Persiste a ONG e seus relacionamentos.
        ongRepository.saveAndFlush(ong);
    }

    // Valida novamente os dados antes da aprovação.
    private void validarDadosAprovados(
            Ong ong,
            OngEdicaoDadosDTO dados) {

        if (dados.nome() == null
                || dados.nome().isBlank()
                || dados.nome().trim().length() > 150) {

            throw new ConflitoException(
                "O nome proposto para a ONG é inválido."
            );
        }

        if (dados.telefone() == null
                || !dados.telefone().matches("\\d{10,11}")) {

            throw new ConflitoException(
                "O telefone proposto é inválido."
            );
        }

        String telefoneHash =
            hmacCryptoUtil.gerarHash(dados.telefone());

        if (ongRepository.existsByTelefoneHashAndIdOngNot(
                telefoneHash,
                ong.getIdOng())) {

            throw new ConflitoException(
                "O telefone proposto já pertence a outra ONG."
            );
        }

        if (dados.descricaoCurta() == null
                || dados.descricaoCurta().isBlank()
                || dados.descricaoCompleta() == null
                || dados.descricaoCompleta().isBlank()) {

            throw new ConflitoException(
                "As descrições propostas são inválidas."
            );
        }

        if (dados.cep() == null
                || !dados.cep().matches("\\d{8}")
                || dados.logradouro() == null
                || dados.logradouro().isBlank()
                || dados.numero() == null
                || dados.numero().isBlank()
                || dados.bairro() == null
                || dados.bairro().isBlank()
                || dados.cidade() == null
                || dados.cidade().isBlank()
                || dados.estado() == null
                || !dados.estado().matches("[A-Z]{2}")) {

            throw new ConflitoException(
                "O endereço proposto é inválido."
            );
        }

        if (dados.categorias() == null
                || dados.categorias().isEmpty()) {

            throw new ConflitoException(
                "A proposta não possui categorias válidas."
            );
        }
    }

    // Atualiza as descrições RESUMO e SOBRE.
    private void atualizarDescricoes(
            Ong ong,
            OngEdicaoDadosDTO dados) {

        Descricao resumo = ong.getDescricoes()
            .stream()
            .filter(item ->
                "RESUMO".equals(item.getTipoDescricao())
            )
            .findFirst()
            .orElse(null);

        if (resumo == null) {

            resumo = new Descricao();
            resumo.setTipoDescricao("RESUMO");
            ong.addDescricao(resumo);
        }

        resumo.setTexto(dados.descricaoCurta().trim());

        Descricao sobre = ong.getDescricoes()
            .stream()
            .filter(item ->
                "SOBRE".equals(item.getTipoDescricao())
            )
            .findFirst()
            .orElse(null);

        if (sobre == null) {

            sobre = new Descricao();
            sobre.setTipoDescricao("SOBRE");
            ong.addDescricao(sobre);
        }

        sobre.setTexto(dados.descricaoCompleta().trim());
    }

    // Substitui as categorias pelas categorias aprovadas.
    private void atualizarCategorias(
            Ong ong,
            List<Long> categoriasIds) {

        Set<Long> idsUnicos =
            new HashSet<>(categoriasIds);

        if (idsUnicos.contains(null)
                || idsUnicos.size() != categoriasIds.size()) {

            throw new ConflitoException(
                "A proposta contém categorias inválidas ou repetidas."
            );
        }

        List<Categoria> categorias =
            categoriaRepository.findAllById(idsUnicos);

        if (categorias.size() != idsUnicos.size()) {

            throw new ConflitoException(
                "Uma categoria da proposta não existe mais."
            );
        }

        // Remove somente as associações que não serão mantidas.
        List<OngCategoria> remover =
            new ArrayList<>(ong.getCategorias());

        for (OngCategoria associacao : remover) {

            Long idCategoria =
                associacao.getCategoria().getIdCategoria();

            if (!idsUnicos.contains(idCategoria)) {
                ong.removeCategoria(associacao);
            }
        }

        // Adiciona somente as categorias novas.
        for (Categoria categoria : categorias) {

            boolean jaExiste = ong.getCategorias()
                .stream()
                .anyMatch(associacao ->
                    associacao.getCategoria()
                        .getIdCategoria()
                        .equals(categoria.getIdCategoria())
                );

            if (!jaExiste) {

                OngCategoria associacao = new OngCategoria();
                associacao.setCategoria(categoria);
                ong.addCategoria(associacao);
            }
        }
    }

    // Atualiza os registros de imagem.
    private void atualizarImagens(
            Ong ong,
            List<String> caminhosPropostos) {

        Set<String> caminhosAprovados =
            new HashSet<>(caminhosPropostos);

        Set<String> caminhosAtuais = ong.getImagens()
            .stream()
            .map(imagem -> imagem.getCaminho())
            .collect(Collectors.toSet());

        List<String> arquivosRemovidos = new ArrayList<>();

        // Remove as imagens descartadas pelo usuário.
        List<Imagem> imagensAtuais =
            new ArrayList<>(ong.getImagens());

        for (Imagem imagem : imagensAtuais) {

            if (!caminhosAprovados.contains(
                    imagem.getCaminho())) {

                arquivosRemovidos.add(
                    extrairNomeArquivo(imagem.getCaminho())
                );

                ong.removeImagem(imagem);
            }
        }

        // Adiciona as imagens novas.
        int numeroImagem = ong.getImagens().size() + 1;

        for (String caminho : caminhosPropostos) {

            if (caminhosAtuais.contains(caminho)) {
                continue;
            }

            Imagem imagem = new Imagem();
            imagem.setCaminho(caminho);

            String textoAlternativo =
                "Imagem " + numeroImagem
                + " da ONG " + ong.getNome();

            imagem.setTextoAlternativo(
                textoAlternativo.length() > 255
                    ? textoAlternativo.substring(0, 255)
                    : textoAlternativo
            );

            ong.addImagem(imagem);
            numeroImagem++;
        }

        // Exclui os arquivos físicos somente após o commit.
        registrarExclusaoAposCommit(arquivosRemovidos);
    }

    // Extrai somente nomes gerados pelo armazenamento interno.
    private String extrairNomeArquivo(String caminho) {

        if (caminho == null
                || !caminho.matches(
                    "^/uploads/[0-9a-fA-F-]{36}\\.(jpg|png)$")) {

            throw new ConflitoException(
                "O caminho de uma imagem é inválido."
            );
        }

        return caminho.substring("/uploads/".length());
    }

    // Exclui os arquivos físicos após a confirmação da transação.
    private void registrarExclusaoAposCommit(
            List<String> arquivos) {

        if (arquivos.isEmpty()) {
            return;
        }

        List<String> arquivosParaExcluir =
            new ArrayList<>(arquivos);

        TransactionSynchronizationManager.registerSynchronization(
            new TransactionSynchronization() {

                @Override
                public void afterCommit() {

                    for (String nomeArquivo : arquivosParaExcluir) {

                        try {

                            fileStorageService.deletarArquivo(
                                nomeArquivo
                            );

                        } catch (RuntimeException erro) {

                            // O banco já confirmou a transação.
                            // Registra a falha para recuperação posterior.
                            log.error(
                                "Falha ao excluir arquivo após commit: {}",
                                nomeArquivo,
                                erro
                            );
                        }
                    }
                }
            }
        );
    }

    // Lista todas as solicitações.
    @Transactional(readOnly = true)
    public List<SolicitacaoResponseDTO> listarTodas() {

        return solicitacaoRepository.findAll()
            .stream()
            .map(this::converterParaDTO)
            .collect(Collectors.toList());
    }

    // Lista os status disponíveis para análise.
    @Transactional(readOnly = true)
    public List<StatusSolicitacaoResponseDTO> listarStatus() {

        return statusSolicitacaoRepository.findAll()
            .stream()
            .map(status -> new StatusSolicitacaoResponseDTO(
                status.getIdStatus(),
                status.getNome()
            ))
            .toList();
    }

    // Busca uma solicitação pelo ID.
    @Transactional(readOnly = true)
    public SolicitacaoResponseDTO buscarPorId(Long id) {

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
                    "ONG não encontrada com o ID: " + idOng
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

        return solicitacaoRepository.findById(idSolicitacao)
            .orElseThrow(() ->
                new RecursoNaoEncontradoException(
                    "Solicitação não encontrada com o ID: "
                    + idSolicitacao
                )
            );
    }

    // Busca um status pelo ID.
    private StatusSolicitacao buscarStatus(Long idStatus) {

        return statusSolicitacaoRepository.findById(idStatus)
            .orElseThrow(() ->
                new RecursoNaoEncontradoException(
                    "Status não encontrado com o ID: " + idStatus
                )
            );
    }

    // Busca um status pelo nome.
    private StatusSolicitacao buscarStatusPorNome(
            String nome) {

        return statusSolicitacaoRepository.findByNome(nome)
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
    private void validarAdministrador(Usuario administrador) {

        if (administrador.getFuncao() == null
                || administrador.getFuncao().getNome() == null
                || !administrador.getFuncao()
                    .getNome()
                    .equalsIgnoreCase("ADMINISTRADOR")) {

            throw new ConflitoException(
                "O usuário autenticado não possui "
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
            solicitacao.getMotivoRejeicao(),

            // Identifica o tipo da solicitação.
            solicitacao.getTipoSolicitacao() == null
                ? "CADASTRO"
                : solicitacao.getTipoSolicitacao()
        );
    }
}