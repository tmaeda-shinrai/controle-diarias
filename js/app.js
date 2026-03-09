/**
 * app.js — Ponto de entrada da aplicação
 */

// Estado global
window.__appData = null;
window.__filteredData = null;

/**
 * Verifica se a API está configurada
 */
function isApiConfigured() {
    return API_URL && API_URL !== 'COLE_A_URL_DO_APPS_SCRIPT_AQUI';
}

/**
 * Dados mockados para demonstração (baseados na documentação real)
 */
function getMockData() {
    return {
        pedidos: [
            { PEDIDO: 'DETRAN/00001/2026', 'RELATÓRIO': true, 'MATRÍCULA': '61951021', SERVIDOR: 'EVANIR MORAIS BARBOSA FUKUYAMA', 'INÍCIO': '2025-10-26', FINAL: '2025-10-31', TRECHO: 'COXIM / CORUMBA', 'QUANT.': 5.5, VALOR: 'R$ 1.650,00', 'SERVIÇO': 'AUX. AGENCIA', OBS: '', NUP: '31.266.608-2025', Reembolso: false, 'Devolução': false },
            { PEDIDO: 'DETRAN/00002/2026', 'RELATÓRIO': true, 'MATRÍCULA': '102931021', SERVIDOR: 'LUCAS DE CASTRO GARCETE', 'INÍCIO': '2025-11-06', FINAL: '2025-11-08', TRECHO: 'DOURADOS / CAMPO GRANDE', 'QUANT.': 2.5, VALOR: 'R$ 625,00', 'SERVIÇO': 'GPAV - DOURADOS', OBS: '', NUP: '31.265.950-2025', Reembolso: false, 'Devolução': false },
            { PEDIDO: 'DETRAN/00003/2026', 'RELATÓRIO': true, 'MATRÍCULA': '437707021', SERVIDOR: 'DENIS CARLOS DE ANDRADE JUNIOR', 'INÍCIO': '2025-11-06', FINAL: '2025-11-08', TRECHO: 'DOURADOS / CAMPO GRANDE', 'QUANT.': 2.5, VALOR: 'R$ 625,00', 'SERVIÇO': 'GPAV - DOURADOS', OBS: '', NUP: '31.265.950-2025', Reembolso: false, 'Devolução': false },
            { PEDIDO: 'DETRAN/00004/2026', 'RELATÓRIO': true, 'MATRÍCULA': '8239024', SERVIDOR: 'RUDEL ESPINDOLA TRINDADE JUNIOR', 'INÍCIO': '2025-12-08', FINAL: '2025-12-19', TRECHO: 'CAMPO GRANDE / BRASILIA', 'QUANT.': 1.5, VALOR: 'R$ 825,00', 'SERVIÇO': 'PRESIDÊNCIA', OBS: '', NUP: '31.291.087-2025', Reembolso: false, 'Devolução': false },
            { PEDIDO: 'DETRAN/00005/2026', 'RELATÓRIO': true, 'MATRÍCULA': '90983021', SERVIDOR: 'CIDIMAR JOSE DA SILVA JUNIOR', 'INÍCIO': '2025-11-10', FINAL: '2025-11-12', TRECHO: 'CAMPO GRANDE / RIBAS DO RIO PARDO', 'QUANT.': 2.5, VALOR: 'R$ 500,00', 'SERVIÇO': 'AUX. AGENCIA', OBS: '', NUP: '31.254.853-2025', Reembolso: false, 'Devolução': false },
            { PEDIDO: 'DETRAN/00006/2026', 'RELATÓRIO': true, 'MATRÍCULA': '90983021', SERVIDOR: 'CIDIMAR JOSE DA SILVA JUNIOR', 'INÍCIO': '2025-12-01', FINAL: '2025-12-03', TRECHO: 'CAMPO GRANDE / DOURADOS', 'QUANT.': 2.5, VALOR: 'R$ 500,00', 'SERVIÇO': 'AUX. AGENCIA', OBS: '', NUP: '31.280.000-2025', Reembolso: false, 'Devolução': false },
            { PEDIDO: 'DETRAN/00007/2026', 'RELATÓRIO': false, 'MATRÍCULA': '42503021', SERVIDOR: 'ADEMIR IRIARTE AMORIM', 'INÍCIO': '2026-02-15', FINAL: '2026-02-20', TRECHO: 'CAMPO GRANDE / CORUMBÁ', 'QUANT.': 5, VALOR: 'R$ 2.000,00', 'SERVIÇO': 'TRANSPORTE', OBS: '', NUP: '31.310.000-2026', Reembolso: false, 'Devolução': false },
            { PEDIDO: 'DETRAN/00008/2026', 'RELATÓRIO': false, 'MATRÍCULA': '49028022', SERVIDOR: 'ADENILSON DA SILVA SANTOS', 'INÍCIO': '2026-03-01', FINAL: '2026-03-05', TRECHO: 'CAMPO GRANDE / PONTA PORÃ', 'QUANT.': 4.5, VALOR: 'R$ 900,00', 'SERVIÇO': 'GESAD', OBS: '', NUP: '31.320.000-2026', Reembolso: false, 'Devolução': false },
            { PEDIDO: 'DETRAN/00009/2026', 'RELATÓRIO': true, 'MATRÍCULA': '75950025', SERVIDOR: 'ADILSON ADIR RALDI', 'INÍCIO': '2026-01-20', FINAL: '2026-01-22', TRECHO: 'CAMPO GRANDE / AQUIDAUANA', 'QUANT.': 2.5, VALOR: 'R$ 625,00', 'SERVIÇO': 'ENGENHARIA', OBS: '', NUP: '31.305.000-2026', Reembolso: false, 'Devolução': true },
            { PEDIDO: 'DETRAN/00010/2026', 'RELATÓRIO': false, 'MATRÍCULA': '66960022', SERVIDOR: 'ADILSON DO AMARAL NAVARRO', 'INÍCIO': '2026-03-10', FINAL: '2026-03-12', TRECHO: 'CAMPO GRANDE / TRÊS LAGOAS', 'QUANT.': 2.5, VALOR: 'R$ 500,00', 'SERVIÇO': 'FISCALIZAÇÃO DE TRÂNSITO', OBS: '', NUP: '31.330.000-2026', Reembolso: false, 'Devolução': false },
            { PEDIDO: 'DETRAN/00011/2026', 'RELATÓRIO': true, 'MATRÍCULA': '115956030', SERVIDOR: 'ABEL DE OLIVEIRA GARCIA', 'INÍCIO': '2026-01-10', FINAL: '2026-01-15', TRECHO: 'CAMPO GRANDE / NAVIRAÍ', 'QUANT.': 5.5, VALOR: 'R$ 1.100,00', 'SERVIÇO': 'BANCA EXAMINADORA', OBS: '', NUP: '31.300.000-2026', Reembolso: true, 'Devolução': false },
        ],
        relPagamento: [
            { PEDIDO: 'DETRAN/00001/2026', 'DOTAÇÃO': 'DIRAD', 'BENEFICIÁRIO': 'EVANIR MORAIS BARBOSA FUKUYAMA', TIPO: 'Pedido', 'QUANT.': 5.5, VALOR: 'R$ 1.650,00', 'RELATÓRIO': 1, NE: '2026NE000012', ENVIO: '2026-01-20', PAGAMENTO: '2026-01-16' },
            { PEDIDO: 'DETRAN/00002/2026', 'DOTAÇÃO': 'DIRAD', 'BENEFICIÁRIO': 'LUCAS DE CASTRO GARCETE', TIPO: 'Pedido', 'QUANT.': 2.5, VALOR: 'R$ 625,00', 'RELATÓRIO': 1, NE: '2026NE000012', ENVIO: '2026-01-20', PAGAMENTO: '2026-01-16' },
            { PEDIDO: 'DETRAN/00003/2026', 'DOTAÇÃO': 'DIRAD', 'BENEFICIÁRIO': 'DENIS CARLOS DE ANDRADE JUNIOR', TIPO: 'Pedido', 'QUANT.': 2.5, VALOR: 'R$ 625,00', 'RELATÓRIO': 1, NE: '2026NE000012', ENVIO: '2026-01-20', PAGAMENTO: '2026-01-16' },
            { PEDIDO: 'DETRAN/00005/2026', 'DOTAÇÃO': 'DIRAD', 'BENEFICIÁRIO': 'CIDIMAR JOSE DA SILVA JUNIOR', TIPO: 'Pedido', 'QUANT.': 2.5, VALOR: 'R$ 500,00', 'RELATÓRIO': 1, NE: '2026NE000012', ENVIO: '2026-01-20', PAGAMENTO: '2026-01-16' },
            { PEDIDO: 'DETRAN/00006/2026', 'DOTAÇÃO': 'DIRAD', 'BENEFICIÁRIO': 'CIDIMAR JOSE DA SILVA JUNIOR', TIPO: 'Pedido', 'QUANT.': 2.5, VALOR: 'R$ 500,00', 'RELATÓRIO': 1, NE: '2026NE000012', ENVIO: '2026-01-20', PAGAMENTO: '2026-01-16' },
            { PEDIDO: 'DETRAN/00007/2026', 'DOTAÇÃO': 'DIRAD', 'BENEFICIÁRIO': 'ADEMIR IRIARTE AMORIM', TIPO: 'Pedido', 'QUANT.': 5, VALOR: 'R$ 2.000,00', 'RELATÓRIO': 2, NE: '2026NE000045', ENVIO: '2026-02-10', PAGAMENTO: '2026-02-14' },
            { PEDIDO: 'DETRAN/00008/2026', 'DOTAÇÃO': 'DIRAD', 'BENEFICIÁRIO': 'ADENILSON DA SILVA SANTOS', TIPO: 'Pedido', 'QUANT.': 4.5, VALOR: 'R$ 900,00', 'RELATÓRIO': 3, NE: '2026NE000078', ENVIO: '2026-02-28', PAGAMENTO: '' },
            { PEDIDO: 'DETRAN/00009/2026', 'DOTAÇÃO': 'DIRENG', 'BENEFICIÁRIO': 'ADILSON ADIR RALDI', TIPO: 'Pedido', 'QUANT.': 2.5, VALOR: 'R$ 625,00', 'RELATÓRIO': 1, NE: '2026NE000012', ENVIO: '2026-01-18', PAGAMENTO: '2026-01-16' },
            { PEDIDO: 'DETRAN/00011/2026', 'DOTAÇÃO': 'DIRHAB', 'BENEFICIÁRIO': 'ABEL DE OLIVEIRA GARCIA', TIPO: 'Pedido', 'QUANT.': 5.5, VALOR: 'R$ 1.100,00', 'RELATÓRIO': 1, NE: '2026NE000012', ENVIO: '2026-01-10', PAGAMENTO: '2026-01-12' },
            { PEDIDO: 'DETRAN/00011/2026', 'DOTAÇÃO': 'DIRHAB', 'BENEFICIÁRIO': 'ABEL DE OLIVEIRA GARCIA', TIPO: 'Relatório', 'QUANT.': 1, VALOR: 'R$ 200,00', 'RELATÓRIO': 4, NE: '2026NE000090', ENVIO: '2026-02-20', PAGAMENTO: '' },
        ],
        servidores: [
            { 'MATRÍCULA': '61951021', SERVIDOR: 'EVANIR MORAIS BARBOSA FUKUYAMA', CPF: '123.456.789-00', BANCO: '001', AgenciaCod: '1234', ContaNro: '56789-0', Obs: '' },
            { 'MATRÍCULA': '102931021', SERVIDOR: 'LUCAS DE CASTRO GARCETE', CPF: '234.567.890-11', BANCO: '001', AgenciaCod: '5678', ContaNro: '12345-6', Obs: '' },
            { 'MATRÍCULA': '437707021', SERVIDOR: 'DENIS CARLOS DE ANDRADE JUNIOR', CPF: '345.678.901-22', BANCO: '001', AgenciaCod: '9012', ContaNro: '67890-1', Obs: '' },
            { 'MATRÍCULA': '8239024', SERVIDOR: 'RUDEL ESPINDOLA TRINDADE JUNIOR', CPF: '456.789.012-33', BANCO: '001', AgenciaCod: '3456', ContaNro: '23456-7', Obs: '' },
            { 'MATRÍCULA': '90983021', SERVIDOR: 'CIDIMAR JOSE DA SILVA JUNIOR', CPF: '567.890.123-44', BANCO: '001', AgenciaCod: '7890', ContaNro: '78901-2', Obs: 'Servidor lotado em Campo Grande. Viagens frequentes para o interior.' },
            { 'MATRÍCULA': '42503021', SERVIDOR: 'ADEMIR IRIARTE AMORIM', CPF: '312.225.101-97', BANCO: '001', AgenciaCod: '3497', ContaNro: '16500', Obs: 'Pendência de assinatura recorrente no MS Digital.' },
            { 'MATRÍCULA': '49028022', SERVIDOR: 'ADENILSON DA SILVA SANTOS', CPF: '351.199.181-15', BANCO: '001', AgenciaCod: '8974', ContaNro: '94676', Obs: '' },
            { 'MATRÍCULA': '75950025', SERVIDOR: 'ADILSON ADIR RALDI', CPF: '511.781.761-34', BANCO: '001', AgenciaCod: '10022', ContaNro: '78042', Obs: 'Verificar situação de devolução do pedido DETRAN/00009/2026.' },
            { 'MATRÍCULA': '66960022', SERVIDOR: 'ADILSON DO AMARAL NAVARRO', CPF: '456.535.771-20', BANCO: '001', AgenciaCod: '26875', ContaNro: '10480', Obs: '' },
            { 'MATRÍCULA': '115956030', SERVIDOR: 'ABEL DE OLIVEIRA GARCIA', CPF: '843.793.911-91', BANCO: '001', AgenciaCod: '48', ContaNro: '35392-2', Obs: 'Reembolso em processamento referente ao pedido DETRAN/00011/2026.' },
        ],
        servicos: [
            { 'SERVIÇO': 'GESAD', DIRETORIA: 'DIRAD' },
            { 'SERVIÇO': 'AUX. AGENCIA', DIRETORIA: 'DIRAD' },
            { 'SERVIÇO': 'TRANSPORTE', DIRETORIA: 'DIRAD' },
            { 'SERVIÇO': 'GPAV - DOURADOS', DIRETORIA: 'FISC. DE TRÂNSITO' },
            { 'SERVIÇO': 'PRESIDÊNCIA', DIRETORIA: 'PRESIDÊNCIA' },
            { 'SERVIÇO': 'ENGENHARIA', DIRETORIA: 'DIRENG' },
            { 'SERVIÇO': 'BANCA EXAMINADORA', DIRETORIA: 'DIRHAB' },
            { 'SERVIÇO': 'FISCALIZAÇÃO DE TRÂNSITO', DIRETORIA: 'FISC. DE TRÂNSITO' },
        ],
        cotas: [],
        assinaturasPendentes: [
            { 'Número Relatório': '00007/DETRAN/2026', 'Sigla Órgão': 'DETRAN', 'Sigla Departamento': 'DIRAD', 'Tipo Diária': 'ESTADUAL', 'Nome do Beneficiário': 'ADEMIR IRIARTE AMORIM', 'CPF do Beneficiário': '31222510197', 'Tipo Beneficiário': 'SERVIDOR', 'Quantidade Diárias': 5, 'Valor Total da Diária': 'R$ 2.000,00', 'Status da Pendência': 'Pendente Assinatura: Beneficiário' },
        ]
    };
}

