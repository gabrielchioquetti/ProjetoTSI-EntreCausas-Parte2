
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

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    // Inicializa os dados fixos do sistema.
    @Bean
    CommandLineRunner inicializarDados(
            FuncaoRepository funcaoRepository,
            StatusSolicitacaoRepository statusRepository,
            CategoriaRepository categoriaRepository,
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            AesCryptoUtil aesCryptoUtil,
            HmacCryptoUtil hmacCryptoUtil) {

        return args -> {

            // FUNÇÕES
            criarFuncaoSeNaoExistir(
                    funcaoRepository, "USUARIO");

            criarFuncaoSeNaoExistir(
                    funcaoRepository, "ADMINISTRADOR");

            // STATUS
            criarStatusSeNaoExistir(
                    statusRepository, "PENDENTE");

            criarStatusSeNaoExistir(
                    statusRepository, "APROVADO");

            criarStatusSeNaoExistir(
                    statusRepository, "REJEITADO");

            // CATEGORIAS
            criarCategoriaSeNaoExistir(
                    categoriaRepository, "Educação");

            criarCategoriaSeNaoExistir(
                    categoriaRepository, "Solidariedade");

            criarCategoriaSeNaoExistir(
                    categoriaRepository, "Cultura");

            criarCategoriaSeNaoExistir(
                    categoriaRepository, "Animais");

            criarCategoriaSeNaoExistir(
                    categoriaRepository, "Meio Ambiente");

            criarCategoriaSeNaoExistir(
                    categoriaRepository, "Saúde");

            criarCategoriaSeNaoExistir(
                    categoriaRepository, "Esporte");

            criarCategoriaSeNaoExistir(
                    categoriaRepository, "Outros");

            // ADMINISTRADOR DE TESTE
            criarAdministradorSeNaoExistir(
                    usuarioRepository,
                    funcaoRepository,
                    passwordEncoder,
                    aesCryptoUtil,
                    hmacCryptoUtil);
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

        if (categoriaRepository
                .findByNomeIgnoreCase(nome).isEmpty()) {

            categoriaRepository.save(new Categoria(nome));
        }
    }

    // Cria um administrador fictício para testes locais.
    private void criarAdministradorSeNaoExistir(
            UsuarioRepository usuarioRepository,
            FuncaoRepository funcaoRepository,
            PasswordEncoder passwordEncoder,
            AesCryptoUtil aesCryptoUtil,
            HmacCryptoUtil hmacCryptoUtil) {

        String email = "testeentrecausas@gmail.com";

        // Não cria outro administrador com o mesmo e-mail.
        if (usuarioRepository.existsByEmail(email)) {
            return;
        }

        // Dados fictícios para o ambiente de teste.
        String cpf = "00000000000";
        String telefone = "11900000000";

        // Calcula os hashes para verificar duplicidades.
        String cpfHash = hmacCryptoUtil.gerarHash(cpf);
        String telefoneHash =
                hmacCryptoUtil.gerarHash(telefone);

        // Evita conflitos com dados que já existem no banco.
        if (usuarioRepository.existsByCpfHash(cpfHash)) {
            throw new IllegalStateException(
                    "O CPF fictício do administrador já está cadastrado. "
                    + "Altere o valor de teste no DataInitializer.");
        }

        if (usuarioRepository.existsByTelefoneHash(
                telefoneHash)) {

            throw new IllegalStateException(
                    "O telefone fictício do administrador já está cadastrado. "
                    + "Altere o valor de teste no DataInitializer.");
        }

        // Busca a função de administrador.
        Funcao funcaoAdmin = funcaoRepository
                .findByNome("ADMINISTRADOR")
                .orElseThrow(() -> new IllegalStateException(
                        "A função ADMINISTRADOR não foi encontrada."));

        Usuario administrador = new Usuario();

        administrador.setNome("Administrador de Teste");
        administrador.setEmail(email);

        // A senha é armazenada somente como hash BCrypt.
        administrador.setSenha(
                passwordEncoder.encode("12345678"));

        // Os dados sensíveis seguem o padrão do cadastro normal.
        administrador.setCpf(
                aesCryptoUtil.encrypt(cpf));

        administrador.setCpfHash(cpfHash);

        administrador.setTelefone(
                aesCryptoUtil.encrypt(telefone));

        administrador.setTelefoneHash(telefoneHash);

        administrador.setFuncao(funcaoAdmin);

        // A foto é opcional para esse cadastro.
        administrador.setFotoPerfil(null);
        administrador.setFotoAlt(null);

        usuarioRepository.save(administrador);
    }
}