package br.edu.ifsp.entrecausas.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.edu.ifsp.entrecausas.dto.OngCategoriaRequestDTO;
import br.edu.ifsp.entrecausas.dto.OngCategoriaResponseDTO;
import br.edu.ifsp.entrecausas.entity.Categoria;
import br.edu.ifsp.entrecausas.entity.Ong;
import br.edu.ifsp.entrecausas.entity.OngCategoria;
import br.edu.ifsp.entrecausas.exception.ConflitoException;
import br.edu.ifsp.entrecausas.exception.RecursoNaoEncontradoException;
import br.edu.ifsp.entrecausas.repository.CategoriaRepository;
import br.edu.ifsp.entrecausas.repository.OngCategoriaRepository;
import br.edu.ifsp.entrecausas.repository.OngRepository;

// Camada de serviço contendo as regras de negócio
// para os vínculos entre ONGs e categorias.
@Service
public class OngCategoriaService {

    private final OngCategoriaRepository ongCategoriaRepository;
    private final OngRepository ongRepository;
    private final CategoriaRepository categoriaRepository;

    // Injeção de dependências realizada via construtor.
    public OngCategoriaService(
            OngCategoriaRepository ongCategoriaRepository,
            OngRepository ongRepository,
            CategoriaRepository categoriaRepository) {

        this.ongCategoriaRepository = ongCategoriaRepository;
        this.ongRepository = ongRepository;
        this.categoriaRepository = categoriaRepository;
    }

    // Associa uma categoria a uma ONG.
    @Transactional
    public OngCategoriaResponseDTO associar(
            OngCategoriaRequestDTO dto) {

        // Verifica se a ONG existe.
        Ong ong = buscarOng(dto.idOng());

        // Verifica se a categoria existe.
        Categoria categoria = buscarCategoria(
            dto.idCategoria()
        );

        // Impede vínculos duplicados.
        if (ongCategoriaRepository
                .existsByOngIdOngAndCategoriaIdCategoria(
                    dto.idOng(),
                    dto.idCategoria())) {

            throw new ConflitoException(
                "Esta ONG já possui esta categoria associada."
            );
        }

        // Cria o vínculo entre ONG e categoria.
        OngCategoria ongCategoria =
            new OngCategoria(ong, categoria);

        // Salva o vínculo.
        OngCategoria salva =
            ongCategoriaRepository.save(ongCategoria);

        return converterParaDTO(salva);
    }

    // Lista todas as categorias associadas a uma ONG.
    @Transactional(readOnly = true)
    public List<OngCategoriaResponseDTO> listarPorOng(
            Long idOng) {

        // Verifica se a ONG existe.
        buscarOng(idOng);

        return ongCategoriaRepository
            .findByOngIdOng(idOng)
            .stream()
            .map(this::converterParaDTO)
            .collect(Collectors.toList());
    }

    // Lista todas as ONGs associadas a uma categoria.
    @Transactional(readOnly = true)
    public List<OngCategoriaResponseDTO> listarPorCategoria(
            Long idCategoria) {

        // Verifica se a categoria existe.
        buscarCategoria(idCategoria);

        return ongCategoriaRepository
            .findByCategoriaIdCategoria(idCategoria)
            .stream()
            .map(this::converterParaDTO)
            .collect(Collectors.toList());
    }

    // Remove uma associação pelo ID do vínculo.
    @Transactional
    public void desassociar(Long idOngCategoria) {

        // Busca o vínculo existente.
        OngCategoria ongCategoria =
            ongCategoriaRepository.findById(idOngCategoria)
                .orElseThrow(() ->
                    new RecursoNaoEncontradoException(
                        "Associação ONG-Categoria não encontrada "
                        + "com o ID: "
                        + idOngCategoria
                    )
                );

        // Remove o vínculo.
        ongCategoriaRepository.delete(ongCategoria);
    }

    // Remove uma associação diretamente pela ONG e categoria.
    @Transactional
    public void desassociar(
            Long idOng,
            Long idCategoria) {

        // Verifica se a ONG existe.
        buscarOng(idOng);

        // Verifica se a categoria existe.
        buscarCategoria(idCategoria);

        // Verifica se o vínculo existe.
        if (!ongCategoriaRepository
                .existsByOngIdOngAndCategoriaIdCategoria(
                    idOng,
                    idCategoria)) {

            throw new RecursoNaoEncontradoException(
                "A associação entre a ONG e a categoria "
                + "não foi encontrada."
            );
        }

        // Remove o vínculo.
        ongCategoriaRepository
            .deleteByOngIdOngAndCategoriaIdCategoria(
                idOng,
                idCategoria
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

    // Busca uma categoria ou lança uma exceção 404.
    private Categoria buscarCategoria(Long idCategoria) {

        return categoriaRepository.findById(idCategoria)
            .orElseThrow(() ->
                new RecursoNaoEncontradoException(
                    "Categoria não encontrada com o ID: "
                    + idCategoria
                )
            );
    }

    // Converte a entidade para o DTO de resposta.
    private OngCategoriaResponseDTO converterParaDTO(
            OngCategoria ongCategoria) {

        return new OngCategoriaResponseDTO(
            ongCategoria.getIdOngCategoria(),
            ongCategoria.getOng().getIdOng(),
            ongCategoria.getOng().getNome(),
            ongCategoria.getCategoria().getIdCategoria(),
            ongCategoria.getCategoria().getNome()
        );
    }
}