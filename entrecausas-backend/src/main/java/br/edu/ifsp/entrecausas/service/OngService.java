package br.edu.ifsp.entrecausas.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import br.edu.ifsp.entrecausas.dto.OngRequestDTO;
import br.edu.ifsp.entrecausas.dto.OngResponseDTO;
import br.edu.ifsp.entrecausas.entity.Ong;
import br.edu.ifsp.entrecausas.entity.Usuario;
import br.edu.ifsp.entrecausas.exception.ConflitoException;
import br.edu.ifsp.entrecausas.exception.RecursoNaoEncontradoException;
import br.edu.ifsp.entrecausas.repository.OngRepository;
import br.edu.ifsp.entrecausas.repository.UsuarioRepository;
import br.edu.ifsp.entrecausas.security.AesCryptoUtil;
import br.edu.ifsp.entrecausas.security.HmacCryptoUtil;

@Service
public class OngService {

    private final OngRepository ongRepository;
    private final UsuarioRepository usuarioRepository;
    private final AesCryptoUtil aesCryptoUtil;
    private final HmacCryptoUtil hmacCryptoUtil;

    // Injeção de dependências realizada via construtor.
    public OngService(
            OngRepository ongRepository,
            UsuarioRepository usuarioRepository,
            AesCryptoUtil aesCryptoUtil,
            HmacCryptoUtil hmacCryptoUtil) {

        this.ongRepository = ongRepository;
        this.usuarioRepository = usuarioRepository;
        this.aesCryptoUtil = aesCryptoUtil;
        this.hmacCryptoUtil = hmacCryptoUtil;
    }

    // Cadastra uma nova ONG.
    public OngResponseDTO cadastrar(OngRequestDTO dto) {

        // Normaliza o CNPJ antes da criptografia e do HMAC.
        String cnpj = normalizarDocumento(dto.cnpj());

        // Normaliza o telefone antes da criptografia e do HMAC.
        String telefone = normalizarTelefone(dto.telefone());

        // Gera hashes determinísticos para verificar duplicidade.
        String cnpjHash = hmacCryptoUtil.gerarHash(cnpj);
        String telefoneHash = hmacCryptoUtil.gerarHash(telefone);

        // Verifica se o CNPJ já está cadastrado.
        if (ongRepository.existsByCnpjHash(cnpjHash)) {
            throw new ConflitoException(
                "O CNPJ informado já está cadastrado."
            );
        }

        // Verifica se o telefone já está cadastrado.
        if (ongRepository.existsByTelefoneHash(telefoneHash)) {
            throw new ConflitoException(
                "O telefone informado já está cadastrado."
            );
        }

        // Busca o usuário responsável pela ONG.
        Usuario usuario = usuarioRepository.findById(dto.idUsuario())
            .orElseThrow(() ->
                new RecursoNaoEncontradoException(
                    "Usuário não encontrado com o ID: "
                    + dto.idUsuario()
                )
            );

        // Um usuário pode gerenciar somente uma ONG.
        if (ongRepository.existsByUsuarioIdUsuario(
                dto.idUsuario())) {

            throw new ConflitoException(
                "O usuário informado já possui uma ONG cadastrada."
            );
        }

        // Cria a nova ONG.
        Ong ong = new Ong();

        ong.setNome(dto.nome());

        // Armazena o CNPJ criptografado.
        ong.setCnpj(aesCryptoUtil.encrypt(cnpj));

        // Armazena o HMAC do CNPJ para consultas.
        ong.setCnpjHash(cnpjHash);

        // Armazena o telefone criptografado.
        ong.setTelefone(aesCryptoUtil.encrypt(telefone));

        // Armazena o HMAC do telefone para consultas.
        ong.setTelefoneHash(telefoneHash);

        ong.setInstagram(dto.instagram());
        ong.setUsuario(usuario);

        // Salva a ONG no banco.
        Ong ongSalva = ongRepository.save(ong);

        return converterParaDTO(ongSalva);
    }

