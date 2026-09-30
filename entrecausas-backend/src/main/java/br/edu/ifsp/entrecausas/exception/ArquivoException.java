package br.edu.ifsp.entrecausas.exception;

// Exceção utilizada para erros de arquivos.
public class ArquivoException
        extends RuntimeException {

    public ArquivoException(String mensagem) {
        super(mensagem);
    }

    public ArquivoException(
            String mensagem,
            Throwable causa) {

        super(mensagem, causa);
    }
}