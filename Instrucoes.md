# O PROBLEMA

Atualmente gerencio o pagamento de diárias para funcionários da empresa que trabalho, com objetivo de custeio de deslocamentos a serviço da empresa. Por ser uma empresa pública tenho que utilizar um sistema específico (SISDEF) para lançar os pedidos e a realizar a prestação de contas (por meio de relatórios de viagem). Devido a características e limitações desse sistema, atualmente utilizo uma planilha do google planilhas para auxiliar no controle e gestão dessas informações 

O objetivo principal da aplicação é criar um front-end para a planilha do google planilhas que utilizo atualmente, para auxiliar no controle e gestão dessas informações, essa aplicação será de uso interno do setor de diárias. Então apenas as pessoas autorizadas terão acesso a aplicação (apenas os colaboradores que já tem acesso a planilha utilizada atualmente).

Continuarei a utilizar a planilha, a aplicação utilizará o arquivo google planilhas como "back-end". Novos dados serão incluídos diretamente pela planilha ou pelo front-end qeu desenvolveremos.

Abaixo vou especificar o fluxo do setor; as features que estou pensando para a aplicação (pode sugerir alterações e outras features que julgar importantes) e também a estrutura da tabela que utilizo atualmente.


# FLUXO DAS SOLICITAÇÃO

1. O beneficiário preenche um formulário, informando os dados pessoais (nome; matricula; setor); data de inicial; data final do deslocamento; cidade de origem; cidade de destino; motivo da viagem.
2. O formulário é enviado ao setor e é feito o lançamento no sistema.
3. Se não houver pendencias (prestação de contas de solicitações anteriores) ou outro impeditivos a solicitação é enviada para pagamento, se houver 2 ou mais solicitações pendentes, o beneficiário ficará impedido de receber novos pagamentos, só poderá receber após a regularização das pendências. então os pedidos ficam em uma fila de espera.
4. O setor de diárias envia a relação de pagamentos para o Setor Financeiro (das solicitações que estão em situação de pagamento) Essa ação gera no SISDEF um documento chamado "Relatório de Pagamento" que segue númeração sequencial.
5. Entre 3 a 4 dias úteis o pagamento é realizado.
6. Após o pagamento, fica disponível no sistema (SISDEF) o lançamento do relatório referente a viagem (prestação de contas).
7. Relatório feito no SISDEF, e enviado para aprovação do Gestor, após a aprovação do gestor, as informações migram para outra plataforma (MS Digital) para assinatura/confirmação do beneficiário.
Fim do fluxo.

## O que pode ocorrer

### Devoluções
Por exemplo, um deslocamento estava previsto para ocorrer em 2 dias, mas por algum motivo o beneficiário precisou retornar no primeiro dia. Nesse caso, o beneficiário deve realizar a devolução do valor não utilizado (prazo de três dias úteis). A não devolução do valor não utilizado gera pendência para o beneficiário, após a devolução dos valores que são feitas exclusivamente por transferência bancária, o relatório é enviado para o Gestor via SISDEF, seguindo o mesmo processo de confirmação MS Digital. Diferente das demais pendências se houver apenas uma solicitação com devolução pendente o beneficiário fica impedido de receber novos pagamentos, só poderá receber após a regularização das pendências. 

### Reembolsos
Por exemplo, um deslocamento estava previsto para ocorrer em 2 dias, mas por algum motivo o beneficiário precisou prolongar o deslocamento para 3 dias. Nesse caso, o beneficiário enviará o relatório de viagem, após o lançamento do relatório no SISDEF, é gerado um novo valor a ser pago, então o beneficiário, (o beneficiário não precisa fazer um pedido de reeembolso, ao lançar o relatório no SISDEF é gerado automáticamente) nesse caso após o relatório ser enviado para pagamento, ele será incluso em outro "Relatório de pagamento" mas o número da solicitação será o mesmo, as informações migram para o sistema MS Digital para assinatura/confirmação do beneficiário, apenas após o pagamento do reembolso, até que o pagamento seja feito e o beneficiário confirme no MS Digital a solicitação contará como pendente na prestação de contas, tenho 2 ou mais, o beneficiário fica impedido de receber novos pagamentos, só poderá receber após a regularização das pendências.

### O beneficiário entregou o relatório de viagem
Devido os pagamentos são feito antes do deslocamento ocorrer frequentemente o beneficiário não entrega o relatório de viagem, o beneficiário tem o prazo de 5 dias úteis para a entrega do relatório, após esse prazo ele estará com o relatório pendente. contará como pendente na prestação de contas, tenho 2 ou mais, o beneficiário fica impedido de receber novos pagamentos, só poderá receber após a regularização das pendências.

### O beneficiário não confirmou no MS Digital
Frequentemente ocorre de o beneficiário não confirmar no MS Digital, o relatório é entregue mas o beneficiário não realize a confirmação, nesse caso a solicitação contará como pendente na prestação de contas, tenho 2 ou mais, o beneficiário fica impedido de receber novos pagamentos, só poderá receber após a regularização das pendências.


