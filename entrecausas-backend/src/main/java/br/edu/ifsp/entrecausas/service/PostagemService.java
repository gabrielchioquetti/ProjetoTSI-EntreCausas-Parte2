package br.edu.ifsp.entrecausas.service;

import br.edu.ifsp.entrecausas.dto.OrganizacaoRequestDTO;
import br.edu.ifsp.entrecausas.dto.PostagemRequestDTO;
import br.edu.ifsp.entrecausas.dto.PostagemResponseDTO;
import br.edu.ifsp.entrecausas.entity.Organizacao;
import br.edu.ifsp.entrecausas.entity.Postagem;
import br.edu.ifsp.entrecausas.repository.OrganizacaoRepository;
import br.edu.ifsp.entrecausas.repository.PostagemRepository;
import jakarta.transaction.Transactional;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class PostagemService {

    private final PostagemRepository postagemRepository;
    private final OrganizacaoRepository organizacaoRepository;

    public PostagemService(PostagemRepository postagemRepository, OrganizacaoRepository organizacaoRepository) {
        this.postagemRepository = postagemRepository;
        this.organizacaoRepository = organizacaoRepository;
    }

    public List<PostagemResponseDTO> listarTodos() {
        return postagemRepository.findAll().stream()
                .map(PostagemResponseDTO::new)
                .toList();
    }

    public Optional<PostagemResponseDTO> buscarPorId(Integer id) {
        return postagemRepository.findById(id)
                .map(PostagemResponseDTO::new);
    }

    @Transactional
    public PostagemResponseDTO salvar(PostagemRequestDTO dto) {
        Postagem postagem = new Postagem();
        postagem.setTitulo(dto.titulo());
        postagem.setDescricao(dto.descricao());
        postagem.setLocalizacao(dto.localizacao());
        postagem.setCategoria(dto.categoria());
        postagem.setStatus("PENDENTE");
        postagem.setAtivo(false);
        postagem.setDataCriacao(LocalDate.now());

        OrganizacaoRequestDTO orgDto = dto.novaOrganizacao();
        String email = orgDto.emailResponsavel();

        // Busca ONG por e-mail ou instancia com o construtor exato da sua classe
        Organizacao organizacao = organizacaoRepository.findByEmailResponsavel(email)
            .orElseGet(() -> {
                Organizacao novaOrg = new Organizacao(
                    orgDto.nome(),
                    orgDto.nomeResponsavel(),
                    email,
                    orgDto.celularPrimario(),
                    orgDto.celularSecundario()
                );
                return organizacaoRepository.save(novaOrg);
            });

        postagem.setOrganizacao(organizacao);
        
        Postagem salva = postagemRepository.save(postagem);
        return new PostagemResponseDTO(salva);
    }

    public PostagemResponseDTO atualizar(Integer id, PostagemRequestDTO dto) {
        Optional<Postagem> postagemExistente = postagemRepository.findById(id);

        if (postagemExistente.isPresent()) {
            Postagem postagem = postagemExistente.get();

            postagem.setTitulo(dto.titulo());
            postagem.setDescricao(dto.descricao());
            postagem.setLocalizacao(dto.localizacao());
            postagem.setCategoria(dto.categoria());
            postagem.setStatus(dto.status());
            postagem.setDestaque(dto.destaque());
            postagem.setAtivo(dto.ativo());
            postagem.setLink(dto.link());
            postagem.setDataCriacao(dto.dataCriacao());
            postagem.setDataPublicacao(dto.dataPublicacao());
            postagem.setDataAtualizacao(dto.dataAtualizacao());

            if (dto.idOrganizacao() != null) {
                Organizacao organizacao = organizacaoRepository.getReferenceById(dto.idOrganizacao());
                postagem.setOrganizacao(organizacao);
            }

            Postagem atualizada = postagemRepository.save(postagem);
            return new PostagemResponseDTO(atualizada);
        }

        return null;
    }

    public void excluir(Integer id) {
        postagemRepository.deleteById(id);
    }
}