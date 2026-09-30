package br.edu.ifsp.entrecausas.service;

import br.edu.ifsp.entrecausas.dto.CategoriaRequestDTO;
import br.edu.ifsp.entrecausas.dto.CategoriaResponseDTO;
import br.edu.ifsp.entrecausas.entity.Categoria;
import br.edu.ifsp.entrecausas.repository.CategoriaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

// Camada de serviço contendo as regras de negócio para o gerenciamento de categorias de ONGs
@Service
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    public CategoriaService(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    // Cadastra uma nova categoria no sistema com validação de duplicidade
    @Transactional
    public CategoriaResponseDTO cadastrar(CategoriaRequestDTO dto) {
        if (categoriaRepository.existsByNomeIgnoreCase(dto.nome())) {
            throw new IllegalArgumentException("Já existe uma categoria cadastrada com este nome.");
        }

        Categoria categoria = new Categoria();
        categoria.setNome(dto.nome().trim());

        Categoria categoriaSalva = categoriaRepository.save(categoria);
        return converterParaDTO(categoriaSalva);
    }

    // Retorna a lista de todas as categorias cadastradas
    @Transactional(readOnly = true)
    public List<CategoriaResponseDTO> listarTodas() {
        return categoriaRepository.findAll()
                .stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    // Busca uma categoria específica por seu ID
    @Transactional(readOnly = true)
    public CategoriaResponseDTO buscarPorId(Long id) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada com ID: " + id));
        return converterParaDTO(categoria);
    }

    // Atualiza os dados de uma categoria existente prevenindo conflitos de nomes duplicados
    @Transactional
    public CategoriaResponseDTO atualizar(Long id, CategoriaRequestDTO dto) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada com ID: " + id));

        // Valida se o novo nome já pertence a outra categoria
        if (!categoria.getNome().equalsIgnoreCase(dto.nome()) 
                && categoriaRepository.existsByNomeIgnoreCase(dto.nome())) {
            throw new IllegalArgumentException("Já existe outra categoria com este nome.");
        }

        categoria.setNome(dto.nome().trim());
        Categoria categoriaAtualizada = categoriaRepository.save(categoria);

        return converterParaDTO(categoriaAtualizada);
    }

    // Remove uma categoria do banco pelo ID
    @Transactional
    public void deletar(Long id) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada com ID: " + id));

        categoriaRepository.delete(categoria);
    }

    // Método privado utilitário para conversão da Entidade JPA para o DTO de resposta
    private CategoriaResponseDTO converterParaDTO(Categoria categoria) {
        return new CategoriaResponseDTO(
                categoria.getIdCategoria(),
                categoria.getNome()
        );
    }
}
