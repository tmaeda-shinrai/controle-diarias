**Todas as tabelas iniciam na célula A1.**

# aba PEDIDOS

| PEDIDO | RELATÓRIO | MATRÍCULA | SERVIDOR | INÍCIO | FINAL | TRECHO | QUANT. | VALOR | SERVIÇO | OBS | NUP | Reembolso | Devolução |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| DETRAN/00001/2026 | TRUE | 61951021 | EVANIR MORAIS BARBOSA FUKUYAMA | 26/10/2025 | 31/10/2025 | COXIM / CORUMBA | 5,5 | R$ 1.650,00 | AUX. AGENCIA |  | 31.266.608-2025 | FALSE | FALSE |
| DETRAN/00002/2026 | TRUE | 102931021 | LUCAS DE CASTRO GARCETE | 06/11/2025 | 08/11/2025 | DOURADOS / CAMPO GRANDE | 2,5 | R$ 625,00 | GPAV - DOURADOS |  | 31.265.950-2025 | FALSE | FALSE |
| DETRAN/00003/2026 | TRUE | 437707021 | DENIS CARLOS DE ANDRADE JUNIOR | 06/11/2025 | 08/11/2025 | DOURADOS / CAMPO GRANDE | 2,5 | R$ 625,00 | GPAV - DOURADOS |  | 31.265.950-2025 | FALSE | FALSE |
| DETRAN/00004/2026 | TRUE | 8239024 | RUDEL ESPINDOLA TRINDADE JUNIOR | 08/12/2025 | 19/12/2025 | CAMPO GRANDE / BRASILIA | 1,5 | R$ 825,00 | PRESIDÊNCIA |  | 31.291.087-2025 | FALSE | FALSE |
| DETRAN/00005/2026 | TRUE | 90983021 | CIDIMAR JOSE DA SILVA JUNIOR | 10/11/2025 | 12/11/2025 | CAMPO GRANDE / RIBAS DO RIO PARDO | 2,5 | R$ 500,00 | AUX. AGENCIA |  | 31.254.853-2025 | FALSE | FALSE |

- Coluna RELATÓRIO: TRUE quando o relatório foi enviado pelo beneficiário; FALSE envio pendente.
- Coluna SERVIÇO: Está vinculada com a aba SERVIÇOS, essa informação é útil para controle de cotas por diretoria.
- coluna NUP: Essa coluna armazena o número de comunicação interna em que a solicitação foi encaminhada para o setor de diárias.
- coluna Reembolso: TRUE quando o relatório de viagem gerou reembolso; FALSE quando não houve alterações (padrão).
- coluna Devolução: TRUE quando o relatório de viagem gerou devolução; FALSE quando não houve alterações (padrão).


# aba SERVIDORES

| MATRÍCULA | SERVIDOR | CPF | BANCO | AgenciaCod | ContaNro | Obs |
|---|---|---|---|---|---|---|
| 115956030 | ABEL DE OLIVEIRA GARCIA | 843.793.911-91 | 001 | 48 | 35392-2 |  |
| 42503021 | ADEMIR IRIARTE AMORIM | 312.225.101-97 | 001 | 3497 | 16500 |  |
| 49028022 | ADENILSON DA SILVA SANTOS | 351.199.181-15 | 001 | 8974 | 94676 |  |
| 75950025 | ADILSON ADIR RALDI | 511.781.761-34 | 001 | 10022 | 78042 |  |
| 66960022 | ADILSON DO AMARAL NAVARRO | 456.535.771-20 | 001 | 26875 | 10480 |  |


# aba SERVIÇOS

| SERVIÇO | DIRETORIA |
|---|---|
| GESAD | DIRAD |
| AUX. AGENCIA | DIRAD |
| TRANSPORTE | DIRAD |
| REUNIÃO/CURSOS | DIRAD |
| OUTROS | DIRAD |
| ECV´S - FISCALIZAÇÃO | DIRVE |
| ENCONTRO DE GERENTE | DIRAD |
| PINTURA | DIRENG |
| ENGENHARIA | DIRENG |
| CURSOS | DIRET |
| MAIO AMARELO | DIRET |
| SEMANA DE TRÂNSITO | DIRET |
| AULAS PRÁTICAS | DIRET |
| DIRET | DIRET |
| CFC´S - FISCALIZAÇÃO | DIRHAB |
| BANCA EXAMINADORA | DIRHAB |
| DIRHAB | DIRHAB |
| TREINAMENTO - BANCA | DIRHAB |
| DESLOCAMENTO | DIRHAB |
| BANCA LOCAL | DIRHAB |
| BANCA SUL | DIRHAB |
| PÁTIO | DIRVE |
| AUDITORIA | DIRVE |
| DIRVE | DIRVE |
| FISCALIZAÇÃO DE TRÂNSITO | FISC. DE TRÂNSITO |
| GPAV - CG | FISC. DE TRÂNSITO |
| GPAV - NAVIRAI | FISC. DE TRÂNSITO |
| GPAV - DOURADOS | FISC. DE TRÂNSITO |
| GPAV - AQUIDAUNA | FISC. DE TRÂNSITO |
| INTERESTADUAL | INTERESTADUAL |
| PRESIDÊNCIA | PRESIDÊNCIA |
| PATRIMONIO | DIRAD |
| CANCELADO | CANCELADO |
| ARTCG | DIRAD |

Cada serviço é atribuito a uma diretoria, importante para o controle de cotas 

# aba COTAS

