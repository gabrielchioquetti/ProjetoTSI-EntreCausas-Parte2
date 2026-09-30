package br.edu.ifsp.entrecausas.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import br.edu.ifsp.entrecausas.dto.ImagemResponseDTO;
import br.edu.ifsp.entrecausas.entity.Imagem;
import br.edu.ifsp.entrecausas.entity.Ong;
import br.edu.ifsp.entrecausas.exception.ArquivoException;
import br.edu.ifsp.entrecausas.exception.RecursoNaoEncontradoException;
import br.edu.ifsp.entrecausas.repository.ImagemRepository;
import br.edu.ifsp.entrecausas.repository.OngRepository;

@Service
public class ImagemService {

    private final ImagemRepository imagemRepository;
    private final OngRepository ongRepository;
    private final FileStorageService fileStorageService;

    // Injeção de dependências realizada via construtor.
    public ImagemService(
            ImagemRepository imagemRepository,
            OngRepository ongRepository,
            FileStorageService fileStorageService) {

        this.imagemRepository = imagemRepository;
        this.ongRepository = ongRepository;
        this.fileStorageService = fileStorageService;
    }

    // Cadastra uma imagem e salva o arquivo físico.
    @Transactional
    public ImagemResponseDTO cadastrar(
            Long idOng,
            String textoAlternativo,
            MultipartFile arquivo) {

        // Verifica se a ONG existe.
        Ong ong = buscarOng(idOng);

        // Salva o arquivo fisicamente.
        String caminhoArquivo =
            fileStorageService.salvarArquivo(arquivo);

        try {

            // Cria a entidade da imagem.
            Imagem imagem = new Imagem();

            imagem.setCaminho(caminhoArquivo);
            imagem.setTextoAlternativo(textoAlternativo);
            imagem.setOng(ong);

            // Salva o registro no banco.
            Imagem imagemSalva =
                imagemRepository.save(imagem);

            return converterParaDTO(imagemSalva);

        } catch (Exception excecao) {

            // Remove o arquivo se o banco falhar.
            fileStorageService.deletarArquivo(caminhoArquivo);

            throw new ArquivoException(
                "Não foi possível cadastrar a imagem.",
                excecao
            );
        }
    }

    // Cadastra várias imagens de uma vez.
    @Transactional
    public List<ImagemResponseDTO> cadastrarEmLote(
            Long idOng,
            List<String> textosAlternativos,
            List<MultipartFile> arquivos) {

        if (arquivos == null || arquivos.isEmpty()) {
            throw new ArquivoException(
                "A lista de arquivos não pode estar vazia."
            );
        }

        // Verifica se a ONG existe.
        Ong ong = buscarOng(idOng);

        List<Imagem> imagensParaSalvar =
            new ArrayList<>();

        // Guarda os arquivos salvos para permitir
        // limpeza caso o banco falhe.
        List<String> caminhosSalvos =
            new ArrayList<>();

        try {

            for (int i = 0; i < arquivos.size(); i++) {

                MultipartFile arquivo = arquivos.get(i);

                String textoAlt =
                    textosAlternativos != null
                    && i < textosAlternativos.size()
                        ? textosAlternativos.get(i)
                        : null;

                // Salva fisicamente o arquivo.
                String caminhoArquivo =
                    fileStorageService.salvarArquivo(arquivo);

                caminhosSalvos.add(caminhoArquivo);

                // Cria a entidade da imagem.
                Imagem imagem = new Imagem();

                imagem.setCaminho(caminhoArquivo);
                imagem.setTextoAlternativo(textoAlt);
                imagem.setOng(ong);

                imagensParaSalvar.add(imagem);
            }

            // Salva todos os registros no banco.
            List<Imagem> imagensSalvas =
                imagemRepository.saveAll(imagensParaSalvar);

            return imagensSalvas
                .stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());

        } catch (Exception excecao) {

            // Remove os arquivos se o banco falhar.
            for (String caminho : caminhosSalvos) {
                fileStorageService.deletarArquivo(caminho);
            }

            throw new ArquivoException(
                "Não foi possível cadastrar as imagens.",
                excecao
            );
        }
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
    @Transactional
    public ImagemResponseDTO atualizar(
            Long id,
            Long idOng,
            String textoAlternativo,
            MultipartFile novoArquivo) {

        // Localiza a imagem.
        Imagem imagem = buscarEntidadePorId(id);

        // Verifica se a ONG existe.
        Ong ong = buscarOng(idOng);

        // Guarda o caminho antigo.
        String caminhoAntigo = imagem.getCaminho();

        // Guarda o caminho do novo arquivo.
        String novoCaminho = null;

        try {

            // Salva o novo arquivo antes de alterar
            // o caminho da imagem no banco.
            if (novoArquivo != null
                    && !novoArquivo.isEmpty()) {

                novoCaminho =
                    fileStorageService.salvarArquivo(
                        novoArquivo
                    );

                imagem.setCaminho(novoCaminho);
            }

            imagem.setTextoAlternativo(
                textoAlternativo
            );

            imagem.setOng(ong);

            // Persiste a atualização no banco.
            Imagem imagemAtualizada =
                imagemRepository.save(imagem);

            // Só remove o arquivo antigo depois
            // que a atualização foi salva.
            if (novoCaminho != null
                    && caminhoAntigo != null) {

                fileStorageService.deletarArquivo(
                    caminhoAntigo
                );
            }

            return converterParaDTO(imagemAtualizada);

        } catch (Exception excecao) {

            // Se o banco falhar, remove o novo arquivo.
            if (novoCaminho != null) {
                fileStorageService.deletarArquivo(
                    novoCaminho
                );
            }

            throw new ArquivoException(
                "Não foi possível atualizar a imagem.",
                excecao
            );
        }
    }

    // Remove a imagem do banco e do sistema de arquivos.
    @Transactional
    public void deletar(Long id) {

        // Localiza a imagem.
        Imagem imagem = buscarEntidadePorId(id);

        // Guarda o caminho para remover o arquivo.
        String caminhoArquivo = imagem.getCaminho();

        // Remove o registro do banco.
        imagemRepository.delete(imagem);

        // Remove o arquivo físico.
        if (caminhoArquivo != null) {
            fileStorageService.deletarArquivo(
                caminhoArquivo
            );
        }
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