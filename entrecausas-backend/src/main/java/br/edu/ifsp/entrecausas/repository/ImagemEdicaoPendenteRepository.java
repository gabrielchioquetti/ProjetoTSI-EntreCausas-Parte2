package br.edu.ifsp.entrecausas.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.edu.ifsp.entrecausas.entity.ImagemEdicaoPendente;

// Repository responsável pelos arquivos de edições pendentes.
public interface ImagemEdicaoPendenteRepository
        extends JpaRepository<ImagemEdicaoPendente, Long> {

    // Localiza o vínculo de um arquivo com sua solicitação.
    Optional<ImagemEdicaoPendente> findByNomeArquivo(
            String nomeArquivo
    );

    // Lista os arquivos vinculados a uma solicitação.
    List<ImagemEdicaoPendente> findBySolicitacaoIdSolicitacao(
            Long idSolicitacao
    );
}