package br.edu.ifsp.entrecausas.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;

import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import br.edu.ifsp.entrecausas.dto.DescricaoResponseDTO;
import br.edu.ifsp.entrecausas.dto.EnderecoResponseDTO;
import br.edu.ifsp.entrecausas.dto.ImagemResponseDTO;
import br.edu.ifsp.entrecausas.dto.OngCategoriaResponseDTO;
import br.edu.ifsp.entrecausas.dto.OngDetalhesAdminResponseDTO;
import br.edu.ifsp.entrecausas.dto.OngEdicaoDadosDTO;
import br.edu.ifsp.entrecausas.dto.OngMinhaResponseDTO;
import br.edu.ifsp.entrecausas.dto.OngRequestDTO;
import br.edu.ifsp.entrecausas.dto.OngResponseDTO;
import br.edu.ifsp.entrecausas.dto.OngPublicaResponseDTO;

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
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class OngService {

    private static final Logger log = LoggerFactory.getLogger(OngService.class);

    private final OngRepository ongRepository;
    private final UsuarioRepository usuarioRepository;
    private final CategoriaRepository categoriaRepository;
    private final SolicitacaoRepository solicitacaoRepository;
    private final StatusSolicitacaoRepository statusSolicitacaoRepository;
    private final OngEdicaoPendenteRepository ongEdicaoPendenteRepository;
    private final ImagemEdicaoPendenteRepository imagemEdicaoPendenteRepository;

    private final OngPublicacaoService ongPublicacaoService;

    private final AesCryptoUtil aesCryptoUtil;
    private final HmacCryptoUtil hmacCryptoUtil;
    private final FileStorageService fileStorageService;
    private final ObjectMapper objectMapper;
    private final EntityManager entityManager;
    private final PasswordEncoder passwordEncoder;

    // Injeção de dependências realizada via construtor.
    public OngService(
        OngRepository ongRepository,
        UsuarioRepository usuarioRepository,
        AesCryptoUtil aesCryptoUtil,
        HmacCryptoUtil hmacCryptoUtil,
        CategoriaRepository categoriaRepository,
        FileStorageService fileStorageService,
        SolicitacaoRepository solicitacaoRepository,
        StatusSolicitacaoRepository statusSolicitacaoRepository,
        OngEdicaoPendenteRepository ongEdicaoPendenteRepository,
        ImagemEdicaoPendenteRepository imagemEdicaoPendenteRepository,
        OngPublicacaoService ongPublicacaoService,
        ObjectMapper objectMapper,
        EntityManager entityManager,
        PasswordEncoder passwordEncoder) {

        this.ongRepository = ongRepository;
        this.usuarioRepository = usuarioRepository;
        this.aesCryptoUtil = aesCryptoUtil;
        this.hmacCryptoUtil = hmacCryptoUtil;
        this.categoriaRepository = categoriaRepository;
        this.fileStorageService = fileStorageService;
        this.solicitacaoRepository = solicitacaoRepository;
        this.statusSolicitacaoRepository = statusSolicitacaoRepository;
        this.ongEdicaoPendenteRepository = ongEdicaoPendenteRepository;
        this.imagemEdicaoPendenteRepository = imagemEdicaoPendenteRepository;
        this.ongPublicacaoService = ongPublicacaoService;
        this.objectMapper = objectMapper;
        this.entityManager = entityManager;
        this.passwordEncoder = passwordEncoder;
    }

    // Cadastra uma ONG com os dados das três etapas.
    @Transactional
    public OngResponseDTO cadastrar(
            String emailUsuario,
            String nome,
            String cnpjInformado,
            String telefoneInformado,
            String instagram,
            String descricaoCurta,
            String descricaoCompleta,
            List<Long> categoriasIds,
            String cep,
            String logradouro,
            String numero,
            String complemento,
            String bairro,
            String cidade,
            String estado,
            List<MultipartFile> imagens) {

        // Valida os campos obrigatórios.
        validarObrigatorio(nome, "Informe o nome da ONG.");
        validarObrigatorio(cnpjInformado, "Informe o CNPJ.");
        validarObrigatorio(telefoneInformado, "Informe o telefone.");
        validarObrigatorio(descricaoCurta, "Informe a descrição curta.");
        validarObrigatorio(
            descricaoCompleta,
            "Informe a descrição completa."
        );
        validarObrigatorio(cep, "Informe o CEP.");
        validarObrigatorio(logradouro, "Informe o logradouro.");
        validarObrigatorio(numero, "Informe o número.");
        validarObrigatorio(bairro, "Informe o bairro.");
        validarObrigatorio(cidade, "Informe a cidade.");
        validarObrigatorio(estado, "Informe o estado.");

        validarNome(nome);

        // Normaliza os documentos antes da criptografia.
        String cnpj = normalizarDocumento(cnpjInformado);
        String telefone = normalizarTelefone(telefoneInformado);

        validarCnpj(cnpj);
        validarTelefone(telefone);

        String cepNormalizado = normalizarCep(cep);
        String uf = validarEstado(estado);

        // Gera hashes determinísticos para verificar duplicidade.
        String cnpjHash = hmacCryptoUtil.gerarHash(cnpj);
        String telefoneHash = hmacCryptoUtil.gerarHash(telefone);

        if (ongRepository.existsByCnpjHash(cnpjHash)) {
            throw new ConflitoException(
                "O CNPJ informado já está cadastrado."
            );
        }

        if (ongRepository.existsByTelefoneHash(telefoneHash)) {
            throw new ConflitoException(
                "O telefone informado já está cadastrado."
            );
        }

        // Obtém o usuário pela sessão autenticada.
        Usuario usuario = usuarioRepository.findByEmail(emailUsuario)
            .orElseThrow(() ->
                new RecursoNaoEncontradoException(
                    "Usuário autenticado não encontrado."
                )
            );

        // Um usuário pode gerenciar somente uma ONG.
        if (ongRepository.existsByUsuarioIdUsuario(
                usuario.getIdUsuario())) {

            throw new ConflitoException(
                "Sua conta já possui uma ONG cadastrada."
            );
        }

        // Confere as categorias existentes no banco.
        List<Categoria> categorias =
            validarCategorias(categoriasIds);

        // Exige de três a cinco imagens.
        if (imagens == null
                || imagens.size() < 3
                || imagens.size() > 5
                || imagens.stream().anyMatch(
                    arquivo -> arquivo == null || arquivo.isEmpty()
                )) {

            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Envie de três a cinco imagens."
            );
        }

        // Busca o status existente antes de salvar os arquivos.
        StatusSolicitacao statusPendente =
            buscarStatusPendente();

        // Registra os arquivos para removê-los se o cadastro falhar.
        List<String> arquivosSalvos = new ArrayList<>();
        registrarLimpezaRollback(arquivosSalvos);

        // Cria a ONG com os dados básicos.
        Ong ong = new Ong();

        ong.setNome(nome.trim());
        ong.setCnpj(aesCryptoUtil.encrypt(cnpj));
        ong.setCnpjHash(cnpjHash);
        ong.setTelefone(aesCryptoUtil.encrypt(telefone));
        ong.setTelefoneHash(telefoneHash);
        ong.setInstagram(normalizarOpcional(instagram));
        ong.setUsuario(usuario);

        // Salva a descrição curta.
        Descricao resumo = new Descricao();
        resumo.setTipoDescricao("RESUMO");
        resumo.setTexto(descricaoCurta.trim());
        ong.addDescricao(resumo);

        // Salva a descrição completa.
        Descricao sobre = new Descricao();
        sobre.setTipoDescricao("SOBRE");
        sobre.setTexto(descricaoCompleta.trim());
        ong.addDescricao(sobre);

        // Cria o endereço e vincula os dois lados.
        Endereco endereco = new Endereco();

        endereco.setCep(cepNormalizado);
        endereco.setLogradouro(logradouro.trim());
        endereco.setNumero(numero.trim());
        endereco.setComplemento(normalizarOpcional(complemento));
        endereco.setBairro(bairro.trim());
        endereco.setCidade(cidade.trim());
        endereco.setEstado(uf);

        ong.setEndereco(endereco);

        // Associa as categorias existentes.
        for (Categoria categoria : categorias) {
            OngCategoria associacao = new OngCategoria();
            associacao.setCategoria(categoria);
            ong.addCategoria(associacao);
        }

        // Salva as imagens e registra os caminhos no banco.
        for (int i = 0; i < imagens.size(); i++) {

            String nomeArquivo =
                fileStorageService.salvarArquivo(imagens.get(i));

            if (nomeArquivo == null) {
                throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Não foi possível salvar uma das imagens."
                );
            }

            arquivosSalvos.add(nomeArquivo);

            Imagem imagem = new Imagem();
            imagem.setCaminho("/uploads/" + nomeArquivo);
            imagem.setTextoAlternativo(
                criarTextoAlternativo(i + 1, nome)
            );

            ong.addImagem(imagem);
        }

        // Persiste a ONG e os relacionamentos na transação.
        Ong ongSalva = ongRepository.saveAndFlush(ong);

        // Cria a solicitação de análise da ONG.
        Solicitacao solicitacao = new Solicitacao(
            ongSalva,
            usuario,
            statusPendente
        );

        solicitacao.setTipoSolicitacao("CADASTRO");

        // Persiste a solicitação na mesma transação.
        solicitacaoRepository.save(solicitacao);

        return converterParaDTO(ongSalva);
    }

    // Registra uma proposta de edição sem alterar a ONG publicada.
    @Transactional
    public Long solicitarEdicao(
            Long idOng,
            String emailUsuario,
            String nome,
            String telefoneInformado,
            String instagram,
            String descricaoCurta,
            String descricaoCompleta,
            List<Long> categoriasIds,
            String cep,
            String logradouro,
            String numero,
            String complemento,
            String bairro,
            String cidade,
            String estado,
            List<Long> imagensMantidasIds,
            List<MultipartFile> novasImagens,
            String senhaAtual) {

        Usuario usuario = usuarioRepository.findByEmail(emailUsuario)
            .orElseThrow(() ->
                new RecursoNaoEncontradoException(
                    "Usuário autenticado não encontrado."
                )
            );

        // Bloqueia a ONG durante a criação da solicitação.
        // Isso impede duas solicitações simultâneas para a mesma ONG.
        Ong ong = entityManager.find(
            Ong.class,
            idOng,
            LockModeType.PESSIMISTIC_WRITE
        );

        if (ong == null) {
            throw new RecursoNaoEncontradoException(
                "ONG não encontrada com o ID: " + idOng
            );
        }

        // Somente o responsável pode solicitar alterações.
        if (!ong.getUsuario().getIdUsuario()
                .equals(usuario.getIdUsuario())) {

            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Você não possui permissão para editar esta ONG."
            );
        }

        // Confirma a senha atual antes de registrar a solicitação.
        if (senhaAtual == null
                || senhaAtual.isBlank()
                || !passwordEncoder.matches(senhaAtual, usuario.getSenha())) {

            throw new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "Senha atual incorreta."
            );
        }

        // Impede uma nova edição enquanto existir outra pendente.
        if (solicitacaoRepository
                .existsByOngIdOngAndTipoSolicitacaoAndStatusNome(
                    idOng,
                    "EDICAO",
                    "PENDENTE"
                )) {

            throw new ConflitoException(
                "Esta ONG já possui uma edição aguardando análise."
            );
        }

        // Permite editar cadastros aprovados ou rejeitados.
        // Cadastros ainda pendentes não podem ser reenviados.
        List<Solicitacao> solicitacoesCadastro =
            solicitacaoRepository.findByOngIdOng(idOng)
                .stream()
                .filter(solicitacao ->
                    !"EDICAO".equalsIgnoreCase(
                        solicitacao.getTipoSolicitacao()
                    )
                )
                .toList();

        boolean cadastroAprovado = solicitacoesCadastro.stream()
            .anyMatch(solicitacao ->
                "APROVADO".equalsIgnoreCase(
                    solicitacao.getStatus().getNome()
                )
            );

        boolean cadastroRejeitado = solicitacoesCadastro.stream()
            .anyMatch(solicitacao ->
                "REJEITADO".equalsIgnoreCase(
                    solicitacao.getStatus().getNome()
                )
            );

        boolean cadastroPendente = solicitacoesCadastro.stream()
            .anyMatch(solicitacao ->
                "PENDENTE".equalsIgnoreCase(
                    solicitacao.getStatus().getNome()
                )
            );

        if (cadastroPendente || (!cadastroAprovado && !cadastroRejeitado)) {
            throw new ConflitoException(
                "A ONG precisa ter seu cadastro analisado "
                + "antes de solicitar alterações."
            );
        }

        // Valida os campos obrigatórios.
        validarObrigatorio(nome, "Informe o nome da ONG.");
        validarObrigatorio(
            telefoneInformado,
            "Informe o telefone."
        );
        validarObrigatorio(
            descricaoCurta,
            "Informe a descrição curta."
        );
        validarObrigatorio(
            descricaoCompleta,
            "Informe a descrição completa."
        );
        validarObrigatorio(cep, "Informe o CEP.");
        validarObrigatorio(logradouro, "Informe o logradouro.");
        validarObrigatorio(numero, "Informe o número.");
        validarObrigatorio(bairro, "Informe o bairro.");
        validarObrigatorio(cidade, "Informe a cidade.");
        validarObrigatorio(estado, "Informe o estado.");

        validarNome(nome);

        // Normaliza e valida o telefone.
        String telefone = normalizarTelefone(telefoneInformado);
        validarTelefone(telefone);

        String telefoneHash = hmacCryptoUtil.gerarHash(telefone);

        if (ongRepository.existsByTelefoneHashAndIdOngNot(
                telefoneHash,
                idOng)) {

            throw new ConflitoException(
                "O telefone informado já está cadastrado em outra ONG."
            );
        }

        String cepNormalizado = normalizarCep(cep);
        String uf = validarEstado(estado);

        // Confere as categorias existentes.
        validarCategorias(categoriasIds);

        // Identifica as imagens antigas que serão mantidas.
        List<Long> idsMantidos = imagensMantidasIds == null
            ? Collections.emptyList()
            : imagensMantidasIds;

        Set<Long> idsUnicos = new HashSet<>(idsMantidos);

        if (idsUnicos.contains(null)
                || idsUnicos.size() != idsMantidos.size()) {

            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "A lista de imagens mantidas contém valores inválidos."
            );
        }

        List<String> caminhosMantidos = new ArrayList<>();

        for (Long idImagem : idsMantidos) {

            Imagem imagem = ong.getImagens().stream()
                .filter(item -> Objects.equals(
                    item.getIdImagem(),
                    idImagem
                ))
                .findFirst()
                .orElseThrow(() ->
                    new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Uma imagem não pertence à ONG."
                    )
                );

            caminhosMantidos.add(imagem.getCaminho());
        }

        // Considera somente os arquivos efetivamente enviados.
        List<MultipartFile> arquivosNovos = novasImagens == null
            ? Collections.emptyList()
            : novasImagens;

        if (arquivosNovos.stream().anyMatch(
                arquivo -> arquivo == null || arquivo.isEmpty()
            )) {

            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Uma das novas imagens está vazia."
            );
        }

        // A quantidade final deve permanecer entre três e cinco.
        int totalImagens =
            caminhosMantidos.size() + arquivosNovos.size();

        if (totalImagens < 3 || totalImagens > 5) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "A ONG deve possuir de três a cinco imagens."
            );
        }

        StatusSolicitacao statusPendente =
            buscarStatusPendente();

        // Os arquivos novos são temporários até a aprovação.
        List<String> arquivosSalvos = new ArrayList<>();
        registrarLimpezaRollback(arquivosSalvos);

        List<String> caminhosPropostos =
            new ArrayList<>(caminhosMantidos);

        for (MultipartFile arquivo : arquivosNovos) {

            String nomeArquivo =
                fileStorageService.salvarArquivo(arquivo);

            if (nomeArquivo == null) {
                throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Não foi possível salvar uma das imagens."
                );
            }

            arquivosSalvos.add(nomeArquivo);
            caminhosPropostos.add("/uploads/" + nomeArquivo);
        }

        // Prepara os dados propostos sem modificar a entidade ONG.
        OngEdicaoDadosDTO dados = new OngEdicaoDadosDTO(
            nome.trim(),
            telefone,
            normalizarOpcional(instagram),
            descricaoCurta.trim(),
            descricaoCompleta.trim(),
            new ArrayList<>(categoriasIds),
            cepNormalizado,
            logradouro.trim(),
            numero.trim(),
            normalizarOpcional(complemento),
            bairro.trim(),
            cidade.trim(),
            uf,
            caminhosPropostos
        );

        // Serializa e criptografa a proposta.
        String dadosCriptografados;

        try {
            String json = objectMapper.writeValueAsString(dados);
            dadosCriptografados = aesCryptoUtil.encrypt(json);
        } catch (JacksonException e) {
            throw new ResponseStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Não foi possível preparar a proposta de edição.",
                e
            );
        }

        // Cria a solicitação na mesma transação.
        Solicitacao solicitacao = new Solicitacao(ong, usuario, statusPendente);

        solicitacao.setTipoSolicitacao("EDICAO");

        Solicitacao solicitacaoSalva = solicitacaoRepository.saveAndFlush(solicitacao);

        // Armazena os dados propostos separadamente.
        OngEdicaoPendente edicao = new OngEdicaoPendente(solicitacaoSalva, dadosCriptografados);

        ongEdicaoPendenteRepository.saveAndFlush(edicao);

        // Vincula somente os arquivos novos à solicitação.
        // As imagens antigas continuam vinculadas à ONG.
        List<ImagemEdicaoPendente> imagensPendentes = new ArrayList<>();
        for (String nomeArquivo : arquivosSalvos) {
            ImagemEdicaoPendente imagemPendente = new ImagemEdicaoPendente(nomeArquivo, solicitacaoSalva);
            imagensPendentes.add(imagemPendente);
        }

        // Persiste os vínculos na mesma transação.
        if (!imagensPendentes.isEmpty()) {
            imagemEdicaoPendenteRepository.saveAll(imagensPendentes);
        }

        return solicitacaoSalva.getIdSolicitacao();

    }
    
    // Lista somente as ONGs aprovadas.
    @Transactional(readOnly = true)
    public List<OngPublicaResponseDTO> listarTodas() {

        return ongRepository.findAll()
            .stream()
            .filter(ong ->
                ongPublicacaoService.ongEstaAprovada(ong.getIdOng())
            )
            .map(this::converterParaDTOPublico)
            .collect(Collectors.toList());
    }


    
    // Busca somente ONGs aprovadas na consulta pública.
    @Transactional(readOnly = true)
    public OngPublicaResponseDTO buscarPorId(Long id) {

        Ong ong = buscarEntidadePorId(id);

        if (!ongPublicacaoService.ongEstaAprovada(id)) {
            throw new RecursoNaoEncontradoException(
                "ONG não encontrada com o ID: " + id
            );
        }

        return converterParaDTOPublico(ong);
    }
    
    // Busca a ONG pertencente ao usuário autenticado.
    @Transactional(readOnly = true)
    public Optional<OngMinhaResponseDTO> buscarMinhaOng(
            String emailUsuario) {

        // Identifica o usuário pela autenticação.
        Usuario usuario = usuarioRepository.findByEmail(emailUsuario)
            .orElseThrow(() ->
                new RecursoNaoEncontradoException(
                    "Usuário autenticado não encontrado."
                )
            );

        // Busca somente a ONG vinculada à conta.
        return ongRepository.findByUsuarioIdUsuario(
                usuario.getIdUsuario()
            )
            .map(ong -> {

                // Considera a solicitação com maior ID como a mais recente.
                Optional<Solicitacao> ultima =
                    solicitacaoRepository.findByOngIdOng(
                            ong.getIdOng()
                        )
                        .stream()
                        .max(Comparator.comparing(
                            (Solicitacao solicitacao) ->
                                solicitacao.getIdSolicitacao()
                        ));

                EnderecoResponseDTO enderecoDTO =
                    converterEndereco(ong);

                List<DescricaoResponseDTO> descricoes =
                    converterDescricoes(ong);

                List<ImagemResponseDTO> imagens =
                    converterImagens(ong);

                List<OngCategoriaResponseDTO> categorias =
                    converterCategorias(ong);

                // Retorna os dados da ONG e da última solicitação.
                return new OngMinhaResponseDTO(
                    ong.getIdOng(),
                    ong.getNome(),
                    aesCryptoUtil.decrypt(ong.getCnpj()),
                    aesCryptoUtil.decrypt(ong.getTelefone()),
                    ong.getInstagram(),
                    enderecoDTO,
                    descricoes,
                    imagens,
                    categorias,
                    ultima.map(item ->
                        item.getStatus().getNome()
                    ).orElse(null),
                    ultima.map(
                        solicitacao -> solicitacao.getDataAnalise()
                    ).orElse(null),
                    ultima.map(
                        solicitacao -> solicitacao.getMotivoRejeicao()
                    ).orElse(null),
                    ongPublicacaoService.ongEstaAprovada(ong.getIdOng()),
                    ultima.map(
                        solicitacao -> solicitacao.getTipoSolicitacao()
                    ).orElse(null)
                );
            });
    }

    // Consulta os dados completos para análise administrativa.
    // O endpoint deve permitir acesso somente a administradores.
    @Transactional(readOnly = true)
    public OngDetalhesAdminResponseDTO buscarDetalhesAdmin(Long id) {

        Ong ong = buscarEntidadePorId(id);

        EnderecoResponseDTO enderecoDTO =
            converterEndereco(ong);

        List<DescricaoResponseDTO> descricoes =
            converterDescricoes(ong);

        List<ImagemResponseDTO> imagens =
            converterImagens(ong);

        List<OngCategoriaResponseDTO> categorias =
            converterCategorias(ong);

        return new OngDetalhesAdminResponseDTO(
            ong.getIdOng(),
            ong.getNome(),
            aesCryptoUtil.decrypt(ong.getCnpj()),
            aesCryptoUtil.decrypt(ong.getTelefone()),
            ong.getInstagram(),
            enderecoDTO,
            descricoes,
            imagens,
            categorias
        );
    }

    // Alterações de ONGs exigem aprovação administrativa.
    // Mantém a assinatura antiga para compatibilidade.
    public OngResponseDTO atualizar(
            Long id,
            OngRequestDTO dto) {

        throw new ResponseStatusException(
            HttpStatus.FORBIDDEN,
            "A edição deve ser enviada para análise administrativa."
        );
    }

    // A exclusão direta permanece bloqueada.
    public void deletar(Long id) {
        throw new ResponseStatusException(
            HttpStatus.FORBIDDEN,
            "A exclusão direta de ONGs não está permitida."
        );
    }

    // Converte o endereço da organização.
    private EnderecoResponseDTO converterEndereco(Ong ong) {

        Endereco endereco = ong.getEndereco();

        return endereco == null
            ? null
            : new EnderecoResponseDTO(
                endereco.getIdEndereco(),
                endereco.getCep(),
                endereco.getLogradouro(),
                endereco.getNumero(),
                endereco.getComplemento(),
                endereco.getBairro(),
                endereco.getCidade(),
                endereco.getEstado(),
                ong.getIdOng()
            );
    }

    // Converte as descrições da organização.
    private List<DescricaoResponseDTO> converterDescricoes(Ong ong) {

        return ong.getDescricoes().stream()
            .map(descricao -> new DescricaoResponseDTO(
                descricao.getIdDescricao(),
                descricao.getTexto(),
                descricao.getTipoDescricao(),
                ong.getIdOng()
            ))
            .collect(Collectors.toList());
    }

    // Converte as imagens da organização.
    private List<ImagemResponseDTO> converterImagens(Ong ong) {

        return ong.getImagens().stream()
            .map(imagem -> new ImagemResponseDTO(
                imagem.getIdImagem(),
                imagem.getCaminho(),
                imagem.getTextoAlternativo(),
                ong.getIdOng()
            ))
            .collect(Collectors.toList());
    }

    // Converte as categorias da organização.
    private List<OngCategoriaResponseDTO> converterCategorias(Ong ong) {

        return ong.getCategorias().stream()
            .map(associacao -> new OngCategoriaResponseDTO(
                associacao.getIdOngCategoria(),
                ong.getIdOng(),
                ong.getNome(),
                associacao.getCategoria().getIdCategoria(),
                associacao.getCategoria().getNome()
            ))
            .collect(Collectors.toList());
    }

    // Busca uma ONG ou lança uma exceção 404.
    private Ong buscarEntidadePorId(Long id) {

        return ongRepository.findById(id)
            .orElseThrow(() ->
                new RecursoNaoEncontradoException(
                    "ONG não encontrada com o ID: " + id
                )
            );
    }

    // Converte a entidade para o DTO de resposta.
    private OngResponseDTO converterParaDTO(Ong ong) {

        return new OngResponseDTO(
            ong.getIdOng(),
            ong.getNome(),
            aesCryptoUtil.decrypt(ong.getTelefone()),
            ong.getInstagram(),
            ong.getUsuario().getIdUsuario()
        );
    }

    // Converte a ONG para o DTO utilizado nas consultas públicas.
    private OngPublicaResponseDTO converterParaDTOPublico(Ong ong) {

        return new OngPublicaResponseDTO(
            ong.getIdOng(),
            ong.getNome(),
            ong.getInstagram(),
            converterEndereco(ong),
            converterDescricoes(ong),
            converterImagens(ong),
            converterCategorias(ong)
        );
    }

    // Valida as categorias informadas.
    private List<Categoria> validarCategorias(
            List<Long> categoriasIds) {

        if (categoriasIds == null || categoriasIds.isEmpty()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Selecione pelo menos uma categoria."
            );
        }

        Set<Long> idsUnicos = new HashSet<>(categoriasIds);

        if (idsUnicos.contains(null)
                || idsUnicos.size() != categoriasIds.size()) {

            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "A lista de categorias contém valores inválidos ou repetidos."
            );
        }

        List<Categoria> categorias =
            categoriaRepository.findAllById(idsUnicos);

        if (categorias.size() != idsUnicos.size()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Uma ou mais categorias selecionadas não existem."
            );
        }

        return categorias;
    }

    // Busca o status de solicitação pendente.
    private StatusSolicitacao buscarStatusPendente() {

        return statusSolicitacaoRepository.findByNome("PENDENTE")
            .orElseThrow(() ->
                new RecursoNaoEncontradoException(
                    "O status PENDENTE não está cadastrado."
                )
            );
    }

    // Remove arquivos novos quando a transação não é confirmada.
    private void registrarLimpezaRollback(List<String> arquivosSalvos) {

        TransactionSynchronizationManager.registerSynchronization(
            new TransactionSynchronization() {

                @Override
                public void afterCompletion(int status) {

                    if (status == TransactionSynchronization.STATUS_COMMITTED) {
                        return;
                    }

                    for (String nomeArquivo : arquivosSalvos) {
                        try {
                            fileStorageService.deletarArquivo(nomeArquivo);
                        } catch (RuntimeException erro) {
                            log.error(
                                "Falha ao remover arquivo após rollback: {}",
                                nomeArquivo,
                                erro
                            );
                        }
                    }
                }
            }
        );
    }

    // Cria o texto alternativo das imagens.
    private String criarTextoAlternativo(int numero, String nome) {

        String texto = "Imagem " + numero + " da ONG " + nome.trim();

        return texto.length() > 255
            ? texto.substring(0, 255)
            : texto;
    }

    // Normaliza campos opcionais.
    private String normalizarOpcional(String valor) {

        return valor == null || valor.isBlank()
            ? null
            : valor.trim();
    }

    // Valida o nome da ONG.
    private void validarNome(String nome) {

        if (nome.trim().length() > 150) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "O nome da ONG deve ter no máximo 150 caracteres."
            );
        }
    }

    // Valida um campo obrigatório.
    private void validarObrigatorio(String valor, String mensagem) {

        if (valor == null || valor.isBlank()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                mensagem
            );
        }
    }

    // Valida o telefone com DDD.
    private void validarTelefone(String telefone) {

        if (!telefone.matches("\\d{10,11}")) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Informe um telefone válido com DDD."
            );
        }
    }

    // Normaliza e valida o CEP.
    private String normalizarCep(String cep) {

        String cepNormalizado = cep.replaceAll("\\D", "");

        if (!cepNormalizado.matches("\\d{8}")) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Informe um CEP válido."
            );
        }

        return cepNormalizado;
    }

    // Valida a sigla do estado.
    private String validarEstado(String estado) {

        String uf = estado.trim().toUpperCase();

        if (!uf.matches("[A-Z]{2}")) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Informe uma sigla de estado válida."
            );
        }

        return uf;
    }

    // Valida os dígitos verificadores do CNPJ.
    private void validarCnpj(String cnpj) {

        if (cnpj == null
                || !cnpj.matches("\\d{14}")
                || cnpj.chars().distinct().count() == 1) {

            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Informe um CNPJ válido."
            );
        }

        int[] pesosPrimeiro = {
            5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2
        };

        int[] pesosSegundo = {
            6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2
        };

        String base = cnpj.substring(0, 12);
        int primeiro = calcularDigitoCnpj(base, pesosPrimeiro);

        base += primeiro;

        int segundo = calcularDigitoCnpj(base, pesosSegundo);

        if (cnpj.charAt(12) - '0' != primeiro
                || cnpj.charAt(13) - '0' != segundo) {

            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Informe um CNPJ válido."
            );
        }
    }

    // Calcula um dígito verificador do CNPJ.
    private int calcularDigitoCnpj(String base, int[] pesos) {

        int soma = 0;

        for (int i = 0; i < pesos.length; i++) {
            soma += (base.charAt(i) - '0') * pesos[i];
        }

        int resto = soma % 11;

        return resto < 2 ? 0 : 11 - resto;
    }

    // Remove máscaras e caracteres não numéricos.
    private String normalizarDocumento(String cnpj) {
        return cnpj.replaceAll("\\D", "");
    }

    // Remove máscaras e caracteres não numéricos.
    private String normalizarTelefone(String telefone) {
        return telefone.replaceAll("\\D", "");
    }
}