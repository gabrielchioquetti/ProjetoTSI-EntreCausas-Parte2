package br.edu.ifsp.entrecausas.exception;

// Exceção utilizada quando um recurso não existe.
public class RecursoNaoEncontradoException
        extends RuntimeException {

    public RecursoNaoEncontradoException(
            String mensagem) {

        super(mensagem);
    }
}