| MÊS | ANO | DIRAD | DIRHAB | DIRET | DIRVE | PRESIDÊNCIA | FISC. DE TRÂNSITO | DIRENG | INTERESTADUAL | DIRAD - UTILIZADO | DIRHAB - UTILIZADO | DIRET - UTILIZADO | DIRVE - UTILIZADO | PRESIDÊNCIA - UTILIZADO | FISC. DE TRÂNSITO - UTILIZADO | DIRENG - UTILIZADO | INTERESTADUAL - UTILIZADO |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| JANEIRO | 2026 | 25.000,00 | 200.000,00 | 2.500,00 | 2.500,00 | 1.500,00 | 5.500,00 | 3.000,00 |  | 24.750,00 | 90.000,00 | 1.750,00 | 900,00 | 0,00 | 3.500,00 | 1.850,00 | 875,00 |
| FEVEREIRO | 2026 | 25.000,00 | 200.000,00 | 2.500,00 | 2.500,00 | 1.500,00 | 5.500,00 | 3.000,00 |  | 21.500,00 | 198.500,00 | 2.100,00 | 2.100,00 | 1.200,00 | 5.500,00 | 3.000,00 | 0,00 |
| MARÇO | 2026 | 25.000,00 | 200.000,00 | 2.500,00 | 2.500,00 | 1.500,00 | 5.500,00 | 3.000,00 |  | 25.000,00 | 200.000,00 | 2.500,00 | 2.500,00 | 1.500,00 | 5.500,00 | 3.000,00 | 0,00 |

Os valores das cotas são estipulados mensalmente, podendo sofrer alterações, conforme demanda e disponibilidade orçamentária.
As colunas com "- UTILIZADO" mostram os valores utilizados das cotas mensais de cada diretoria baseado na coluna SERVIÇO da aba PEDIDOS e na coluna DIRETORIA da aba SERVIÇOS, e os valores são atualizados automaticamente, utilizando somas condicionais.


# aba REL_PAGAMENTO

| PEDIDO | DOTAÇÃO | BENEFICIÁRIO | TIPO | QUANT. | VALOR | RELATÓRIO | NE | ENVIO | PAGAMENTO |
|---|---|---|---|---|---|---|---|---|---|
| DETRAN/00001/2026 | DIRAD | EVANIR MORAIS BARBOSA FUKUYAMA | Pedido | 5,5 | R$ 1.650,00 | 1 | 2026NE000012 | 20/01/2026 | 16/01/2026 |
| DETRAN/00002/2026 | DIRAD | LUCAS DE CASTRO GARCETE | Pedido | 2,5 | R$ 625,00 | 1 | 2026NE000012 | 20/01/2026 | 16/01/2026 |
| DETRAN/00003/2026 | DIRAD | DENIS CARLOS DE ANDRADE JUNIOR | Pedido | 2,5 | R$ 625,00 | 1 | 2026NE000012 | 20/01/2026 | 16/01/2026 |
| DETRAN/00005/2026 | DIRAD | CIDIMAR JOSE DA SILVA JUNIOR | Pedido | 2,5 | R$ 500,00 | 1 | 2026NE000012 | 20/01/2026 | 16/01/2026 |
| DETRAN/00006/2026 | DIRAD | CIDIMAR JOSE DA SILVA JUNIOR | Pedido | 2,5 | R$ 500,00 | 1 | 2026NE000012 | 20/01/2026 | 16/01/2026 |

- Coluna DOTAÇÃO: É a origem do recurso, os pagamentos todos atrelados a DIRAD.
- Coluna TIPO: Pedido ou Relatório, sendo "Relatório" quando gerou o pagamento de reembolso.
- Coluna RELATÓRIO: Número do relatório de pagamento gerado no SISDEF.
- Coluna NE: Número da Nota de Empenho (NE) em que o pedido ou relatório de pagamento, está utilizando.
- Coluna ENVIO: Data de envio do relatório de pagamento para o setor financeiro.
- Coluna PAGAMENTO: Data do pagamento do relatório de pagamento.


# aba ASSINATURAS_PENDENTES

| Número Relatório | Sigla Órgão | Sigla Departamento | Tipo Diária | Nome do Beneficiário | CPF do Beneficiário | Tipo Beneficiário | Quantidade Diárias | Valor Total da Diária | Status da Pendência |
|---|---|---|---|---|---|---|---|---|---|
| 00255/DETRAN/2026 | DETRAN | DIRAD | ESPECIAL | ADEMIR IRIARTE AMORIM | 31222510197 | SERVIDOR | 5 | R$ 2.000,00 | Pendente Assinatura: Beneficiário |
| 03565/DETRAN/2025 | DETRAN | DIRAD | ESTADUAL | ADNILSON DA COSTA PINHEIRO | 42145546120 | SERVIDOR | 0.5 | R$ 125,00 | Pendente Assinatura: Beneficiário |
| 00018/DETRAN/2025 | DETRAN | DIRAD | ESTADUAL | AFONSO CORDOBA PIMENTA OSORIO | 4829515163 | SERVIDOR | 0.5 | R$ 100,00 | Pendente Assinatura: Beneficiário |
| 00309/DETRAN/2025 | DETRAN | DIRAD | ESTADUAL | AFONSO CORDOBA PIMENTA OSORIO | 4829515163 | SERVIDOR | 1.5 | R$ 300,00 | Pendente Assinatura: Beneficiário |
| 00302/DETRAN/2025 | DETRAN | DIRAD | ESTADUAL | AFONSO CORDOBA PIMENTA OSORIO | 4829515163 | SERVIDOR | 4.5 | R$ 900,00 | Pendente Assinatura: Beneficiário |

Os dados são extraídos do SISDEF, o usuário que tiver acesso ao sistema poderá extrair os dados. Não será necessário integração com o SISDEF.
Essa tabela armazenas apenas as assinaturas que estão pendentes.