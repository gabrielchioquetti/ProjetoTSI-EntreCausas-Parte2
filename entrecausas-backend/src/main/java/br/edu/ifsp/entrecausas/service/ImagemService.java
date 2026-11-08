package br.edu.ifsp.entrecausas.service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import br.edu.ifsp.entrecausas.dto.ImagemResponseDTO;

import br.edu.ifsp.entrecausas.entity.Imagem;
import br.edu.ifsp.entrecausas.entity.ImagemEdicaoPendente;
import br.edu.ifsp.entrecausas.entity.Ong;
import br.edu.ifsp.entrecausas.entity.Solicitacao;
import br.edu.ifsp.entrecausas.entity.Usuario;

import br.edu.ifsp.entrecausas.exception.RecursoNaoEncontradoException;

import br.edu.ifsp.entrecausas.repository.ImagemRepository;
import br.edu.ifsp.entrecausas.repository.ImagemEdicaoPendenteRepository;
import br.edu.ifsp.entrecausas.repository.OngRepository;
import br.edu.ifsp.entrecausas.repository.UsuarioRepository;

@Service
public class ImagemService {

    private final ImagemRepository imagemRepository;
    private final OngRepository ongRepository;
    private final ImagemEdicaoPendenteRepository imagemEdicaoPendenteRepository;
    private final UsuarioRepository usuarioRepository;
    private final FileStorageService fileStorageService;
    private final OngPublicacaoService ongPublicacaoService;

    // Injeção de dependências realizada via construtor.
    public ImagemService(
            ImagemRepository imagemRepository,
            OngRepository ongRepository,
            FileStorageService fileStorageService,
            ImagemEdicaoPendenteRepository imagemEdicaoPendenteRepository,
            UsuarioRepository usuarioRepository,
            OngPublicacaoService ongPublicacaoService) {

        this.imagemRepository = imagemRepository;
        this.ongRepository = ongRepository;
        this.fileStorageService = fileStorageService;
        this.imagemEdicaoPendenteRepository = imagemEdicaoPendenteRepository;
        this.usuarioRepository = usuarioRepository;
        this.ongPublicacaoService = ongPublicacaoService;
    }

    // Cadastra uma imagem e salva o arquivo físico.
    // Imagens de ONGs devem passar pelo fluxo de moderação.
    @Transactional
    public ImagemResponseDTO cadastrar(
            Long idOng,
            String textoAlternativo,
            MultipartFile arquivo) {

        throw new ResponseStatusException(
            HttpStatus.FORBIDDEN,
            "O cadastro de imagens deve ser realizado "
            + "pelo formulário da ONG e passar por análise administrativa."
        );
    }

    // Cadastra várias imagens de uma vez.
    // A inclusão deve ocorrer pelo cadastro ou edição da ONG.
    @Transactional
    public List<ImagemResponseDTO> cadastrarEmLote(
            Long idOng,
            List<String> textosAlternativos,
            List<MultipartFile> arquivos) {

        throw new ResponseStatusException(
            HttpStatus.FORBIDDEN,
            "O cadastro de imagens deve ser realizado "
            + "pelo formulário da ONG e passar por análise administrativa."
        );
    }

    // Lista todas as imagens cadastradas.
    @Transactional(readOnly = true)
    public List<ImagemResponseDTO> listarTodas() {

        return imagemRepository.findAll()
            .stream()
            .map(this::converterParaDTO)
            .collect(Collectors.toList());
    }

    // Busca uma imagem pelo ID.
    @Transactional(readOnly = true)
    public ImagemResponseDTO buscarPorId(Long id) {

        Imagem imagem = buscarEntidadePorId(id);

        return converterParaDTO(imagem);
    }

    // Lista todas as imagens de uma ONG.
    @Transactional(readOnly = true)
    public List<ImagemResponseDTO> listarPorOng(
            Long idOng) {

        // Verifica se a ONG existe.
        buscarOng(idOng);

        return imagemRepository.findByOngIdOng(idOng)
            .stream()
            .map(this::converterParaDTO)
            .collect(Collectors.toList());
    }

    // Atualiza os dados de uma imagem.
    // Se houver novo arquivo, substitui o anterior.
    // A atualização direta fica bloqueada pela moderação.
    @Transactional
    public ImagemResponseDTO atualizar(
            Long id,
            Long idOng,
            String textoAlternativo,
            MultipartFile novoArquivo) {

        throw new ResponseStatusException(
            HttpStatus.FORBIDDEN,
            "A atualização de imagens deve ser enviada "
            + "para análise administrativa."
        );
    }

    // Remove a imagem do banco e do sistema de arquivos.
    // A exclusão direta fica bloqueada pela moderação.
    @Transactional
    public void deletar(Long id) {

        throw new ResponseStatusException(
            HttpStatus.FORBIDDEN,
            "A exclusão de imagens deve ser enviada "
            + "para análise administrativa."
        );
    }

