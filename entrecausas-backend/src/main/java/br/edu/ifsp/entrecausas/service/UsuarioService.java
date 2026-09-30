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

import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    // Função padrão para novos usuários.
    private static final String FUNCAO_USUARIO = "USUARIO";

    private final UsuarioRepository usuarioRepository;
    private final FuncaoRepository funcaoRepository;
    private final PasswordEncoder passwordEncoder;
    private final AesCryptoUtil aesCryptoUtil;
    private final HmacCryptoUtil hmacCryptoUtil;
    private final FileStorageService fileStorageService;

    // Injeta as dependências do serviço.
    public UsuarioService(
            UsuarioRepository usuarioRepository,
            FuncaoRepository funcaoRepository,
            PasswordEncoder passwordEncoder,
            AesCryptoUtil aesCryptoUtil,
            HmacCryptoUtil hmacCryptoUtil,
            FileStorageService fileStorageService) {

        this.usuarioRepository = usuarioRepository;
        this.funcaoRepository = funcaoRepository;
        this.passwordEncoder = passwordEncoder;
        this.aesCryptoUtil = aesCryptoUtil;
        this.hmacCryptoUtil = hmacCryptoUtil;
        this.fileStorageService = fileStorageService;
    }

    // Cadastra um novo usuário.
    @Transactional
    public UsuarioResponseDTO cadastrar(
            UsuarioRequestDTO dto,
            MultipartFile foto) {

        String cpf = normalizarDigitos(dto.cpf());
        String telefone = normalizarDigitos(dto.telefone());

        // Verifica se o e-mail já existe.
        if (usuarioRepository.existsByEmail(dto.email())) {
            throw new ConflitoException(
                "E-mail já cadastrado no sistema."
            );
        }

        String cpfHash =
            hmacCryptoUtil.gerarHash(cpf);

        String telefoneHash =
            hmacCryptoUtil.gerarHash(telefone);

        // Verifica se o CPF já existe.
        if (usuarioRepository.existsByCpfHash(cpfHash)) {
            throw new ConflitoException(
                "CPF já cadastrado no sistema."
            );
        }

        // Verifica se o telefone já existe.
        if (usuarioRepository.existsByTelefoneHash(
                telefoneHash)) {

            throw new ConflitoException(
                "Telefone já cadastrado no sistema."
            );
        }

        // Busca a função padrão.
        Funcao funcao = funcaoRepository
            .findByNome(FUNCAO_USUARIO)
            .orElseThrow(() ->
                new IllegalStateException(
                    "A função USUARIO não foi encontrada."
                )
            );

        Usuario usuario = new Usuario();

        usuario.setNome(dto.nome());
        usuario.setEmail(dto.email());

        // Armazena somente o hash da senha.
        usuario.setSenha(
            passwordEncoder.encode(dto.senha())
        );

        // Armazena o CPF criptografado.
        usuario.setCpf(
            aesCryptoUtil.encrypt(cpf)
        );

        usuario.setCpfHash(cpfHash);

        // Armazena o telefone criptografado.
        usuario.setTelefone(
            aesCryptoUtil.encrypt(telefone)
        );

        usuario.setTelefoneHash(telefoneHash);

        // A função é definida pelo backend.
        usuario.setFuncao(funcao);

        // Salva a foto, se enviada.
        String caminhoFoto = null;

        if (foto != null && !foto.isEmpty()) {

            caminhoFoto =
                fileStorageService.salvarArquivo(foto);

            usuario.setFotoPerfil(caminhoFoto);

            usuario.setFotoAlt(
                gerarFotoAlt(usuario.getNome())
            );
        }

        try {

            Usuario usuarioSalvo =
                usuarioRepository.save(usuario);

            return converterParaDTO(usuarioSalvo);

        } catch (RuntimeException e) {

            // Remove o arquivo se o banco falhar.
            if (caminhoFoto != null) {
                fileStorageService.deletarArquivo(
                    caminhoFoto
                );
            }

            throw e;
        }
    }

    // Lista todos os usuários.
    @Transactional(readOnly = true)
    public List<UsuarioResponseDTO> listarTodos() {

        return usuarioRepository.findAll()
            .stream()
            .map(this::converterParaDTO)
            .collect(Collectors.toList());
    }

    // Busca um usuário pelo ID.
    @Transactional(readOnly = true)
    public UsuarioResponseDTO buscarPorId(Long id) {

        Usuario usuario = buscarUsuario(id);

        return converterParaDTO(usuario);
    }

    // Atualiza os dados do perfil.
    @Transactional
    public UsuarioResponseDTO atualizar(
            Long id,
            UsuarioUpdateDTO dto,
            MultipartFile novaFoto) {

        Usuario usuario = buscarUsuario(id);

        String cpf = normalizarDigitos(dto.cpf());
        String telefone = normalizarDigitos(dto.telefone());

        // Verifica e-mail de outro usuário.
        if (!usuario.getEmail().equalsIgnoreCase(dto.email())
                && usuarioRepository.existsByEmail(dto.email())) {

            throw new ConflitoException(
                "E-mail já cadastrado por outro usuário."
            );
        }

        String cpfHash =
            hmacCryptoUtil.gerarHash(cpf);

        String telefoneHash =
            hmacCryptoUtil.gerarHash(telefone);

        // Verifica CPF usado por outro usuário.
        if (usuarioRepository
                .existsByCpfHashAndIdUsuarioNot(
                    cpfHash,
                    id)) {

            throw new ConflitoException(
                "CPF já cadastrado por outro usuário."
            );
        }

        // Verifica telefone usado por outro usuário.
        if (usuarioRepository
                .existsByTelefoneHashAndIdUsuarioNot(
                    telefoneHash,
                    id)) {

            throw new ConflitoException(
                "Telefone já cadastrado por outro usuário."
            );
        }

        usuario.setNome(dto.nome());
        usuario.setEmail(dto.email());

        // Atualiza o CPF criptografado.
        usuario.setCpf(
            aesCryptoUtil.encrypt(cpf)
        );

        usuario.setCpfHash(cpfHash);

        // Atualiza o telefone criptografado.
        usuario.setTelefone(
            aesCryptoUtil.encrypt(telefone)
        );

        usuario.setTelefoneHash(telefoneHash);

        // A função não é alterada pelo usuário.

        String fotoAntiga =
            usuario.getFotoPerfil();

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

            // Remove a foto antiga somente depois
            // que o novo registro foi salvo.
            if (novaFotoSalva != null
                    && fotoAntiga != null
                    && !fotoAntiga.isBlank()) {

                fileStorageService.deletarArquivo(
                    fotoAntiga
                );
            }

            return converterParaDTO(usuarioAtualizado);

        } catch (RuntimeException e) {

            // Remove a nova foto se o banco falhar.
            if (novaFotoSalva != null) {
                fileStorageService.deletarArquivo(
                    novaFotoSalva
                );
            }

            throw e;
        }
    }

    // Altera a senha do usuário.
    @Transactional
    public void alterarSenha(
            Long id,
            AlterarSenhaDTO dto) {

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
        if (!dto.novaSenha().equals(
                dto.confirmarSenha())) {

            throw new IllegalArgumentException(
                "A confirmação da nova senha não confere."
            );
        }

        // Gera um novo hash.
        usuario.setSenha(
            passwordEncoder.encode(
                dto.novaSenha()
            )
        );

        usuarioRepository.save(usuario);
    }

    // Remove um usuário.
    @Transactional
    public void deletar(Long id) {

        Usuario usuario = buscarUsuario(id);

        // Remove a foto antes do registro.
        if (usuario.getFotoPerfil() != null
                && !usuario.getFotoPerfil().isBlank()) {

            fileStorageService.deletarArquivo(
                usuario.getFotoPerfil()
            );
        }

        usuarioRepository.delete(usuario);
    }

    // Busca um usuário ou lança 404.
    private Usuario buscarUsuario(Long id) {

        return usuarioRepository.findById(id)
            .orElseThrow(() ->
                new RecursoNaoEncontradoException(
                    "Usuário não encontrado com ID: " + id
                )
            );
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
    private UsuarioResponseDTO converterParaDTO(
            Usuario usuario) {

        return new UsuarioResponseDTO(
            usuario.getIdUsuario(),
            usuario.getNome(),
            usuario.getEmail(),
            usuario.getFotoPerfil(),
            usuario.getFotoAlt(),
            usuario.getFuncao().getNome()
        );
    }
}