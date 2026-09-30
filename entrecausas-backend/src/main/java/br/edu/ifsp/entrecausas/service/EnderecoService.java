package br.edu.ifsp.entrecausas.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import br.edu.ifsp.entrecausas.dto.EnderecoRequestDTO;
import br.edu.ifsp.entrecausas.dto.EnderecoResponseDTO;
import br.edu.ifsp.entrecausas.entity.Endereco;
import br.edu.ifsp.entrecausas.entity.Ong;
import br.edu.ifsp.entrecausas.exception.ConflitoException;
import br.edu.ifsp.entrecausas.exception.RecursoNaoEncontradoException;
import br.edu.ifsp.entrecausas.repository.EnderecoRepository;
import br.edu.ifsp.entrecausas.repository.OngRepository;

@Service
public class EnderecoService {

    private final EnderecoRepository enderecoRepository;
    private final OngRepository ongRepository;

    // Injeção de dependências realizada via construtor.
    public EnderecoService(
            EnderecoRepository enderecoRepository,
            OngRepository ongRepository) {

        this.enderecoRepository = enderecoRepository;
        this.ongRepository = ongRepository;
    }

    // Cadastra o endereço de uma ONG.
    public EnderecoResponseDTO cadastrar(
            EnderecoRequestDTO dto) {

        // Verifica se a ONG existe.
        Ong ong = buscarOng(dto.idOng());

        // Cada ONG pode possuir somente um endereço.
        if (enderecoRepository.existsByOngIdOng(dto.idOng())) {
            throw new ConflitoException(
                "A ONG informada já possui um endereço cadastrado."
            );
        }

        // Cria a entidade de endereço.
        Endereco endereco = new Endereco();

        endereco.setCep(dto.cep());
        endereco.setLogradouro(dto.logradouro());
        endereco.setNumero(dto.numero());
        endereco.setComplemento(dto.complemento());
        endereco.setBairro(dto.bairro());
        endereco.setCidade(dto.cidade());

        // Padroniza a UF em letras maiúsculas.
        endereco.setEstado(
            dto.estado().toUpperCase()
        );

        endereco.setOng(ong);

        // Salva o endereço.
        Endereco enderecoSalvo =
            enderecoRepository.save(endereco);

        return converterParaDTO(enderecoSalvo);
    }

    // Lista todos os endereços cadastrados.
    public List<EnderecoResponseDTO> listarTodos() {

        return enderecoRepository.findAll()
            .stream()
            .map(this::converterParaDTO)
            .collect(Collectors.toList());
    }

    // Busca um endereço pelo ID.
    public EnderecoResponseDTO buscarPorId(Long id) {

        Endereco endereco = buscarEntidadePorId(id);

        return converterParaDTO(endereco);
    }

    // Busca o endereço de uma ONG.
    public EnderecoResponseDTO buscarPorOng(Long idOng) {

        // Verifica se a ONG existe.
        buscarOng(idOng);

        Endereco endereco = enderecoRepository
            .findByOngIdOng(idOng)
            .orElseThrow(() ->
                new RecursoNaoEncontradoException(
                    "A ONG não possui endereço cadastrado."
                )
            );

        return converterParaDTO(endereco);
    }

    // Atualiza o endereço de uma ONG.
    public EnderecoResponseDTO atualizar(
            Long id,
            EnderecoRequestDTO dto) {

        // Localiza o endereço.
        Endereco endereco = buscarEntidadePorId(id);

        // Verifica se a ONG informada existe.
        Ong ong = buscarOng(dto.idOng());

        // Impede que o endereço seja transferido
        // para uma ONG que já possui outro endereço.
        if (!ong.getIdOng().equals(
                endereco.getOng().getIdOng())
                && enderecoRepository.existsByOngIdOng(
                    dto.idOng())) {

            throw new ConflitoException(
                "A ONG informada já possui um endereço cadastrado."
            );
        }

        // Atualiza os dados do endereço.
        endereco.setCep(dto.cep());
        endereco.setLogradouro(dto.logradouro());
        endereco.setNumero(dto.numero());
        endereco.setComplemento(dto.complemento());
        endereco.setBairro(dto.bairro());
        endereco.setCidade(dto.cidade());

        // Padroniza a UF em letras maiúsculas.
        endereco.setEstado(
            dto.estado().toUpperCase()
        );

        endereco.setOng(ong);

        // Salva a atualização.
        Endereco enderecoAtualizado =
            enderecoRepository.save(endereco);

        return converterParaDTO(enderecoAtualizado);
    }

    // Remove um endereço pelo ID.
    public void deletar(Long id) {

        Endereco endereco = buscarEntidadePorId(id);

        enderecoRepository.delete(endereco);
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

    // Busca um endereço ou lança uma exceção 404.
    private Endereco buscarEntidadePorId(Long id) {

        return enderecoRepository.findById(id)
            .orElseThrow(() ->
                new RecursoNaoEncontradoException(
                    "Endereço não encontrado com o ID: " + id
                )
            );
    }

    // Converte a entidade para o DTO de resposta.
    private EnderecoResponseDTO converterParaDTO(
            Endereco endereco) {

        return new EnderecoResponseDTO(
            endereco.getIdEndereco(),
            endereco.getCep(),
            endereco.getLogradouro(),
            endereco.getNumero(),
            endereco.getComplemento(),
            endereco.getBairro(),
            endereco.getCidade(),
            endereco.getEstado(),
            endereco.getOng().getIdOng()
        );
    }
}