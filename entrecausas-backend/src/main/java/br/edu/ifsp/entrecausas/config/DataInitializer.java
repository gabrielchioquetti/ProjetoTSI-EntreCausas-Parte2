package br.edu.ifsp.entrecausas.config;

import br.edu.ifsp.entrecausas.entity.Categoria;
import br.edu.ifsp.entrecausas.entity.Funcao;
import br.edu.ifsp.entrecausas.entity.StatusSolicitacao;
import br.edu.ifsp.entrecausas.entity.Usuario;

import br.edu.ifsp.entrecausas.repository.CategoriaRepository;
import br.edu.ifsp.entrecausas.repository.FuncaoRepository;
import br.edu.ifsp.entrecausas.repository.StatusSolicitacaoRepository;
import br.edu.ifsp.entrecausas.repository.UsuarioRepository;

import br.edu.ifsp.entrecausas.security.AesCryptoUtil;
import br.edu.ifsp.entrecausas.security.HmacCryptoUtil;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Configuration
public class DataInitializer {

    private static final String EMAIL_MASTER = "testeentrecausas@gmail.com";

    // Inicializa os dados fixos do sistema.
    @Bean
    CommandLineRunner inicializarDados(
            FuncaoRepository funcaoRepository,
            StatusSolicitacaoRepository statusRepository,
            CategoriaRepository categoriaRepository,
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            AesCryptoUtil aesCryptoUtil,
            HmacCryptoUtil hmacCryptoUtil,
            @Value("${MASTER_PASSWORD:}") String senhaInicialMaster,
            @Value("${MASTER_CPF:}") String cpfInicialMaster,
            @Value("${MASTER_TELEFONE:}") String telefoneInicialMaster) {

        return args -> {

            // FUNÇÕES
            criarFuncaoSeNaoExistir(funcaoRepository, "USUARIO");
            criarFuncaoSeNaoExistir(funcaoRepository, "ADMINISTRADOR");
            criarFuncaoSeNaoExistir(funcaoRepository, "MASTER");

            // STATUS
            criarStatusSeNaoExistir(statusRepository, "PENDENTE");
            criarStatusSeNaoExistir(statusRepository, "APROVADO");
            criarStatusSeNaoExistir(statusRepository, "REJEITADO");

            // CATEGORIAS
            criarCategoriaSeNaoExistir(categoriaRepository, "Educação");
            criarCategoriaSeNaoExistir(categoriaRepository, "Solidariedade");
            criarCategoriaSeNaoExistir(categoriaRepository, "Cultura");
            criarCategoriaSeNaoExistir(categoriaRepository, "Animais");
            criarCategoriaSeNaoExistir(categoriaRepository, "Meio Ambiente");
            criarCategoriaSeNaoExistir(categoriaRepository, "Saúde");
            criarCategoriaSeNaoExistir(categoriaRepository, "Esporte");
            criarCategoriaSeNaoExistir(categoriaRepository, "Outros");

            // MASTER
            criarMasterSeNaoExistir(
                    usuarioRepository,
                    funcaoRepository,
                    passwordEncoder,
                    aesCryptoUtil,
                    hmacCryptoUtil,
                    senhaInicialMaster,
                    cpfInicialMaster,
                    telefoneInicialMaster
            );
        };
    }

    private void criarFuncaoSeNaoExistir(
            FuncaoRepository funcaoRepository,
            String nome) {

        if (funcaoRepository.findByNome(nome).isEmpty()) {
            funcaoRepository.save(new Funcao(nome));
        }
    }

    private void criarStatusSeNaoExistir(
            StatusSolicitacaoRepository statusRepository,
            String nome) {

        if (statusRepository.findByNome(nome).isEmpty()) {
            statusRepository.save(new StatusSolicitacao(nome));
        }
    }

    private void criarCategoriaSeNaoExistir(
            CategoriaRepository categoriaRepository,
            String nome) {

        if (categoriaRepository.findByNomeIgnoreCase(nome).isEmpty()) {
            categoriaRepository.save(new Categoria(nome));
        }
    }

    // Cria a conta MASTER somente quando ela não existe.
    private void criarMasterSeNaoExistir(
            UsuarioRepository usuarioRepository,
            FuncaoRepository funcaoRepository,
            PasswordEncoder passwordEncoder,
            AesCryptoUtil aesCryptoUtil,
            HmacCryptoUtil hmacCryptoUtil,
            String senhaInicialMaster,
            String cpfInicialMaster,
            String telefoneInicialMaster) {

        List<Usuario> masters =
                usuarioRepository.findByFuncaoNomeIgnoreCase("MASTER");

        // Não permite continuar com múltiplas contas MASTER.
        if (masters.size() > 1) {
            throw new IllegalStateException(
                    "Foram encontradas múltiplas contas MASTER."
            );
        }

        // Preserva a conta MASTER existente sem alterar seus dados.
        if (masters.size() == 1) {
            return;
        }

        // Não altera uma conta existente com o e-mail reservado.
        if (usuarioRepository.existsByEmail(EMAIL_MASTER)) {
            throw new IllegalStateException(
                    "O e-mail reservado ao MASTER já está cadastrado " +
                    "em outra conta. Verifique o cadastro antes de continuar."
            );
        }

        // Exige as credenciais para criar o primeiro MASTER.
        if (senhaInicialMaster == null
                || senhaInicialMaster.isBlank()
                || senhaInicialMaster.length() < 12) {

            throw new IllegalStateException(
                    "Configure MASTER_PASSWORD com pelo menos " +
                    "12 caracteres para criar o MASTER."
            );
        }

        if (cpfInicialMaster == null
                || telefoneInicialMaster == null
                || cpfInicialMaster.isBlank()
                || telefoneInicialMaster.isBlank()) {

            throw new IllegalStateException(
                    "Configure MASTER_CPF e MASTER_TELEFONE."
            );
        }

        String cpf = cpfInicialMaster.replaceAll("\\D", "");
        String telefone = telefoneInicialMaster.replaceAll("\\D", "");

        if (!cpf.matches("\\d{11}")
                || !telefone.matches("\\d{10,11}")) {

            throw new IllegalStateException(
                    "MASTER_CPF ou MASTER_TELEFONE inválido."
            );
        }

        String cpfHash = hmacCryptoUtil.gerarHash(cpf);
        String telefoneHash = hmacCryptoUtil.gerarHash(telefone);

        if (usuarioRepository.existsByCpfHash(cpfHash)
                || usuarioRepository.existsByTelefoneHash(telefoneHash)) {

            throw new IllegalStateException(
                    "CPF ou telefone inicial do MASTER " +
                    "já está cadastrado."
            );
        }

        Funcao funcaoMaster = funcaoRepository.findByNome("MASTER")
                .orElseThrow(() -> new IllegalStateException(
                        "A função MASTER não foi encontrada."
                ));

        Usuario master = new Usuario();

        master.setNome("Master EntreCausas");
        master.setEmail(EMAIL_MASTER);
        master.setSenha(passwordEncoder.encode(senhaInicialMaster));
        master.setCpf(aesCryptoUtil.encrypt(cpf));
        master.setCpfHash(cpfHash);
        master.setTelefone(aesCryptoUtil.encrypt(telefone));
        master.setTelefoneHash(telefoneHash);
        master.setFuncao(funcaoMaster);

        // Garante que a conta MASTER seja criada ativa.
        master.setAtivo(true);

        master.setFotoPerfil(null);
        master.setFotoAlt(null);

        usuarioRepository.save(master);
    }
}