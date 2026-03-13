/**
 * fila-pagamento.js — Fase 4: Controle de pedidos aptos para envio ao pagamento
 *
 * Regras de bloqueio (cumulativas entre todos os tipos de pendência):
 * - Devolução pendente:  1 ocorrência já bloqueia
 * - Outros status bloqueadores (Aguardando pagamento, Pagamento efetuado, Relatório em revisão, Relatório pendente, Reembolso em processo,
 *   Assinatura pendente): 2+ ocorrências no total (cumulativo) bloqueiam
 */

// Status que contam como pendências para bloqueio
const STATUS_BLOQUEADORES = [
    'Aguardando pagamento',
    'Pagamento efetuado',
    'Relatório em revisão',
    'Relatório pendente',
    'Devolução pendente',
    'Reembolso em processo',
    'Assinatura pendente'
];

const STATUS_DEVOLUCAO = 'Devolução pendente';

// Estado local
const filaState = {
    filtro: 'todos',
    pedidosSalvos: [],      // pedidos com status = Pedido salvo
    analise: new Map()      // matrícula → { bloqueado: bool, motivos: [{ pedido, status }] }
};

/**
 * Inicializa a view de Fila de Pagamento
 */
function initFilaPagamento() {
    const btnFila = document.querySelector('.tab-btn[data-target="view-fila-pagamento"]');
    if (btnFila) {
        btnFila.addEventListener('click', () => {
            renderFilaPagamento();
        });
    }

    // Botões de filtro rápido
    document.querySelectorAll('.fila-filtro-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.fila-filtro-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filaState.filtro = btn.getAttribute('data-filtro');
            aplicarFiltroFila();
        });
    });

    // Fechar painel de bloqueio
    const closeBtn = document.getElementById('fila-bloqueio-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', fecharPainelBloqueio);
    }
}

/**
 * Analisa todos os pedidos de um beneficiário e retorna pendências bloqueadoras
 * @param {string} matricula
 * @param {Array} allPedidos — todos os pedidos já processados com _status
 * @returns {{ bloqueado: boolean, totalPendencias: number, motivos: Array }}
 */
function analisarBloqueio(matricula, allPedidos) {
    const pedidosBenef = allPedidos.filter(p => String(p['MATRÍCULA'] || p['MATRICULA']) === String(matricula));

    const motivos = [];
    let totalPendencias = 0;

    pedidosBenef.forEach(p => {
        if (STATUS_BLOQUEADORES.includes(p._status)) {
            motivos.push({ pedido: p['PEDIDO'], status: p._status });
            totalPendencias++;
        }
    });

    // Devolução pendente — basta 1 para bloquear
    const temDevolucao = motivos.some(m => m.status === STATUS_DEVOLUCAO);

    const bloqueado = temDevolucao || totalPendencias >= 2;

    return { bloqueado, totalPendencias, motivos };
}

/**
 * Carrega, analisa e renderiza a tabela de pedidos salvos
 */
function renderFilaPagamento() {
    const data = window.__appData;
    if (!data || !data.pedidos) return;

    const allPedidos = data.pedidos;

    // Filtra apenas "Pedido salvo"
    filaState.pedidosSalvos = allPedidos.filter(p => p._status === 'Pedido salvo');

    // Analisa bloqueios por matrícula (cache no Map)
    filaState.analise.clear();
    filaState.pedidosSalvos.forEach(p => {
        const mat = String(p['MATRÍCULA'] || p['MATRICULA']);
        if (!filaState.analise.has(mat)) {
            filaState.analise.set(mat, analisarBloqueio(mat, allPedidos));
        }
    });

    // Atualiza contadores do resumo
    let countApto = 0, countBloqueado = 0;
    filaState.pedidosSalvos.forEach(p => {
        const mat = String(p['MATRÍCULA'] || p['MATRICULA']);
        if (filaState.analise.get(mat)?.bloqueado) {
            countBloqueado++;
        } else {
            countApto++;
        }
    });

    document.getElementById('fila-count-apto').textContent = countApto;
    document.getElementById('fila-count-bloqueado').textContent = countBloqueado;
    document.getElementById('fila-count-total').textContent = filaState.pedidosSalvos.length;

    aplicarFiltroFila();
}