    // Verifica se o usuário pode visualizar o arquivo.
    @Transactional(readOnly = true)
    public void verificarAcesso(
            String nomeArquivo,
            Authentication authentication) {

        // Confirma que o nome segue o padrão do armazenamento.
        fileStorageService.obterTipoConteudo(nomeArquivo);

        boolean administrador =
            ehAdministrador(authentication);

        String caminho =
            "/uploads/" + nomeArquivo;

        // Verifica todos os tipos de vínculo antes de autorizar.
        Optional<Usuario> usuarioFoto =
            usuarioRepository.findByFotoPerfil(nomeArquivo);

        Optional<ImagemEdicaoPendente> imagemPendente =
            imagemEdicaoPendenteRepository
                .findByNomeArquivo(nomeArquivo);

        Optional<Imagem> imagemOng =
            imagemRepository.findByCaminho(caminho);

        // Compatibilidade com registros antigos.
        if (imagemOng.isEmpty()) {
            imagemOng =
                imagemRepository.findByCaminho(nomeArquivo);
        }

        // Um arquivo com vínculos conflitantes não é público.
        int quantidadeVinculos =
            (usuarioFoto.isPresent() ? 1 : 0)
            + (imagemPendente.isPresent() ? 1 : 0)
            + (imagemOng.isPresent() ? 1 : 0);

        if (quantidadeVinculos == 0) {

            negarAcesso();
        }

        if (quantidadeVinculos > 1) {

            // Impede que um vínculo público libere
            // um arquivo também registrado como privado.
            negarAcesso();
        }

        // Fotos de perfil são privadas.
        if (usuarioFoto.isPresent()) {

            if (administrador
                    || ehProprietario(
                        usuarioFoto.get(),
                        authentication)) {

                return;
            }

            negarAcesso();
        }

        // Imagens novas de edições pendentes são privadas.
        if (imagemPendente.isPresent()) {

            Solicitacao solicitacao =
                imagemPendente.get().getSolicitacao();

            if (!"EDICAO".equalsIgnoreCase(
                    solicitacao.getTipoSolicitacao())
                    || !"PENDENTE".equalsIgnoreCase(
                        solicitacao.getStatus().getNome())) {

                negarAcesso();
            }

            if (administrador
                    || ehProprietario(
                        solicitacao.getOng().getUsuario(),
                        authentication)) {

                return;
            }

            negarAcesso();
        }

        // Imagens vinculadas a ONGs aprovadas são públicas.
        if (imagemOng.isPresent()) {

            Ong ong = imagemOng.get().getOng();

            if (ongPublicacaoService.ongEstaAprovada(ong.getIdOng())) {
                return;
            }

            // ONGs ainda não publicadas são privadas.
            if (administrador
                    || ehProprietario(
                        ong.getUsuario(),
                        authentication)) {

                return;
            }
        }

        negarAcesso();
    }

    // Confere a identidade do responsável.
    private boolean ehProprietario(
            Usuario usuario,
            Authentication authentication) {

        return usuario != null
            && usuario.getEmail() != null
            && autenticado(authentication)
            && usuario.getEmail().equalsIgnoreCase(
                authentication.getName()
            );
    }

    // Confere a autoridade administrativa.
    private boolean ehAdministrador(
            Authentication authentication) {

        if (!autenticado(authentication)) {
            return false;
        }

        Set<String> autoridades =
            authentication.getAuthorities()
                .stream()
                .map(autoridade ->
                    autoridade.getAuthority().toUpperCase())
                .collect(Collectors.toSet());

        return autoridades.contains("ADMINISTRADOR")
            || autoridades.contains("ROLE_ADMINISTRADOR");
    }

    // Verifica se existe uma sessão autenticada.
    private boolean autenticado(
            Authentication authentication) {

        return authentication != null
            && authentication.isAuthenticated()
            && !(authentication
                instanceof org.springframework.security.authentication
                    .AnonymousAuthenticationToken);
    }

    // Responde com acesso negado.
    private void negarAcesso() {

        throw new ResponseStatusException(
            HttpStatus.FORBIDDEN,
            "Você não possui permissão para acessar este arquivo."
        );
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

    // Busca uma imagem ou lança uma exceção 404.
    private Imagem buscarEntidadePorId(Long id) {

        return imagemRepository.findById(id)
            .orElseThrow(() ->
                new RecursoNaoEncontradoException(
                    "Imagem não encontrada com o ID: "
                    + id
                )
            );
    }

    // Converte a entidade para o DTO de resposta.
    private ImagemResponseDTO converterParaDTO(
            Imagem imagem) {

        return new ImagemResponseDTO(
            imagem.getIdImagem(),
            imagem.getCaminho(),
            imagem.getTextoAlternativo(),
            imagem.getOng().getIdOng()
        );
    }
}