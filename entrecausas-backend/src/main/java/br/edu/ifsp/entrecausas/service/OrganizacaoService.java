package br.edu.ifsp.entrecausas.service;

import br.edu.ifsp.entrecausas.dto.OrganizacaoRequestDTO;
import br.edu.ifsp.entrecausas.dto.OrganizacaoResponseDTO;
import br.edu.ifsp.entrecausas.entity.Organizacao;
import br.edu.ifsp.entrecausas.repository.OrganizacaoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrganizacaoService {

    private final OrganizacaoRepository organizacaoRepository;

    public OrganizacaoService(OrganizacaoRepository organizacaoRepository) {
        this.organizacaoRepository = organizacaoRepository;
    }

    public List<OrganizacaoResponseDTO> listarTodas() {
        return organizacaoRepository.findAll().stream()
                .map(OrganizacaoResponseDTO::new)
                .toList();
    }

    public Optional<OrganizacaoResponseDTO> buscarPorId(Integer id) {
        return organizacaoRepository.findById(id)
                .map(OrganizacaoResponseDTO::new);
    }

    public OrganizacaoResponseDTO salvar(OrganizacaoRequestDTO dto) {
        Organizacao organizacao = new Organizacao();
        organizacao.setNome(dto.nome());
        organizacao.setNomeResponsavel(dto.nomeResponsavel());
        organizacao.setEmailResponsavel(dto.emailResponsavel());
        organizacao.setCelularPrimario(dto.celularPrimario());
        organizacao.setCelularSecundario(dto.celularSecundario());

        Organizacao salva = organizacaoRepository.save(organizacao);
        return new OrganizacaoResponseDTO(salva);
    }

    public OrganizacaoResponseDTO atualizar(Integer id, OrganizacaoRequestDTO dto) {
        Optional<Organizacao> organizacaoExistente = organizacaoRepository.findById(id);

        if (organizacaoExistente.isPresent()) {
            Organizacao organizacao = organizacaoExistente.get();

            organizacao.setNome(dto.nome());
            organizacao.setNomeResponsavel(dto.nomeResponsavel());
            organizacao.setEmailResponsavel(dto.emailResponsavel());
            organizacao.setCelularPrimario(dto.celularPrimario());
            organizacao.setCelularSecundario(dto.celularSecundario());

            Organizacao atualizada = organizacaoRepository.save(organizacao);
            return new OrganizacaoResponseDTO(atualizada);
        }

        return null;
    }

    public void excluir(Integer id) {
        organizacaoRepository.deleteById(id);
    }
}