/**
 * Aplica o filtro atual e re-renderiza as linhas da tabela
 */
function aplicarFiltroFila() {
    const tbody = document.getElementById('tbody-fila-pagamento');
    if (!tbody) return;

    let pedidos = filaState.pedidosSalvos;

    if (filaState.filtro === 'apto') {
        pedidos = pedidos.filter(p => !filaState.analise.get(String(p['MATRÍCULA'] || p['MATRICULA']))?.bloqueado);
    } else if (filaState.filtro === 'bloqueado') {
        pedidos = pedidos.filter(p => filaState.analise.get(String(p['MATRÍCULA'] || p['MATRICULA']))?.bloqueado);
    }

    if (pedidos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 32px; color: var(--text-muted);">Nenhum pedido encontrado para o filtro selecionado.</td></tr>`;
        return;
    }

    tbody.innerHTML = '';

    pedidos.forEach(p => {
        const mat = String(p['MATRÍCULA'] || p['MATRICULA']);
        const analise = filaState.analise.get(mat);
        const bloqueado = analise?.bloqueado;

        const inicio = typeof formatDate === 'function' ? formatDate(p['INÍCIO'] || p['INICIO']) : (p['INÍCIO'] || p['INICIO']);
        const fim    = typeof formatDate === 'function' ? formatDate(p['FINAL']) : p['FINAL'];

        const badgeClass = bloqueado ? 'fila-badge bloqueado' : 'fila-badge apto';
        const badgeText  = bloqueado
            ? `🔴 Bloqueado (${analise.totalPendencias} pendência${analise.totalPendencias > 1 ? 's' : ''})`
            : '✅ Apto';

        const tr = document.createElement('tr');
        tr.className = bloqueado ? 'row-bloqueado' : 'row-apto';
        tr.innerHTML = `
            <td class="col-pedido">${p['PEDIDO'] || '—'}</td>
            <td class="col-servidor">${p['SERVIDOR'] || '—'}</td>
            <td class="col-servico">${p['SERVIÇO'] || '—'}</td>
            <td class="col-inicio">${inicio}${fim ? ' → ' + fim : ''}</td>
            <td class="col-valor">${p['VALOR'] || '—'}</td>
            <td>
                <span class="${badgeClass}" style="cursor: ${bloqueado ? 'pointer' : 'default'};" 
                    ${bloqueado ? `data-mat="${mat}" data-nome="${p['SERVIDOR']}"` : ''}>
                    ${badgeText}
                </span>
            </td>
        `;

        // Clicar no badge de bloqueado abre o painel de motivos
        if (bloqueado) {
            const badge = tr.querySelector('.fila-badge.bloqueado');
            badge.addEventListener('click', () => {
                abrirPainelBloqueio(mat, p['SERVIDOR'], analise.motivos);
            });
        }

        tbody.appendChild(tr);
    });
}

/**
 * Abre o painel lateral com os motivos de bloqueio do beneficiário
 */
function abrirPainelBloqueio(matricula, nome, motivos) {
    const panel = document.getElementById('fila-bloqueio-panel');
    const nomeEl = document.getElementById('fila-bloqueio-nome');
    const listaEl = document.getElementById('fila-bloqueio-lista');

    nomeEl.textContent = `${nome} (Matrícula: ${matricula})`;
    listaEl.innerHTML = '';

    motivos.forEach(m => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${m.pedido}</strong> — <span class="fila-motivo-status">${m.status}</span>`;
        listaEl.appendChild(li);
    });

    panel.classList.add('visible');
}

function fecharPainelBloqueio() {
    const panel = document.getElementById('fila-bloqueio-panel');
    if (panel) panel.classList.remove('visible');
}

// Expõe globalmente para ser chamado pelo app.js após refresh
window.initFilaPagamento = initFilaPagamento;
window.renderFilaPagamento = renderFilaPagamento;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFilaPagamento);
} else {
    initFilaPagamento();
}