    // Lista todas as ONGs cadastradas.
    public List<OngResponseDTO> listarTodas() {

        return ongRepository.findAll()
            .stream()
            .map(this::converterParaDTO)
            .collect(Collectors.toList());
    }

    // Busca uma ONG pelo identificador.
    public OngResponseDTO buscarPorId(Long id) {

        Ong ong = buscarEntidadePorId(id);

        return converterParaDTO(ong);
    }

    // Atualiza uma ONG existente.
    public OngResponseDTO atualizar(
            Long id,
            OngRequestDTO dto) {

        // Localiza a ONG que será atualizada.
        Ong ong = buscarEntidadePorId(id);

        // Normaliza os dados antes da criptografia.
        String cnpj = normalizarDocumento(dto.cnpj());
        String telefone = normalizarTelefone(dto.telefone());

        // Gera os hashes dos novos dados.
        String cnpjHash = hmacCryptoUtil.gerarHash(cnpj);
        String telefoneHash = hmacCryptoUtil.gerarHash(telefone);

        // Verifica CNPJ em outra ONG.
        if (ongRepository.existsByCnpjHashAndIdOngNot(
                cnpjHash,
                id)) {

            throw new ConflitoException(
                "O CNPJ informado já está cadastrado "
                + "em outra ONG."
            );
        }

        // Verifica telefone em outra ONG.
        if (ongRepository.existsByTelefoneHashAndIdOngNot(
                telefoneHash,
                id)) {

            throw new ConflitoException(
                "O telefone informado já está cadastrado "
                + "em outra ONG."
            );
        }

        // Busca o novo usuário responsável.
        Usuario usuario = usuarioRepository.findById(dto.idUsuario())
            .orElseThrow(() ->
                new RecursoNaoEncontradoException(
                    "Usuário não encontrado com o ID: "
                    + dto.idUsuario()
                )
            );

        // Impede que um usuário gerencie duas ONGs.
        if (!usuario.getIdUsuario().equals(
                ong.getUsuario().getIdUsuario())
                && ongRepository.existsByUsuarioIdUsuario(
                    usuario.getIdUsuario())) {

            throw new ConflitoException(
                "O usuário informado já possui uma ONG cadastrada."
            );
        }

        // Atualiza os dados básicos.
        ong.setNome(dto.nome());
        ong.setInstagram(dto.instagram());

        // Atualiza o CNPJ criptografado.
        ong.setCnpj(aesCryptoUtil.encrypt(cnpj));
        ong.setCnpjHash(cnpjHash);

        // Atualiza o telefone criptografado.
        ong.setTelefone(aesCryptoUtil.encrypt(telefone));
        ong.setTelefoneHash(telefoneHash);

        // Atualiza o usuário responsável.
        ong.setUsuario(usuario);

        // Persiste as alterações.
        Ong ongAtualizada = ongRepository.save(ong);

        return converterParaDTO(ongAtualizada);
    }

    // Remove uma ONG.
    // Os relacionamentos configurados com cascade
    // também são removidos pelo JPA.
    public void deletar(Long id) {

        Ong ong = buscarEntidadePorId(id);

        ongRepository.delete(ong);
    }

    // Busca uma ONG ou lança uma exceção 404.
    private Ong buscarEntidadePorId(Long id) {

        return ongRepository.findById(id)
            .orElseThrow(() ->
                new RecursoNaoEncontradoException(
                    "ONG não encontrada com o ID: " + id
                )
            );
    }

    // Converte a entidade para o DTO de resposta.
    private OngResponseDTO converterParaDTO(Ong ong) {

        return new OngResponseDTO(
            ong.getIdOng(),
            ong.getNome(),
            aesCryptoUtil.decrypt(ong.getTelefone()),
            ong.getInstagram(),
            ong.getUsuario().getIdUsuario()
        );
    }

    // Remove máscaras e caracteres não numéricos.
    private String normalizarDocumento(String cnpj) {

        return cnpj.replaceAll("\\D", "");
    }

    // Remove máscaras e caracteres não numéricos.
    private String normalizarTelefone(String telefone) {

        return telefone.replaceAll("\\D", "");
    }
}