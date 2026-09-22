package br.edu.ifsp.entrecausas.service;

import br.edu.ifsp.entrecausas.dto.UsuarioRequestDTO;
import br.edu.ifsp.entrecausas.dto.UsuarioResponseDTO;
import br.edu.ifsp.entrecausas.entity.Funcao;
import br.edu.ifsp.entrecausas.entity.Usuario;
import br.edu.ifsp.entrecausas.repository.FuncaoRepository;
import br.edu.ifsp.entrecausas.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final FuncaoRepository funcaoRepository;

    public UsuarioService(UsuarioRepository usuarioRepository, FuncaoRepository funcaoRepository) {
        this.usuarioRepository = usuarioRepository;
        this.funcaoRepository = funcaoRepository;
    }

    public List<UsuarioResponseDTO> listarTodos() {
        return usuarioRepository.findAll().stream()
                .map(UsuarioResponseDTO::new)
                .toList();
    }

    public Optional<UsuarioResponseDTO> buscarPorId(Integer id) {
        return usuarioRepository.findById(id)
                .map(UsuarioResponseDTO::new);
    }

    public UsuarioResponseDTO salvar(UsuarioRequestDTO dto) {
        Usuario usuario = new Usuario();
        usuario.setNome(dto.nome());
        usuario.setTelefone(dto.telefone());
        usuario.setCelular(dto.celular());
        usuario.setEmail(dto.email());
        usuario.setCpf(dto.cpf());
        usuario.setDataCadastro(dto.dataCadastro());

        if (dto.idFuncao() != null) {
            Funcao funcao = funcaoRepository.getReferenceById(dto.idFuncao());
            usuario.setFuncao(funcao);
        }

        Usuario salvo = usuarioRepository.save(usuario);
        return new UsuarioResponseDTO(salvo);
    }

    public UsuarioResponseDTO atualizar(Integer id, UsuarioRequestDTO dto) {
        Optional<Usuario> usuarioExistente = usuarioRepository.findById(id);

        if (usuarioExistente.isPresent()) {
            Usuario usuario = usuarioExistente.get();

            usuario.setNome(dto.nome());
            usuario.setTelefone(dto.telefone());
            usuario.setCelular(dto.celular());
            usuario.setEmail(dto.email());
            usuario.setCpf(dto.cpf());
            usuario.setDataCadastro(dto.dataCadastro());

            if (dto.idFuncao() != null) {
                Funcao funcao = funcaoRepository.getReferenceById(dto.idFuncao());
                usuario.setFuncao(funcao);
            }

            Usuario atualizado = usuarioRepository.save(usuario);
            return new UsuarioResponseDTO(atualizado);
        }

        return null;
    }

    public void excluir(Integer id) {
        usuarioRepository.deleteById(id);
    }
}