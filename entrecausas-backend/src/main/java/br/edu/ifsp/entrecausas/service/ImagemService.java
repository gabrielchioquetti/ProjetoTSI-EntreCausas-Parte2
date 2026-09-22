package br.edu.ifsp.entrecausas.service;

import br.edu.ifsp.entrecausas.dto.ImagemRequestDTO;
import br.edu.ifsp.entrecausas.dto.ImagemResponseDTO;
import br.edu.ifsp.entrecausas.entity.Imagem;
import br.edu.ifsp.entrecausas.entity.Postagem;
import br.edu.ifsp.entrecausas.repository.ImagemRepository;
import br.edu.ifsp.entrecausas.repository.PostagemRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ImagemService {

    private final ImagemRepository imagemRepository;
    private final PostagemRepository postagemRepository;

    public ImagemService(ImagemRepository imagemRepository, PostagemRepository postagemRepository) {
        this.imagemRepository = imagemRepository;
        this.postagemRepository = postagemRepository;
    }

    public List<ImagemResponseDTO> listarTodas() {
        return imagemRepository.findAll().stream()
                .map(ImagemResponseDTO::new)
                .toList();
    }

    public Optional<ImagemResponseDTO> buscarPorId(Integer id) {
        return imagemRepository.findById(id)
                .map(ImagemResponseDTO::new);
    }

    public ImagemResponseDTO salvar(ImagemRequestDTO dto) {
        Imagem imagem = new Imagem();
        imagem.setNome(dto.nome());
        imagem.setCaminho(dto.caminho());
        imagem.setDescricao(dto.descricao());
        imagem.setOrdem(dto.ordem());

        if (dto.idPostagem() != null) {
            Postagem postagem = postagemRepository.getReferenceById(dto.idPostagem());
            imagem.setPostagem(postagem);
        }

        Imagem salva = imagemRepository.save(imagem);
        return new ImagemResponseDTO(salva);
    }

    public ImagemResponseDTO atualizar(Integer id, ImagemRequestDTO dto) {
        Optional<Imagem> imagemExistente = imagemRepository.findById(id);

        if (imagemExistente.isPresent()) {
            Imagem imagem = imagemExistente.get();

            imagem.setNome(dto.nome());
            imagem.setCaminho(dto.caminho());
            imagem.setDescricao(dto.descricao());
            imagem.setOrdem(dto.ordem());

            if (dto.idPostagem() != null) {
                Postagem postagem = postagemRepository.getReferenceById(dto.idPostagem());
                imagem.setPostagem(postagem);
            }

            Imagem atualizada = imagemRepository.save(imagem);
            return new ImagemResponseDTO(atualizada);
        }

        return null;
    }

    public void excluir(Integer id) {
        imagemRepository.deleteById(id);
    }
}