### O beneficiário ainda não concluiu a prestação de contas
Após o pagamento ser efetuado, a solicitação já conta como uma pendência na prestação de contas até que seja totalmente concluída (relatório entregue e assinado). Se houver 2 ou mais solicitações pendentes (seja em status de Pagamento efetuado, Assinatura pendente, Relatório pendente, etc), o beneficiário fica impedido de receber novos pagamentos, só poderá receber após a regularização das pendências.

# Status que serão utilizados no controle

| Status                 | Obs                                                                 |
|------------------------|----------------------------------------------------------------------|
| Pedido salvo           | Após o recebimento do pedido, ele é salvo no sistema.               |
| Aguardando pagamento   | Se não houver pendências, a solicitação é enviada para pagamento.   |
| Pagamento efetuado     | Quando o pagamento é efetuado no SISDEF. (Conta como pendência para novos pedidos) |
| Relatório em revisão   | Quando o pedido já foi enviado para pagamento (status "Aguardando pagamento") e o beneficiário já entregou o relatório, porém ainda não é possível tramitar até o pagamento ser efetivado. |
| Relatório pendente     | Após 5 dias do final do deslocamento, o relatório de viagem não foi entregue. |
| Devolução pendente     | Ao entregar o relatório foram gerados valores a devolver, mas ainda não foram devolvidos. |
| Reembolso em processo  | Existem alterações no relatório que geraram reembolso e foram enviadas para pagamento. |
| Assinatura pendente    | Após o envio dos relatórios para o gestor e pagamento do reembolso (se houver), permanece nesse status até a assinatura/confirmação no MS Digital. |
| Concluído    | Solicitação com pagamento e prestação de contas concluídas.         |


# O que vamos criar

## Fase 1

Criar um Dashboard em que teremos os card´s com os quantitativos de solicitações em cada um dos estágios/status, com filtros para beneficiários, por matricula ou nome (%ILIKE%), quando o filtro aplicado constará apenas do beneficiário filtrado, "filtro limpo" todos as soliticações.
Nos card´s ao clicar expandirá uma tabela com os detalhes das solicitações no respectivo status.
Ao ter um beneficiário selecionado, trazer também as informações da coluna "Obs" da aba "SERVIDORES".

## Features

### 1. Mudança de status da solicitação 

Conforme a solicitação for avançando no fluxo preciso que ela tenha o status alterado.

**Pedido salvo**: Status inicial após salvar a solicitação no SISDEF e o pedido for incluído na aba "PEDIDOS" no google planilhas.
**Aguardando pagamento**: Quando o pedido for incluído na aba "REL_PAGAMENTO".
**Pagamento efetuado**: Quando o pagamento é efetuado no SISDEF e a coluna "PAGAMENTO" na aba "REL_PAGAMENTO" for preenchida.
**Relatório em revisão**: Quando ainda esta em processamento no SISDEF em "Aguardando pagamento" a coluna "PAGAMENTO" na aba "REL_PAGAMENTO" não foi preenchida e a coluna "RELATÓRIO" na aba pedidos "TRUE".
**Relatório pendente**: Após 5 dias úteis do final do deslocamento, o relatório de viagem não foi entregue.
**Devolução pendente**: Ao entregar o relatório foram gerados valores a devolver, mas ainda não foram devolvidos, o indicador é a coluna "Devolução" na aba pedidos "TRUE".
**Reembolso em processo**: Ao entregar o relatório foram gerados valores a reembolsar e o pagamento da diferença ainda não foi efetuado, na aba "REL_PAGAMENTO" a coluna "TIPO" é "Relatório" e a coluna "PAGAMENTO" não foi preenchida.
**Assinatura pendente**: Pagamento efetuado e relatório lançado no SISDEF e enviado para assinatura no MS Digital, restando apenas a assinatura do beneficiário e o número da solicitação (ex: DETRAN/xxxxx/2026) estiver na aba "ASSINATURAS_PENDENTES", coluna "Número Relatório" .
**Concluído**: Se o pagamento foi efetuado e o relatório foi assinado pelo beneficiário.


## Fase 2

Criar painel para acompanhar o prestação de contas, por relatório de pagamento.
Ao digitar o número do relatório de pagamento (coluna "RELATÓRIO" da aba "REL_PAGAMENTO") na barra de pesquisa, trará as informações do relatório de pagamento, como Número do pedido; tipo; valor total; data de pagamento e status.


## Fase 3

Criar uma tela com as cotas mensais de cada diretoria, com filtros por diretoria, mês e ano.
E ao clicar em uma diretoria, mostrar o detalhamento das cotas utilizadas.


## Fase 4 

Criar uma tela com o controle de quais pedidos salvos estão aptos para serem enviados para pagamento, ou seja, quais pedidos não estão com pendências. 


## Fase 5

Criar uma tela para acompanhar o lançamento dos relatórios de viagem no Sistema de ponto, os relatório de viagem também são utilizados para justificar a ausência do funcionário durante o período de viagem a serviço, então é importante que o lançamento seja feito o mais rápido possível.
Se for necessário a criação de novas abas para o controle, pode ser feito.