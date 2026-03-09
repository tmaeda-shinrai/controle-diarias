/**
 * mock-data.js — Dados de demonstração para teste visual
 * 
 * REMOVA ESTE ARQUIVO após conectar a API real.
 * Inclua este script ANTES de app.js no index.html.
 */

// Override da função fetchAllData com dados mockados
async function fetchAllData(forceRefresh = false) {
    showLoading(true);

    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 800));

    const data = {
        pedidos: [
            { PEDIDO: 'DETRAN/00001/2026', 'RELATÓRIO': true, 'MATRÍCULA': '61951021', SERVIDOR: 'EVANIR MORAIS BARBOSA FUKUYAMA', 'INÍCIO': '2025-10-26', FINAL: '2025-10-31', TRECHO: 'COXIM / CORUMBA', 'QUANT.': 5.5, VALOR: 'R$ 1.650,00', 'SERVIÇO': 'AUX. AGENCIA', OBS: '', NUP: '31.266.608-2025', Reembolso: false, 'Devolução': false },
            { PEDIDO: 'DETRAN/00002/2026', 'RELATÓRIO': true, 'MATRÍCULA': '102931021', SERVIDOR: 'LUCAS DE CASTRO GARCETE', 'INÍCIO': '2025-11-06', FINAL: '2025-11-08', TRECHO: 'DOURADOS / CAMPO GRANDE', 'QUANT.': 2.5, VALOR: 'R$ 625,00', 'SERVIÇO': 'GPAV - DOURADOS', OBS: '', NUP: '31.265.950-2025', Reembolso: false, 'Devolução': false },
            { PEDIDO: 'DETRAN/00003/2026', 'RELATÓRIO': true, 'MATRÍCULA': '437707021', SERVIDOR: 'DENIS CARLOS DE ANDRADE JUNIOR', 'INÍCIO': '2025-11-06', FINAL: '2025-11-08', TRECHO: 'DOURADOS / CAMPO GRANDE', 'QUANT.': 2.5, VALOR: 'R$ 625,00', 'SERVIÇO': 'GPAV - DOURADOS', OBS: '', NUP: '31.265.950-2025', Reembolso: false, 'Devolução': false },
            { PEDIDO: 'DETRAN/00004/2026', 'RELATÓRIO': true, 'MATRÍCULA': '8239024', SERVIDOR: 'RUDEL ESPINDOLA TRINDADE JUNIOR', 'INÍCIO': '2025-12-08', FINAL: '2025-12-19', TRECHO: 'CAMPO GRANDE / BRASILIA', 'QUANT.': 1.5, VALOR: 'R$ 825,00', 'SERVIÇO': 'PRESIDÊNCIA', OBS: '', NUP: '31.291.087-2025', Reembolso: false, 'Devolução': false },
            { PEDIDO: 'DETRAN/00005/2026', 'RELATÓRIO': true, 'MATRÍCULA': '90983021', SERVIDOR: 'CIDIMAR JOSE DA SILVA JUNIOR', 'INÍCIO': '2025-11-10', FINAL: '2025-11-12', TRECHO: 'CAMPO GRANDE / RIBAS DO RIO PARDO', 'QUANT.': 2.5, VALOR: 'R$ 500,00', 'SERVIÇO': 'AUX. AGENCIA', OBS: '', NUP: '31.254.853-2025', Reembolso: false, 'Devolução': false },
            { PEDIDO: 'DETRAN/00006/2026', 'RELATÓRIO': false, 'MATRÍCULA': '90983021', SERVIDOR: 'CIDIMAR JOSE DA SILVA JUNIOR', 'INÍCIO': '2026-01-20', FINAL: '2026-01-22', TRECHO: 'CAMPO GRANDE / TRÊS LAGOAS', 'QUANT.': 2.5, VALOR: 'R$ 500,00', 'SERVIÇO': 'AUX. AGENCIA', OBS: '', NUP: '31.300.100-2026', Reembolso: false, 'Devolução': false },
            { PEDIDO: 'DETRAN/00007/2026', 'RELATÓRIO': false, 'MATRÍCULA': '42503021', SERVIDOR: 'ADEMIR IRIARTE AMORIM', 'INÍCIO': '2026-02-15', FINAL: '2026-02-20', TRECHO: 'CAMPO GRANDE / AQUIDAUANA', 'QUANT.': 5.0, VALOR: 'R$ 2.000,00', 'SERVIÇO': 'TRANSPORTE', OBS: '', NUP: '31.310.200-2026', Reembolso: false, 'Devolução': false },
            { PEDIDO: 'DETRAN/00008/2026', 'RELATÓRIO': true, 'MATRÍCULA': '49028022', SERVIDOR: 'ADENILSON DA SILVA SANTOS', 'INÍCIO': '2026-01-05', FINAL: '2026-01-07', TRECHO: 'CAMPO GRANDE / CORUMBÁ', 'QUANT.': 2.5, VALOR: 'R$ 625,00', 'SERVIÇO': 'ENGENHARIA', OBS: '', NUP: '31.305.300-2026', Reembolso: false, 'Devolução': true },
            { PEDIDO: 'DETRAN/00009/2026', 'RELATÓRIO': true, 'MATRÍCULA': '75950025', SERVIDOR: 'ADILSON ADIR RALDI', 'INÍCIO': '2026-02-01', FINAL: '2026-02-03', TRECHO: 'CAMPO GRANDE / DOURADOS', 'QUANT.': 2.5, VALOR: 'R$ 625,00', 'SERVIÇO': 'BANCA EXAMINADORA', OBS: '', NUP: '31.312.400-2026', Reembolso: true, 'Devolução': false },
            { PEDIDO: 'DETRAN/00010/2026', 'RELATÓRIO': false, 'MATRÍCULA': '66960022', SERVIDOR: 'ADILSON DO AMARAL NAVARRO', 'INÍCIO': '2026-03-01', FINAL: '2026-03-03', TRECHO: 'CAMPO GRANDE / PONTA PORÃ', 'QUANT.': 2.5, VALOR: 'R$ 500,00', 'SERVIÇO': 'FISCALIZAÇÃO DE TRÂNSITO', OBS: '', NUP: '31.320.500-2026', Reembolso: false, 'Devolução': false },
        ],
        relPagamento: [
            { PEDIDO: 'DETRAN/00001/2026', 'DOTAÇÃO': 'DIRAD', 'BENEFICIÁRIO': 'EVANIR MORAIS BARBOSA FUKUYAMA', TIPO: 'Pedido', 'QUANT.': 5.5, VALOR: 'R$ 1.650,00', 'RELATÓRIO': 1, NE: '2026NE000012', ENVIO: '2026-01-20', PAGAMENTO: '2026-01-16' },
            { PEDIDO: 'DETRAN/00002/2026', 'DOTAÇÃO': 'DIRAD', 'BENEFICIÁRIO': 'LUCAS DE CASTRO GARCETE', TIPO: 'Pedido', 'QUANT.': 2.5, VALOR: 'R$ 625,00', 'RELATÓRIO': 1, NE: '2026NE000012', ENVIO: '2026-01-20', PAGAMENTO: '2026-01-16' },
            { PEDIDO: 'DETRAN/00003/2026', 'DOTAÇÃO': 'DIRAD', 'BENEFICIÁRIO': 'DENIS CARLOS DE ANDRADE JUNIOR', TIPO: 'Pedido', 'QUANT.': 2.5, VALOR: 'R$ 625,00', 'RELATÓRIO': 1, NE: '2026NE000012', ENVIO: '2026-01-20', PAGAMENTO: '2026-01-16' },
            { PEDIDO: 'DETRAN/00005/2026', 'DOTAÇÃO': 'DIRAD', 'BENEFICIÁRIO': 'CIDIMAR JOSE DA SILVA JUNIOR', TIPO: 'Pedido', 'QUANT.': 2.5, VALOR: 'R$ 500,00', 'RELATÓRIO': 1, NE: '2026NE000012', ENVIO: '2026-01-20', PAGAMENTO: '2026-01-16' },
            { PEDIDO: 'DETRAN/00006/2026', 'DOTAÇÃO': 'DIRAD', 'BENEFICIÁRIO': 'CIDIMAR JOSE DA SILVA JUNIOR', TIPO: 'Pedido', 'QUANT.': 2.5, VALOR: 'R$ 500,00', 'RELATÓRIO': 1, NE: '2026NE000012', ENVIO: '2026-01-20', PAGAMENTO: '2026-01-16' },
            { PEDIDO: 'DETRAN/00007/2026', 'DOTAÇÃO': 'DIRAD', 'BENEFICIÁRIO': 'ADEMIR IRIARTE AMORIM', TIPO: 'Pedido', 'QUANT.': 5.0, VALOR: 'R$ 2.000,00', 'RELATÓRIO': 2, NE: '2026NE000034', ENVIO: '2026-02-18', PAGAMENTO: '' },
            { PEDIDO: 'DETRAN/00008/2026', 'DOTAÇÃO': 'DIRAD', 'BENEFICIÁRIO': 'ADENILSON DA SILVA SANTOS', TIPO: 'Pedido', 'QUANT.': 2.5, VALOR: 'R$ 625,00', 'RELATÓRIO': 1, NE: '2026NE000012', ENVIO: '2026-01-10', PAGAMENTO: '2026-01-14' },
            { PEDIDO: 'DETRAN/00009/2026', 'DOTAÇÃO': 'DIRAD', 'BENEFICIÁRIO': 'ADILSON ADIR RALDI', TIPO: 'Pedido', 'QUANT.': 2.5, VALOR: 'R$ 625,00', 'RELATÓRIO': 2, NE: '2026NE000034', ENVIO: '2026-02-10', PAGAMENTO: '2026-02-14' },
            { PEDIDO: 'DETRAN/00009/2026', 'DOTAÇÃO': 'DIRAD', 'BENEFICIÁRIO': 'ADILSON ADIR RALDI', TIPO: 'Relatório', 'QUANT.': 0.5, VALOR: 'R$ 125,00', 'RELATÓRIO': 3, NE: '2026NE000050', ENVIO: '2026-03-01', PAGAMENTO: '' },
        ],
        servidores: [
            { 'MATRÍCULA': '61951021', SERVIDOR: 'EVANIR MORAIS BARBOSA FUKUYAMA', CPF: '123.456.789-00', BANCO: '001', AgenciaCod: '1234', ContaNro: '56789-0', Obs: '' },
            { 'MATRÍCULA': '102931021', SERVIDOR: 'LUCAS DE CASTRO GARCETE', CPF: '234.567.890-11', BANCO: '001', AgenciaCod: '5678', ContaNro: '12345-1', Obs: '' },
            { 'MATRÍCULA': '437707021', SERVIDOR: 'DENIS CARLOS DE ANDRADE JUNIOR', CPF: '345.678.901-22', BANCO: '001', AgenciaCod: '9012', ContaNro: '67890-2', Obs: '' },
            { 'MATRÍCULA': '8239024', SERVIDOR: 'RUDEL ESPINDOLA TRINDADE JUNIOR', CPF: '456.789.012-33', BANCO: '104', AgenciaCod: '3456', ContaNro: '23456-3', Obs: '' },
            { 'MATRÍCULA': '90983021', SERVIDOR: 'CIDIMAR JOSE DA SILVA JUNIOR', CPF: '567.890.123-44', BANCO: '001', AgenciaCod: '7890', ContaNro: '78901-4', Obs: 'Servidor com restrição de viagem após 20h.' },
            { 'MATRÍCULA': '42503021', SERVIDOR: 'ADEMIR IRIARTE AMORIM', CPF: '312.225.101-97', BANCO: '001', AgenciaCod: '3497', ContaNro: '16500', Obs: '' },
            { 'MATRÍCULA': '49028022', SERVIDOR: 'ADENILSON DA SILVA SANTOS', CPF: '351.199.181-15', BANCO: '001', AgenciaCod: '8974', ContaNro: '94676', Obs: '' },
            { 'MATRÍCULA': '75950025', SERVIDOR: 'ADILSON ADIR RALDI', CPF: '511.781.761-34', BANCO: '001', AgenciaCod: '10022', ContaNro: '78042', Obs: 'Servidor em processo de aposentadoria.' },
            { 'MATRÍCULA': '66960022', SERVIDOR: 'ADILSON DO AMARAL NAVARRO', CPF: '456.535.771-20', BANCO: '001', AgenciaCod: '26875', ContaNro: '10480', Obs: '' },
        ],
        servicos: [
            { 'SERVIÇO': 'AUX. AGENCIA', DIRETORIA: 'DIRAD' },
            { 'SERVIÇO': 'GPAV - DOURADOS', DIRETORIA: 'FISC. DE TRÂNSITO' },
            { 'SERVIÇO': 'PRESIDÊNCIA', DIRETORIA: 'PRESIDÊNCIA' },
            { 'SERVIÇO': 'TRANSPORTE', DIRETORIA: 'DIRAD' },
            { 'SERVIÇO': 'ENGENHARIA', DIRETORIA: 'DIRENG' },
            { 'SERVIÇO': 'BANCA EXAMINADORA', DIRETORIA: 'DIRHAB' },
            { 'SERVIÇO': 'FISCALIZAÇÃO DE TRÂNSITO', DIRETORIA: 'FISC. DE TRÂNSITO' },
        ],
        cotas: [],
        assinaturasPendentes: [
            { 'Número Relatório': '00255/DETRAN/2026', 'Sigla Órgão': 'DETRAN', 'Sigla Departamento': 'DIRAD', 'Tipo Diária': 'ESPECIAL', 'Nome do Beneficiário': 'ADEMIR IRIARTE AMORIM', 'CPF do Beneficiário': '31222510197', 'Tipo Beneficiário': 'SERVIDOR', 'Quantidade Diárias': 5, 'Valor Total da Diária': 'R$ 2.000,00', 'Status da Pendência': 'Pendente Assinatura: Beneficiário' },
            { 'Número Relatório': '00001/DETRAN/2026', 'Sigla Órgão': 'DETRAN', 'Sigla Departamento': 'DIRAD', 'Tipo Diária': 'ESTADUAL', 'Nome do Beneficiário': 'EVANIR MORAIS BARBOSA FUKUYAMA', 'CPF do Beneficiário': '12345678900', 'Tipo Beneficiário': 'SERVIDOR', 'Quantidade Diárias': 5.5, 'Valor Total da Diária': 'R$ 1.650,00', 'Status da Pendência': 'Pendente Assinatura: Beneficiário' },
        ]
    };

    showLoading(false);
    return data;
}
