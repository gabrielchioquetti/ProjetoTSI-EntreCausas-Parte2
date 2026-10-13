package br.edu.ifsp.entrecausas.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import br.edu.ifsp.entrecausas.dto.OngRequestDTO;
import br.edu.ifsp.entrecausas.dto.OngResponseDTO;
import br.edu.ifsp.entrecausas.entity.Categoria;
import br.edu.ifsp.entrecausas.entity.Descricao;
import br.edu.ifsp.entrecausas.entity.Endereco;
import br.edu.ifsp.entrecausas.entity.Imagem;
import br.edu.ifsp.entrecausas.entity.Ong;
import br.edu.ifsp.entrecausas.entity.OngCategoria;
import br.edu.ifsp.entrecausas.entity.Solicitacao;
import br.edu.ifsp.entrecausas.entity.StatusSolicitacao;
import br.edu.ifsp.entrecausas.entity.Usuario;
import br.edu.ifsp.entrecausas.exception.ConflitoException;
import br.edu.ifsp.entrecausas.exception.RecursoNaoEncontradoException;
import br.edu.ifsp.entrecausas.repository.CategoriaRepository;
import br.edu.ifsp.entrecausas.repository.OngRepository;
import br.edu.ifsp.entrecausas.repository.SolicitacaoRepository;
import br.edu.ifsp.entrecausas.repository.StatusSolicitacaoRepository;
import br.edu.ifsp.entrecausas.repository.UsuarioRepository;
import br.edu.ifsp.entrecausas.security.AesCryptoUtil;
import br.edu.ifsp.entrecausas.security.HmacCryptoUtil;

@Service
public class OngService {

    private final OngRepository ongRepository;
    private final UsuarioRepository usuarioRepository;
    private final CategoriaRepository categoriaRepository;
    private final SolicitacaoRepository solicitacaoRepository;
    private final StatusSolicitacaoRepository statusSolicitacaoRepository;
    private final AesCryptoUtil aesCryptoUtil;
    private final HmacCryptoUtil hmacCryptoUtil;
    private final FileStorageService fileStorageService;

    // Injeção de dependências realizada via construtor.
    public OngService(
            OngRepository ongRepository,
            UsuarioRepository usuarioRepository,
            AesCryptoUtil aesCryptoUtil,
            HmacCryptoUtil hmacCryptoUtil,
            CategoriaRepository categoriaRepository,
            FileStorageService fileStorageService,
            SolicitacaoRepository solicitacaoRepository,
            StatusSolicitacaoRepository statusSolicitacaoRepository) {

        this.ongRepository = ongRepository;
        this.usuarioRepository = usuarioRepository;
        this.aesCryptoUtil = aesCryptoUtil;
        this.hmacCryptoUtil = hmacCryptoUtil;
        this.categoriaRepository = categoriaRepository;
        this.fileStorageService = fileStorageService;
        this.solicitacaoRepository = solicitacaoRepository;
        this.statusSolicitacaoRepository = statusSolicitacaoRepository;
    }

