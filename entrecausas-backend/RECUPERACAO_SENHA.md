# Contrato pendente: recuperação de senha

No momento, a API não possui operações de recuperação de senha. O frontend não
deve simular envio de e-mail, aceitação de código ou alteração de senha. Os
caminhos HTTP, formatos de resposta e códigos de status precisam ser definidos
junto com a implementação do backend; este documento não os presume.

## Operações necessárias

1. **Solicitar código:** receber um e-mail e iniciar a recuperação. A resposta
   deve ser indistinguível para e-mails cadastrados e não cadastrados. Para
   endereços elegíveis, enviar um código numérico de cinco dígitos.
2. **Validar código:** verificar o código associado ao e-mail, rejeitando
   valores incorretos, expirados ou já utilizados. A validação deve estabelecer
   no servidor uma autorização curta e de uso único para a próxima operação;
   nenhum código ou credencial de recuperação deve ser persistido pelo
   navegador.
3. **Redefinir senha:** receber a nova senha e a autorização validada, aplicar
   as regras de senha do cadastro (8 a 50 caracteres), invalidar a autorização
   e o código e armazenar a senha usando o mecanismo de hash já existente.

O backend também precisa limitar tentativas e solicitações, aplicar expiração
ao código e evitar revelar a existência de contas. As três operações devem ser
protegidas pelo mecanismo CSRF existente quando aplicável.

## Estado do frontend

A rota `/recuperar-senha` e a estrutura visual das três etapas estão
implementadas. O avanço e os envios permanecem bloqueados até o backend definir
e implementar essas operações; a tela informa esse estado sem simular sucesso.
Não há chamadas a endpoints presumidos nem armazenamento persistente de senha
ou código no navegador.
