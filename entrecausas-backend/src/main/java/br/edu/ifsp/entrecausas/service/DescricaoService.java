package br.edu.ifsp.entrecausas.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import br.edu.ifsp.entrecausas.dto.DescricaoRequestDTO;
import br.edu.ifsp.entrecausas.dto.DescricaoResponseDTO;
import br.edu.ifsp.entrecausas.entity.Descricao;
import br.edu.ifsp.entrecausas.entity.Ong;
import br.edu.ifsp.entrecausas.exception.RecursoNaoEncontradoException;
import br.edu.ifsp.entrecausas.repository.DescricaoRepository;
import br.edu.ifsp.entrecausas.repository.OngRepository;

@Service
public class DescricaoService {

    private final DescricaoRepository descricaoRepository;
    private final OngRepository ongRepository;

    // Injeção de dependências realizada via construtor.
    public DescricaoService(
            DescricaoRepository descricaoRepository,
            OngRepository ongRepository) {

        this.descricaoRepository = descricaoRepository;
        this.ongRepository = ongRepository;
    }

    // Cadastra uma nova descrição.
    public DescricaoResponseDTO cadastrar(
            DescricaoRequestDTO dto) {

        // Verifica se a ONG existe.
        Ong ong = buscarOng(dto.idOng());

        // Cria a entidade de descrição.
        Descricao descricao = new Descricao();

        descricao.setTexto(dto.texto());
        descricao.setTipoDescricao(
            dto.tipoDescricao().toUpperCase()
        );
        descricao.setOng(ong);

        // Salva a descrição.
        Descricao descricaoSalva =
            descricaoRepository.save(descricao);

        return converterParaDTO(descricaoSalva);
    }

    // Lista todas as descrições cadastradas.
    public List<DescricaoResponseDTO> listarTodas() {

        return descricaoRepository.findAll()
            .stream()
            .map(this::converterParaDTO)
            .collect(Collectors.toList());
    }

    // Busca uma descrição pelo ID.
    public DescricaoResponseDTO buscarPorId(Long id) {

        Descricao descricao = buscarEntidadePorId(id);

        return converterParaDTO(descricao);
    }

    // Lista todas as descrições de uma ONG.
    public List<DescricaoResponseDTO> listarPorOng(
            Long idOng) {

        // Verifica se a ONG existe.
        buscarOng(idOng);

        return descricaoRepository.findByOngIdOng(idOng)
            .stream()
            .map(this::converterParaDTO)
            .collect(Collectors.toList());
    }

    // Atualiza uma descrição existente.
    public DescricaoResponseDTO atualizar(
            Long id,
            DescricaoRequestDTO dto) {

        // Localiza a descrição.
        Descricao descricao = buscarEntidadePorId(id);

        // Verifica se a ONG informada existe.
        Ong ong = buscarOng(dto.idOng());

        // Atualiza os dados da descrição.
        descricao.setTexto(dto.texto());
        descricao.setTipoDescricao(
            dto.tipoDescricao().toUpperCase()
        );
        descricao.setOng(ong);

        // Salva a atualização.
        Descricao descricaoAtualizada =
            descricaoRepository.save(descricao);

        return converterParaDTO(descricaoAtualizada);
    }

    // Remove uma descrição pelo ID.
    public void deletar(Long id) {

        Descricao descricao = buscarEntidadePorId(id);

        descricaoRepository.delete(descricao);
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

    // Busca uma descrição ou lança uma exceção 404.
    private Descricao buscarEntidadePorId(Long id) {

        return descricaoRepository.findById(id)
            .orElseThrow(() ->
                new RecursoNaoEncontradoException(
                    "Descrição não encontrada com o ID: " + id
                )
            );
    }

    // Converte a entidade para o DTO de resposta.
    private DescricaoResponseDTO converterParaDTO(
            Descricao descricao) {

        return new DescricaoResponseDTO(
            descricao.getIdDescricao(),
            descricao.getTexto(),
            descricao.getTipoDescricao(),
            descricao.getOng().getIdOng()
        );
    }
}