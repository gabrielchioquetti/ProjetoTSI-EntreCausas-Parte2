package br.edu.ifsp.entrecausas.exception;

// Exceção utilizada para conflitos de dados.
public class ConflitoException
        extends RuntimeException {

    public ConflitoException(String mensagem) {
        super(mensagem);
    }
}