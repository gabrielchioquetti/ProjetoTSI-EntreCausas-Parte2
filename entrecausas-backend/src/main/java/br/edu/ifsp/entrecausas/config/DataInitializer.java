package br.edu.ifsp.entrecausas.config;

import br.edu.ifsp.entrecausas.entity.Categoria;
import br.edu.ifsp.entrecausas.entity.Funcao;
import br.edu.ifsp.entrecausas.entity.StatusSolicitacao;

import br.edu.ifsp.entrecausas.repository.CategoriaRepository;
import br.edu.ifsp.entrecausas.repository.FuncaoRepository;
import br.edu.ifsp.entrecausas.repository.StatusSolicitacaoRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    // Inicializa os dados fixos do sistema.
    @Bean
    CommandLineRunner inicializarDados(FuncaoRepository funcaoRepository, StatusSolicitacaoRepository statusRepository, CategoriaRepository categoriaRepository) {

        return args -> {

            // ==========================================
            // FUNÇÕES DOS USUÁRIOS
            // ==========================================

            // Cria as funções padrão.
            criarFuncaoSeNaoExistir(
                funcaoRepository,
                "USUARIO"
            );

            criarFuncaoSeNaoExistir(
                funcaoRepository,
                "ADMINISTRADOR"
            );

            // ==========================================
            // STATUS DAS SOLICITAÇÕES
            // ==========================================

            // Cria os status das solicitações.
            criarStatusSeNaoExistir(
                statusRepository,
                "PENDENTE"
            );

            criarStatusSeNaoExistir(
                statusRepository,
                "APROVADO"
            );

            criarStatusSeNaoExistir(
                statusRepository,
                "REJEITADO"
            );

            // ==========================================
            // CATEGORIAS DAS ONGs
            // ==========================================

            // Cria as categorias fixas do sistema.
            criarCategoriaSeNaoExistir(
                categoriaRepository,
                "Educação"
            );

            criarCategoriaSeNaoExistir(
                categoriaRepository,
                "Solidariedade"
            );

            criarCategoriaSeNaoExistir(
                categoriaRepository,
                "Cultura"
            );

            criarCategoriaSeNaoExistir(
                categoriaRepository,
                "Animais"
            );

            criarCategoriaSeNaoExistir(
                categoriaRepository,
                "Meio Ambiente"
            );

            criarCategoriaSeNaoExistir(
                categoriaRepository,
                "Saúde"
            );

            criarCategoriaSeNaoExistir(
                categoriaRepository,
                "Esporte"
            );

            criarCategoriaSeNaoExistir(
                categoriaRepository,
                "Outros"
            );
        };
    }

    // Cria a função somente se ela não existir.
    private void criarFuncaoSeNaoExistir(FuncaoRepository funcaoRepository, String nome) {

        if (funcaoRepository.findByNome(nome).isEmpty()) {
            funcaoRepository.save(new Funcao(nome));
        }
    }

    // Cria o status somente se ele não existir.
    private void criarStatusSeNaoExistir(StatusSolicitacaoRepository statusRepository, String nome) {

        if (statusRepository.findByNome(nome).isEmpty()) {
            statusRepository.save(new StatusSolicitacao(nome));
        }
    }

    // Cria a categoria somente se ela não existir.
    // A busca ignora maiúsculas e minúsculas.
    private void criarCategoriaSeNaoExistir(CategoriaRepository categoriaRepository, String nome) {
        if (categoriaRepository.findByNomeIgnoreCase(nome).isEmpty()) {
            categoriaRepository.save(new Categoria(nome));
        }
    }
}