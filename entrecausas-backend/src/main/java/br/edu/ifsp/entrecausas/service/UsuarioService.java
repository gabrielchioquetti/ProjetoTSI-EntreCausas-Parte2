package br.edu.ifsp.entrecausas.service;

import br.edu.ifsp.entrecausas.dto.AlterarSenhaDTO;
import br.edu.ifsp.entrecausas.dto.UsuarioRequestDTO;
import br.edu.ifsp.entrecausas.dto.UsuarioResponseDTO;
import br.edu.ifsp.entrecausas.dto.UsuarioUpdateDTO;

import br.edu.ifsp.entrecausas.entity.Funcao;
import br.edu.ifsp.entrecausas.entity.Usuario;

import br.edu.ifsp.entrecausas.exception.ConflitoException;
import br.edu.ifsp.entrecausas.exception.RecursoNaoEncontradoException;

import br.edu.ifsp.entrecausas.repository.FuncaoRepository;
import br.edu.ifsp.entrecausas.repository.UsuarioRepository;

import br.edu.ifsp.entrecausas.security.AesCryptoUtil;
import br.edu.ifsp.entrecausas.security.HmacCryptoUtil;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.session.SessionInformation;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    private static final String FUNCAO_USUARIO = "USUARIO";
    private static final String FUNCAO_ADMINISTRADOR = "ADMINISTRADOR";
    private static final String FUNCAO_MASTER = "MASTER";

    private static final Logger logger = LoggerFactory.getLogger(UsuarioService.class);

    private final UsuarioRepository usuarioRepository;
    private final FuncaoRepository funcaoRepository;
    private final PasswordEncoder passwordEncoder;
    private final AesCryptoUtil aesCryptoUtil;
    private final HmacCryptoUtil hmacCryptoUtil;
    private final FileStorageService fileStorageService;
    private final EmailService emailService;
    private final SessionRegistry sessionRegistry;

    // Injeta as dependências do serviço.
    public UsuarioService(UsuarioRepository usuarioRepository, FuncaoRepository funcaoRepository, PasswordEncoder passwordEncoder, AesCryptoUtil aesCryptoUtil, HmacCryptoUtil hmacCryptoUtil, FileStorageService fileStorageService, EmailService emailService, SessionRegistry sessionRegistry) {
        this.usuarioRepository = usuarioRepository;
        this.funcaoRepository = funcaoRepository;
        this.passwordEncoder = passwordEncoder;
        this.aesCryptoUtil = aesCryptoUtil;
        this.hmacCryptoUtil = hmacCryptoUtil;
        this.fileStorageService = fileStorageService;
        this.emailService = emailService;
        this.sessionRegistry = sessionRegistry;
    }

    // Cadastra um novo usuário.
    @Transactional
    public UsuarioResponseDTO cadastrar(UsuarioRequestDTO dto, MultipartFile foto) {

        String cpf = normalizarDigitos(dto.cpf());
        String telefone = normalizarDigitos(dto.telefone());

        // Verifica se o e-mail já existe.
        if (usuarioRepository.existsByEmail(dto.email())) {
            throw new ConflitoException("E-mail já cadastrado no sistema.");
        }

        String cpfHash = hmacCryptoUtil.gerarHash(cpf);
        String telefoneHash = hmacCryptoUtil.gerarHash(telefone);

        // Verifica se o CPF já existe.
        if (usuarioRepository.existsByCpfHash(cpfHash)) {
            throw new ConflitoException("CPF já cadastrado no sistema.");
        }

        // Verifica se o telefone já existe.
        if (usuarioRepository.existsByTelefoneHash(telefoneHash)) {
            throw new ConflitoException("Telefone já cadastrado no sistema.");
        }

        // Busca a função padrão.
        Funcao funcao = funcaoRepository.findByNome(FUNCAO_USUARIO).orElseThrow(() -> new IllegalStateException("A função USUARIO não foi encontrada."));
        Usuario usuario = new Usuario();

        usuario.setNome(dto.nome());
        usuario.setEmail(dto.email());

        // Armazena somente o hash da senha.
        usuario.setSenha(passwordEncoder.encode(dto.senha()));

        // Armazena o CPF criptografado.
        usuario.setCpf(aesCryptoUtil.encrypt(cpf));
        usuario.setCpfHash(cpfHash);

        // Armazena o telefone criptografado.
        usuario.setTelefone(aesCryptoUtil.encrypt(telefone));
        usuario.setTelefoneHash(telefoneHash);

        // A função é definida pelo backend.
        usuario.setFuncao(funcao);

        // Salva a foto, se enviada.
        String caminhoFoto = null;

        if (foto != null && !foto.isEmpty()) {
            caminhoFoto = fileStorageService.salvarArquivo(foto);
            usuario.setFotoPerfil(caminhoFoto);
            usuario.setFotoAlt(gerarFotoAlt(usuario.getNome()));
        }

        try {

            Usuario usuarioSalvo = usuarioRepository.save(usuario);

            // Prepara os dados para o e-mail de boas-vindas.
            String nomeUsuario = usuarioSalvo.getNome();
            String emailUsuario = usuarioSalvo.getEmail();
            Long idUsuario = usuarioSalvo.getIdUsuario();

            // Envia o e-mail somente após confirmar a transação.
            TransactionSynchronizationManager.registerSynchronization(
                new TransactionSynchronization() {

                    @Override
                    public void afterCommit() {

                        try {
                            emailService.enviarBoasVindas(nomeUsuario, emailUsuario);
                        } catch (RuntimeException erro) {

                            // Uma falha no e-mail não desfaz o cadastro.
                            logger.error("Falha ao enviar boas-vindas para o usuário {}.", idUsuario, erro);
                        }
                    }
                }
            );

            return converterParaDTO(usuarioSalvo);

        } catch (RuntimeException e) {

            // Remove o arquivo se o banco falhar.
            if (caminhoFoto != null) {
                fileStorageService.deletarArquivo(caminhoFoto);
            }

            throw e;
        }
    }

    // Lista todos os usuários. Exclusivo do MASTER.
    @PreAuthorize("hasRole('MASTER')")
    @Transactional(readOnly = true)
    public List<UsuarioResponseDTO> listarTodos() {

        validarMaster();

        return usuarioRepository.findAll().stream().map(this::converterParaDTO).collect(Collectors.toList());
    }

    // Busca o próprio usuário ou permite consulta pelo MASTER.
    @Transactional(readOnly = true)
    public UsuarioResponseDTO buscarPorId(Long id) {

        validarProprioUsuarioOuMaster(id);

        Usuario usuario = buscarUsuario(id);

        return converterParaDTO(usuario);
    }
    
    // Atualiza somente os dados informados do perfil.
    @Transactional
    public UsuarioResponseDTO atualizar(
            Long id,
            UsuarioUpdateDTO dto,
            MultipartFile novaFoto) {

        // Impede a alteração de outra conta.
        validarProprioUsuario(id);

        Usuario usuario = buscarUsuario(id);

        // Guarda o e-mail anterior para controlar as sessões.
        String emailAnterior = usuario.getEmail();

        // Atualiza o nome somente quando informado.
        if (dto.nome() != null) {

            String nome = dto.nome().trim();

            if (nome.isBlank()) {
                throw new IllegalArgumentException(
                        "O nome não pode ficar vazio."
                );
            }

            usuario.setNome(nome);
        }

        // Atualiza o e-mail somente quando informado.
        if (dto.email() != null) {

            String email = dto.email().trim();

            if (email.isBlank()) {
                throw new IllegalArgumentException(
                        "O e-mail não pode ficar vazio."
                );
            }

            // Verifica e-mail de outro usuário.
            if (!usuario.getEmail().equalsIgnoreCase(email)
                    && usuarioRepository.existsByEmail(email)) {

                throw new ConflitoException(
                        "E-mail já cadastrado por outro usuário."
                );
            }

            usuario.setEmail(email);
        }

        // Atualiza o telefone somente quando informado.
        if (dto.telefone() != null) {

            String telefone = dto.telefone().trim();

            if (telefone.isBlank()) {
                throw new IllegalArgumentException(
                        "O telefone não pode ficar vazio."
                );
            }

            // A validação do DTO exige somente dígitos.
            telefone = normalizarDigitos(telefone);

            if (!telefone.matches("\\d{10,11}")) {
                throw new IllegalArgumentException(
                        "O telefone deve conter 10 ou 11 dígitos."
                );
            }

            String telefoneAtual =
                    aesCryptoUtil.decrypt(usuario.getTelefone());

            // Evita recriptografar um telefone não alterado.
            if (!telefone.equals(telefoneAtual)) {

                String telefoneHash =
                        hmacCryptoUtil.gerarHash(telefone);

                // Verifica telefone usado por outro usuário.
                if (usuarioRepository
                        .existsByTelefoneHashAndIdUsuarioNot(
                                telefoneHash, id)) {

                    throw new ConflitoException(
                            "Telefone já cadastrado por outro usuário."
                    );
                }

                // Atualiza o telefone criptografado.
                usuario.setTelefone(
                        aesCryptoUtil.encrypt(telefone)
                );

                usuario.setTelefoneHash(telefoneHash);
            }
        }

        // O CPF e seu hash nunca são alterados.
        // A função também não é alterada pelo usuário.
        String fotoAntiga = usuario.getFotoPerfil();
        String novaFotoSalva = null;

        // Salva uma nova foto, se enviada.
        if (novaFoto != null && !novaFoto.isEmpty()) {

            novaFotoSalva =
                    fileStorageService.salvarArquivo(novaFoto);

            usuario.setFotoPerfil(novaFotoSalva);
            usuario.setFotoAlt(
                    gerarFotoAlt(usuario.getNome())
            );

        } else if (fotoAntiga != null
                && !fotoAntiga.isBlank()) {

            usuario.setFotoAlt(
                    gerarFotoAlt(usuario.getNome())
            );

        } else {
            usuario.setFotoAlt(null);
        }

        try {

            Usuario usuarioAtualizado =
                    usuarioRepository.save(usuario);

            // Invalida as sessões quando o e-mail é alterado.
            if (!emailAnterior.equalsIgnoreCase(
                    usuarioAtualizado.getEmail())) {

                // Executa somente após confirmar a transação.
                TransactionSynchronizationManager
                        .registerSynchronization(
                            new TransactionSynchronization() {

                                @Override
                                public void afterCommit() {

                                    for (SessionInformation sessao :
                                            sessionRegistry.getAllSessions(
                                                    emailAnterior,
                                                    false)) {

                                        sessao.expireNow();
                                    }
                                }
                            }
                        );
            }

            // Remove a foto antiga somente depois
            // que o novo registro foi salvo.
            if (novaFotoSalva != null
                    && fotoAntiga != null
                    && !fotoAntiga.isBlank()) {

                fileStorageService.deletarArquivo(fotoAntiga);
            }

            return converterParaDTO(usuarioAtualizado);

        } catch (RuntimeException e) {

            // Remove a nova foto se o banco falhar.
            if (novaFotoSalva != null) {
                fileStorageService.deletarArquivo(novaFotoSalva);
            }

            throw e;
        }
    }
    
    // Altera a senha do usuário.
    @Transactional
    public void alterarSenha(Long id, AlterarSenhaDTO dto) {

        // Impede alterar a senha de outra conta.
        validarProprioUsuario(id);

        Usuario usuario = buscarUsuario(id);

        // Confere a senha atual.
        if (!passwordEncoder.matches(
                dto.senhaAtual(),
                usuario.getSenha())) {

            throw new IllegalArgumentException(
                    "A senha atual está incorreta."
            );
        }

        // Confere a nova senha.
        if (!dto.novaSenha().equals(dto.confirmarSenha())) {

            throw new IllegalArgumentException(
                    "A confirmação da nova senha não confere."
            );
        }

        // Gera um novo hash.
        usuario.setSenha(
                passwordEncoder.encode(dto.novaSenha())
        );

        usuarioRepository.save(usuario);

        // Guarda o e-mail usado para identificar as sessões.
        String emailUsuario = usuario.getEmail();

        // Expira as sessões somente após confirmar
        // a alteração da senha no banco de dados.
        TransactionSynchronizationManager.registerSynchronization(
                new TransactionSynchronization() {

                    @Override
                    public void afterCommit() {

                        for (SessionInformation sessao :
                                sessionRegistry.getAllSessions(
                                        emailUsuario,
                                        false)) {

                            sessao.expireNow();
                        }
                    }
                }
        );
    }

    // Promove um usuário comum a administrador.
    @PreAuthorize("hasRole('MASTER')")
    @Transactional
    public UsuarioResponseDTO promoverParaAdministrador(Long id) {

        Usuario master = validarMaster();
        Usuario usuario = buscarUsuario(id);

        // O MASTER não pode promover a própria conta.
        if (master.getIdUsuario().equals(usuario.getIdUsuario())) {
            throw new ConflitoException("A conta MASTER não pode ser promovida.");
        }

        // Somente usuários comuns podem ser promovidos.
        if (!FUNCAO_USUARIO.equalsIgnoreCase( usuario.getFuncao().getNome())) {
            throw new ConflitoException("Somente usuários com função USUARIO " + "podem ser promovidos a ADMINISTRADOR.");
        }

        Funcao funcaoAdministrador = funcaoRepository.findByNome(FUNCAO_ADMINISTRADOR).orElseThrow(() -> new IllegalStateException("A função ADMINISTRADOR não foi encontrada."));

        // Altera somente a função do usuário.
        usuario.setFuncao(funcaoAdministrador);

        Usuario usuarioAtualizado = usuarioRepository.save(usuario);
        Long idMaster = master.getIdUsuario();
        Long idPromovido = usuarioAtualizado.getIdUsuario();

        // Registra a operação no log após o commit.
        TransactionSynchronizationManager.registerSynchronization(
            new TransactionSynchronization() {

                @Override
                public void afterCommit() {
                    logger.info("Usuário {} promovido de USUARIO para " + "ADMINISTRADOR pelo MASTER {}.", idPromovido, idMaster);
                }
            }
        );

        return converterParaDTO(usuarioAtualizado);
    }

    // Remove um usuário.
    @Transactional
    public void deletar(Long id) {

        // Impede excluir outra conta.
        validarProprioUsuario(id);

        Usuario usuario = buscarUsuario(id);

        // Impede a exclusão da única conta MASTER.
        if (FUNCAO_MASTER.equalsIgnoreCase(usuario.getFuncao().getNome())) {

            throw new AccessDeniedException("A conta MASTER não pode ser excluída.");
        }

        // Remove a foto antes do registro.
        if (usuario.getFotoPerfil() != null && !usuario.getFotoPerfil().isBlank()) {
            fileStorageService.deletarArquivo(usuario.getFotoPerfil());
        }

        usuarioRepository.delete(usuario);
    }

    // Retorna o usuário autenticado ou bloqueia o acesso.
    private Usuario obterUsuarioAutenticado() {

        Authentication autenticacao = SecurityContextHolder.getContext().getAuthentication();

        if (autenticacao == null || !autenticacao.isAuthenticated() || "anonymousUser".equals(autenticacao.getPrincipal())) {
            throw new AccessDeniedException("É necessário entrar na conta.");
        }

        return usuarioRepository.findByEmail(autenticacao.getName()).orElseThrow(() -> new AccessDeniedException("A sessão não possui um usuário válido."));
    }

    // Confirma que a conta pertence ao usuário autenticado.
    private void validarProprioUsuario(Long id) {

        Usuario usuarioAutenticado = obterUsuarioAutenticado();

        if (!usuarioAutenticado.getIdUsuario().equals(id)) {
            throw new AccessDeniedException("Você não tem permissão para alterar esta conta.");
        }
    }

    // Permite consultar a própria conta ou acessar como MASTER.
    private void validarProprioUsuarioOuMaster(Long id) {

        Usuario usuarioAutenticado = obterUsuarioAutenticado();
        boolean proprioUsuario = usuarioAutenticado.getIdUsuario().equals(id);
        boolean master = FUNCAO_MASTER.equalsIgnoreCase(usuarioAutenticado.getFuncao().getNome());

        if (!proprioUsuario && !master) {
            throw new AccessDeniedException("Você não tem permissão para consultar esta conta.");
        }
    }

    // Confirma a função MASTER no banco e na sessão.
    private Usuario validarMaster() {

        Authentication autenticacao = SecurityContextHolder.getContext().getAuthentication();
        Usuario usuarioAutenticado = obterUsuarioAutenticado();
        boolean funcaoNoBanco = FUNCAO_MASTER.equalsIgnoreCase(usuarioAutenticado.getFuncao().getNome());
        boolean permissaoNaSessao = autenticacao != null && autenticacao.getAuthorities().stream().anyMatch(autoridade -> "ROLE_MASTER".equals(autoridade.getAuthority()));

        if (!funcaoNoBanco || !permissaoNaSessao) {
            throw new AccessDeniedException("Somente o MASTER pode realizar esta operação.");
        }

        return usuarioAutenticado;
    }

    // Busca um usuário ou lança 404.
    private Usuario buscarUsuario(Long id) {
        return usuarioRepository.findById(id).orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado com ID: " + id));
    }

    // Mantém somente os números.
    private String normalizarDigitos(String valor) {

        if (valor == null) {
            return null;
        }

        return valor.replaceAll("\\D", "");
    }

    // Gera o texto alternativo da foto.
    private String gerarFotoAlt(String nome) {

        if (nome == null || nome.isBlank()) {
            return null;
        }

        return "Foto de perfil de " + nome;
    }

    // Converte entidade para DTO de resposta.
    private UsuarioResponseDTO converterParaDTO(Usuario usuario) {
        return new UsuarioResponseDTO(usuario.getIdUsuario(), usuario.getNome(), usuario.getEmail(), usuario.getFotoPerfil(), usuario.getFotoAlt(), usuario.getFuncao().getNome());
    }

    // Busca a entidade do próprio usuário autenticado.
    @Transactional(readOnly = true)
    public Usuario buscarEntidadePorId(Long id) {

        // Confirma que o usuário autenticado é o proprietário.
        validarProprioUsuario(id);

        // Reutiliza a busca existente.
        return buscarUsuario(id);
    }
}