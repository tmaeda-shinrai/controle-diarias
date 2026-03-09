/**
 * statusEngine.js — Lógica de cálculo de status das solicitações
 * 
 * Regras de prioridade (avaliadas nesta ordem):
 * 1. Concluído
 * 2. Assinatura pendente
 * 3. Devolução pendente
 * 4. Reembolso em processo
 * 5. Relatório em revisão
 * 6. Relatório pendente
 * 7. Pagamento efetuado
 * 8. Aguardando pagamento
 * 9. Pedido salvo
 */

const STATUS = {
    PEDIDO_SALVO: 'Pedido salvo',
    AGUARDANDO_PAGAMENTO: 'Aguardando pagamento',
    PAGAMENTO_EFETUADO: 'Pagamento efetuado',
    RELATORIO_EM_REVISAO: 'Relatório em revisão',
    RELATORIO_PENDENTE: 'Relatório pendente',
    DEVOLUCAO_PENDENTE: 'Devolução pendente',
    REEMBOLSO_EM_PROCESSO: 'Reembolso em processo',
    ASSINATURA_PENDENTE: 'Assinatura pendente',
    CONCLUIDO: 'Concluído'
};

// Metadados por status: ícone, cor, ordem
const STATUS_META = {
    [STATUS.PEDIDO_SALVO]: { icon: '📋', color: '#6C7A89', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', order: 0 },
    [STATUS.AGUARDANDO_PAGAMENTO]: { icon: '⏳', color: '#F39C12', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', order: 1 },
    [STATUS.PAGAMENTO_EFETUADO]: { icon: '✅', color: '#27AE60', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', order: 2 },
    [STATUS.RELATORIO_EM_REVISAO]: { icon: '🔍', color: '#3498DB', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', order: 3 },
    [STATUS.RELATORIO_PENDENTE]: { icon: '⚠️', color: '#E74C3C', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', order: 4 },
    [STATUS.DEVOLUCAO_PENDENTE]: { icon: '💸', color: '#E67E22', gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', order: 5 },
    [STATUS.REEMBOLSO_EM_PROCESSO]: { icon: '🔄', color: '#9B59B6', gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', order: 6 },
    [STATUS.ASSINATURA_PENDENTE]: { icon: '✍️', color: '#1ABC9C', gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', order: 7 },
    [STATUS.CONCLUIDO]: { icon: '✅', color: '#2ECC71', gradient: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)', order: 8 },
};

/**
 * Calcula o status de um pedido com base nos dados cruzados
 * @param {Object} pedido - Registro da aba PEDIDOS
 * @param {Array}  relPagamentos - Todos os registros da aba REL_PAGAMENTO
 * @param {Array}  assinaturas - Todos os registros da aba ASSINATURAS_PENDENTES
 * @returns {string} Status calculado
 */
function calcularStatus(pedido, relPagamentos, assinaturas) {
    const numeroPedido = pedido['PEDIDO'];
    const relatorioEntregue = pedido['RELATÓRIO'] === true || pedido['RELATÓRIO'] === 'TRUE';
    const temDevolucao = pedido['Devolução'] === true || pedido['Devolução'] === 'TRUE';
    const temReembolso = pedido['Reembolso'] === true || pedido['Reembolso'] === 'TRUE';

    // Busca registros deste pedido na aba REL_PAGAMENTO
    const regsPagamento = relPagamentos.filter(r => r['PEDIDO'] === numeroPedido);
    const regPedido = regsPagamento.find(r => String(r['TIPO']).toLowerCase() === 'pedido');
    const regRelatorio = regsPagamento.find(r => String(r['TIPO']).toLowerCase() === 'relatório' || String(r['TIPO']).toLowerCase() === 'relatorio');

    const existeNaRelPagamento = regsPagamento.length > 0;
    const pagamentoEfetuado = regPedido && regPedido['PAGAMENTO'] && String(regPedido['PAGAMENTO']).trim() !== '';
    const reembolsoPago = regRelatorio && regRelatorio['PAGAMENTO'] && String(regRelatorio['PAGAMENTO']).trim() !== '';

    // Verifica se o pedido está na aba ASSINATURAS_PENDENTES
    // O número na aba ASSINATURAS é no formato "00001/DETRAN/2026"
    // Na aba PEDIDOS é "DETRAN/00001/2026"
    const naAssinaturas = assinaturas.some(a => {
        const numRel = String(a['Número Relatório'] || '');
        return pedidoMatchAssinatura(numeroPedido, numRel);
    });

    // --- Regras de status (ordem de prioridade) ---

    // 1. CONCLUÍDO: Pagamento feito + Relatório entregue + Não está em assinaturas
    //              + Sem devoluções/reembolsos pendentes
    if (pagamentoEfetuado && relatorioEntregue && !naAssinaturas) {
        // Se tem devolução, verifica se já foi tratada
        if (temDevolucao) {
            return STATUS.DEVOLUCAO_PENDENTE;
        }
        // Se tem reembolso, verifica se já foi pago
        if (temReembolso && !reembolsoPago) {
            return STATUS.REEMBOLSO_EM_PROCESSO;
        }
        return STATUS.CONCLUIDO;
    }

    // 2. ASSINATURA PENDENTE: Está na aba ASSINATURAS_PENDENTES
    if (naAssinaturas && pagamentoEfetuado) {
        return STATUS.ASSINATURA_PENDENTE;
    }

    // 3. DEVOLUÇÃO PENDENTE
    if (relatorioEntregue && temDevolucao) {
        return STATUS.DEVOLUCAO_PENDENTE;
    }

    // 4. REEMBOLSO EM PROCESSO: Existe registro tipo Relatório sem pagamento
    if (regRelatorio && !reembolsoPago) {
        return STATUS.REEMBOLSO_EM_PROCESSO;
    }

    // 5. RELATÓRIO EM REVISÃO: Em REL_PAGAMENTO, pagamento pendente + relatório entregue
    if (existeNaRelPagamento && !pagamentoEfetuado && relatorioEntregue) {
        return STATUS.RELATORIO_EM_REVISAO;
    }

    // 6. RELATÓRIO PENDENTE: Pagamento efetuado + 5 dias úteis + relatório não entregue
    if (pagamentoEfetuado && !relatorioEntregue) {
        const dataFinal = parseDate(pedido['FINAL']);
        if (dataFinal && diasUteisDesde(dataFinal) >= 5) {
            return STATUS.RELATORIO_PENDENTE;
        }
        return STATUS.PAGAMENTO_EFETUADO;
    }

    // 7. PAGAMENTO EFETUADO
    if (pagamentoEfetuado) {
        return STATUS.PAGAMENTO_EFETUADO;
    }

    // 8. AGUARDANDO PAGAMENTO
    if (existeNaRelPagamento && !pagamentoEfetuado) {
        return STATUS.AGUARDANDO_PAGAMENTO;
    }

    // 9. PEDIDO SALVO (default)
    return STATUS.PEDIDO_SALVO;
}

/**
 * Verifica se um número de pedido (DETRAN/00001/2026) corresponde a
 * um número de relatório na aba assinaturas (00001/DETRAN/2026 ou variações)
 */
function pedidoMatchAssinatura(numeroPedido, numRelatorio) {
    if (!numeroPedido || !numRelatorio) return false;

    // Extrai apenas os números sequenciais de ambos para comparação
    const partesPedido = String(numeroPedido).split('/');
    const partesRel = String(numRelatorio).split('/');

    if (partesPedido.length >= 2 && partesRel.length >= 1) {
        // DETRAN/00001/2026 → 00001
        const seqPedido = partesPedido[1] || partesPedido[0];
        // 00001/DETRAN/2026 → 00001 ou 00255/DETRAN/2026 → 00255
        const seqRel = partesRel[0];

        // Compara os sequenciais (remove zeros à esquerda)
        return parseInt(seqPedido, 10) === parseInt(seqRel, 10);
    }

    return false;
}

/**
 * Faz parse de datas nos formatos: yyyy-MM-dd, dd/MM/yyyy
 * @param {string|Date} value
 * @returns {Date|null}
 */
function parseDate(value) {
    if (!value) return null;
    if (value instanceof Date) return value;

    const str = String(value).trim();

    // ISO format: yyyy-MM-dd
    if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
        const parts = str.substring(0, 10).split('-');
        const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        return isNaN(d.getTime()) ? null : d;
    }

    // BR format: dd/MM/yyyy
    const parts = str.split('/');
    if (parts.length === 3) {
        const d = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
        return isNaN(d.getTime()) ? null : d;
    }

    return null;
}

/**
 * Calcula quantos dias úteis passaram desde uma data até hoje
 * @param {Date} date
 * @returns {number}
 */
function diasUteisDesde(date) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const inicio = new Date(date);
    inicio.setHours(0, 0, 0, 0);

    if (inicio >= hoje) return 0;

    let count = 0;
    const current = new Date(inicio);
    current.setDate(current.getDate() + 1); // começa no dia seguinte

    while (current <= hoje) {
        const dia = current.getDay();
        if (dia !== 0 && dia !== 6) { // Não é sábado(6) nem domingo(0)
            count++;
        }
        current.setDate(current.getDate() + 1);
    }

    return count;
}

/**
 * Processa todos os pedidos e retorna um mapa de status → lista de pedidos
 * @param {Object} data - Dados completos retornados pela API
 * @returns {Object} { statusCounts, statusPedidos, allPedidos }
 */
function processarTodosStatus(data) {
    const pedidos = data.pedidos || [];
    const relPagamento = data.relPagamento || [];
    const assinaturas = data.assinaturasPendentes || [];

    const statusCounts = {};
    const statusPedidos = {};

    // Inicializa contadores
    Object.values(STATUS).forEach(s => {
        statusCounts[s] = 0;
        statusPedidos[s] = [];
    });

    const allPedidos = pedidos.map(pedido => {
        const status = calcularStatus(pedido, relPagamento, assinaturas);
        pedido._status = status;

        statusCounts[status]++;
        statusPedidos[status].push(pedido);

        return pedido;
    });

    return { statusCounts, statusPedidos, allPedidos };
}