/**
 * Inicializa a aplicação
 */
async function initApp() {
    setupEventListeners();

    try {
        let data;

        if (isApiConfigured()) {
            data = await fetchAllData();
        } else {
            // Modo demo — usa dados mockados
            console.info('%c🎭 Modo Demonstração', 'color: #8ab4f8; font-size: 14px; font-weight: bold');
            console.info('API não configurada. Usando dados de exemplo. Configure a variável API_URL em js/api.js');
            data = getMockData();
        }

        window.__appData = data;
        window.__filteredData = data;

        const processed = processarTodosStatus(data);
        renderDashboard(processed, data);

        updateLastSync();

    } catch (error) {
        console.error('Erro ao inicializar:', error);
    }
}

/**
 * Configura event listeners
 */
function setupEventListeners() {
    // Busca por beneficiário
    const searchInput = document.getElementById('search-input');
    let debounceTimer;

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                applyFilter(e.target.value);
            }, 300);
        });

        // Limpar filtro
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                searchInput.value = '';
                applyFilter('');
            }
        });
    }

    // Botão refresh
    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', async () => {
            refreshBtn.classList.add('spinning');
            try {
                let data;
                if (isApiConfigured()) {
                    data = await fetchAllData(true);
                } else {
                    data = getMockData();
                }
                window.__appData = data;

                const filter = document.getElementById('search-input');
                if (filter && filter.value.trim()) {
                    applyFilter(filter.value);
                } else {
                    const processed = processarTodosStatus(data);
                    renderDashboard(processed, data);
                }

                updateLastSync();
            } finally {
                setTimeout(() => refreshBtn.classList.remove('spinning'), 600);
            }
        });
    }

    // Botão limpar filtro
    const clearBtn = document.getElementById('clear-filter-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                searchInput.value = '';
                applyFilter('');
            }
        });
    }
}

/**
 * Atualiza timestamp da última sincronização
 */
function updateLastSync() {
    const el = document.getElementById('last-sync');
    if (el) {
        const now = new Date();
        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        const label = isApiConfigured() ? 'Atualizado' : '🎭 Demo';
        el.textContent = `${label} às ${hh}:${mm}`;
    }
}

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initApp);