    // Cadastra uma ONG com os dados das três etapas.
    @Transactional
    public OngResponseDTO cadastrar(
            String emailUsuario,
            String nome,
            String cnpjInformado,
            String telefoneInformado,
            String instagram,
            String descricaoCurta,
            String descricaoCompleta,
            List<Long> categoriasIds,
            String cep,
            String logradouro,
            String numero,
            String complemento,
            String bairro,
            String cidade,
            String estado,
            List<MultipartFile> imagens) {

        // Valida os campos obrigatórios.
        validarObrigatorio(nome, "Informe o nome da ONG.");
        validarObrigatorio(cnpjInformado, "Informe o CNPJ.");
        validarObrigatorio(telefoneInformado, "Informe o telefone.");
        validarObrigatorio(descricaoCurta, "Informe a descrição curta.");
        validarObrigatorio(
            descricaoCompleta,
            "Informe a descrição completa."
        );
        validarObrigatorio(cep, "Informe o CEP.");
        validarObrigatorio(logradouro, "Informe o logradouro.");
        validarObrigatorio(numero, "Informe o número.");
        validarObrigatorio(bairro, "Informe o bairro.");
        validarObrigatorio(cidade, "Informe a cidade.");
        validarObrigatorio(estado, "Informe o estado.");

        if (nome.trim().length() > 150) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "O nome da ONG deve ter no máximo 150 caracteres."
            );
        }

        // Normaliza os documentos antes da criptografia.
        String cnpj = normalizarDocumento(cnpjInformado);
        String telefone = normalizarTelefone(telefoneInformado);

        validarCnpj(cnpj);

        if (!telefone.matches("\\d{10,11}")) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Informe um telefone válido com DDD."
            );
        }

        // O CEP deve conter oito dígitos.
        String cepNormalizado = cep.replaceAll("\\D", "");

        if (!cepNormalizado.matches("\\d{8}")) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Informe um CEP válido."
            );
        }

        // O estado deve conter a sigla com duas letras.
        String uf = estado.trim().toUpperCase();

        if (!uf.matches("[A-Z]{2}")) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Informe uma sigla de estado válida."
            );
        }

        // Gera hashes determinísticos para verificar duplicidade.
        String cnpjHash = hmacCryptoUtil.gerarHash(cnpj);
        String telefoneHash = hmacCryptoUtil.gerarHash(telefone);

        if (ongRepository.existsByCnpjHash(cnpjHash)) {
            throw new ConflitoException(
                "O CNPJ informado já está cadastrado."
            );
        }

        if (ongRepository.existsByTelefoneHash(telefoneHash)) {
            throw new ConflitoException(
                "O telefone informado já está cadastrado."
            );
        }

        // Obtém o usuário pela sessão autenticada.
        Usuario usuario = usuarioRepository.findByEmail(emailUsuario)
            .orElseThrow(() ->
                new RecursoNaoEncontradoException(
                    "Usuário autenticado não encontrado."
                )
            );

        // Um usuário pode gerenciar somente uma ONG.
        if (ongRepository.existsByUsuarioIdUsuario(
                usuario.getIdUsuario())) {

            throw new ConflitoException(
                "Sua conta já possui uma ONG cadastrada."
            );
        }

        // Confere as categorias existentes no banco.
        if (categoriasIds == null || categoriasIds.isEmpty()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Selecione pelo menos uma categoria."
            );
        }

        Set<Long> idsUnicos = new HashSet<>(categoriasIds);

        if (idsUnicos.contains(null)
                || idsUnicos.size() != categoriasIds.size()) {

            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "A lista de categorias contém valores inválidos ou repetidos."
            );
        }

        List<Categoria> categorias =
            categoriaRepository.findAllById(idsUnicos);

        if (categorias.size() != idsUnicos.size()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Uma ou mais categorias selecionadas não existem."
            );
        }

        // Exige de três a cinco imagens.
        if (imagens == null
                || imagens.size() < 3
                || imagens.size() > 5
                || imagens.stream().anyMatch(
                    arquivo -> arquivo == null || arquivo.isEmpty())) {

            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Envie de três a cinco imagens."
            );
        }

        // Busca o status existente antes de salvar os arquivos.
        StatusSolicitacao statusPendente =
            statusSolicitacaoRepository.findByNome("PENDENTE")
                .orElseThrow(() ->
                    new RecursoNaoEncontradoException(
                        "O status PENDENTE não está cadastrado."
                    )
                );

        // Registra os arquivos para removê-los se o cadastro falhar.
        List<String> arquivosSalvos = new ArrayList<>();

        try {
            // Cria a ONG com os dados básicos.
            Ong ong = new Ong();

            ong.setNome(nome.trim());
            ong.setCnpj(aesCryptoUtil.encrypt(cnpj));
            ong.setCnpjHash(cnpjHash);
            ong.setTelefone(aesCryptoUtil.encrypt(telefone));
            ong.setTelefoneHash(telefoneHash);
            ong.setInstagram(
                instagram == null || instagram.isBlank()
                    ? null
                    : instagram.trim()
            );
            ong.setUsuario(usuario);

            // Salva a descrição curta.
            Descricao resumo = new Descricao();
            resumo.setTipoDescricao("RESUMO");
            resumo.setTexto(descricaoCurta.trim());
            ong.addDescricao(resumo);

            // Salva a descrição completa.
            Descricao sobre = new Descricao();
            sobre.setTipoDescricao("SOBRE");
            sobre.setTexto(descricaoCompleta.trim());
            ong.addDescricao(sobre);

            // Cria o endereço e vincula os dois lados.
            Endereco endereco = new Endereco();
            endereco.setCep(cepNormalizado);
            endereco.setLogradouro(logradouro.trim());
            endereco.setNumero(numero.trim());
            endereco.setComplemento(
                complemento == null || complemento.isBlank()
                    ? null
                    : complemento.trim()
            );
            endereco.setBairro(bairro.trim());
            endereco.setCidade(cidade.trim());
            endereco.setEstado(uf);

            ong.setEndereco(endereco);

            // Associa as categorias existentes.
            for (Categoria categoria : categorias) {
                OngCategoria associacao = new OngCategoria();
                associacao.setCategoria(categoria);
                ong.addCategoria(associacao);
            }

            // Salva as imagens e registra os caminhos no banco.
            for (int i = 0; i < imagens.size(); i++) {
                String nomeArquivo =
                    fileStorageService.salvarArquivo(imagens.get(i));

                arquivosSalvos.add(nomeArquivo);

                Imagem imagem = new Imagem();
                imagem.setCaminho("/uploads/" + nomeArquivo);

                String textoAlternativo =
                    "Imagem " + (i + 1) + " da ONG " + nome.trim();

                imagem.setTextoAlternativo(
                    textoAlternativo.length() > 255
                        ? textoAlternativo.substring(0, 255)
                        : textoAlternativo
                );

                ong.addImagem(imagem);
            }

            // Persiste a ONG e os relacionamentos na transação.
            Ong ongSalva = ongRepository.saveAndFlush(ong);

            // Cria a solicitação de análise da ONG.
            // O administrador e os dados de análise ficam vazios.
            Solicitacao solicitacao = new Solicitacao(
                ongSalva,
                usuario,
                statusPendente
            );

            // Persiste a solicitação na mesma transação.
            solicitacaoRepository.save(solicitacao);

            return converterParaDTO(ongSalva);

        } catch (RuntimeException e) {
            // Remove arquivos se o cadastro não for concluído.
            for (String nomeArquivo : arquivosSalvos) {
                try {
                    fileStorageService.deletarArquivo(nomeArquivo);
                } catch (RuntimeException erroRemocao) {
                    e.addSuppressed(erroRemocao);
                }
            }

            throw e;
        }
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
                cnpjHash, id)) {

            throw new ConflitoException(
                "O CNPJ informado já está cadastrado em outra ONG."
            );
        }

        // Verifica telefone em outra ONG.
        if (ongRepository.existsByTelefoneHashAndIdOngNot(
                telefoneHash, id)) {

            throw new ConflitoException(
                "O telefone informado já está cadastrado em outra ONG."
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

    // Valida um campo obrigatório.
    private void validarObrigatorio(String valor, String mensagem) {
        if (valor == null || valor.isBlank()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                mensagem
            );
        }
    }

    // Valida os dígitos verificadores do CNPJ.
    private void validarCnpj(String cnpj) {
        if (cnpj == null
                || !cnpj.matches("\\d{14}")
                || cnpj.chars().distinct().count() == 1) {

            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Informe um CNPJ válido."
            );
        }

        int[] pesosPrimeiro = {
            5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2
        };

        int[] pesosSegundo = {
            6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2
        };

        String base = cnpj.substring(0, 12);
        int primeiro = calcularDigitoCnpj(base, pesosPrimeiro);

        base += primeiro;
        int segundo = calcularDigitoCnpj(base, pesosSegundo);

        if (cnpj.charAt(12) - '0' != primeiro
                || cnpj.charAt(13) - '0' != segundo) {

            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Informe um CNPJ válido."
            );
        }
    }

    // Calcula um dígito verificador do CNPJ.
    private int calcularDigitoCnpj(String base, int[] pesos) {
        int soma = 0;

        for (int i = 0; i < pesos.length; i++) {
            soma += (base.charAt(i) - '0') * pesos[i];
        }

        int resto = soma % 11;
        return resto < 2 ? 0 : 11 - resto;
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
