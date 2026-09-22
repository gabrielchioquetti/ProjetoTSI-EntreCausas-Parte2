package br.edu.ifsp.entrecausas.service;

import br.edu.ifsp.entrecausas.dto.FuncaoRequestDTO;
import br.edu.ifsp.entrecausas.dto.FuncaoResponseDTO;
import br.edu.ifsp.entrecausas.entity.Funcao;
import br.edu.ifsp.entrecausas.repository.FuncaoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FuncaoService {

    private final FuncaoRepository funcaoRepository;

    public FuncaoService(FuncaoRepository funcaoRepository) {
        this.funcaoRepository = funcaoRepository;
    }

    public List<FuncaoResponseDTO> listarTodas() {
        return funcaoRepository.findAll().stream()
                .map(FuncaoResponseDTO::new)
                .toList();
    }

    public Optional<FuncaoResponseDTO> buscarPorId(Integer id) {
        return funcaoRepository.findById(id)
                .map(FuncaoResponseDTO::new);
    }

    public FuncaoResponseDTO salvar(FuncaoRequestDTO dto) {
        Funcao funcao = new Funcao();
        funcao.setNomeCargo(dto.nomeCargo());
        funcao.setDescricao(dto.descricao());

        Funcao salva = funcaoRepository.save(funcao);
        return new FuncaoResponseDTO(salva);
    }

    public FuncaoResponseDTO atualizar(Integer id, FuncaoRequestDTO dto) {
        Optional<Funcao> funcaoExistente = funcaoRepository.findById(id);

        if (funcaoExistente.isPresent()) {
            Funcao funcao = funcaoExistente.get();

            funcao.setNomeCargo(dto.nomeCargo());
            funcao.setDescricao(dto.descricao());

            Funcao atualizada = funcaoRepository.save(funcao);
            return new FuncaoResponseDTO(atualizada);
        }

        return null;
    }

    public void excluir(Integer id) {
        funcaoRepository.deleteById(id);
    }
}