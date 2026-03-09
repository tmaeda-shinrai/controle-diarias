/**
 * relatorios.js — Lógica para a visualização de Relatórios de Pagamento (Fase 2)
 */

/**
 * Configura as tabs de navegação entre o Dashboard e a fase de Relatórios
 */
function setupRelatoriosTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    const views = document.querySelectorAll('.app-view');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active style from all tabs and hide all views
            tabs.forEach(t => t.classList.remove('active'));
            views.forEach(v => v.classList.remove('active'));

            // Activate clicked tab and display target view
            tab.classList.add('active');
            const targetId = tab.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });
}

/**
 * Configura a barra de buscas do painel de Relatórios
 */
function setupRelatoriosSearch() {
    const input = document.getElementById('search-relatorio-input');
    let debounceTimer;

    if (input) {
        // Evento de digitação com debounce
        input.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                buscarRelatorio(e.target.value);
            }, 300);
        });

        // Evento de tecla para forçar a busca imediata ao apertar Enter
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // Evita recarregamento caso esteja em um form futuro
                clearTimeout(debounceTimer);
                buscarRelatorio(e.target.value);
            }
        });
    }
}

/**
 * Busca e renderiza os pagamentos baseados no ID (Número) do relatório
 */
function buscarRelatorio(term) {
    const container = document.getElementById('relatorio-resultados');
    const relatorioId = term.trim();

    if (!relatorioId) {
        container.innerHTML = `
            <div class="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:16px; opacity:0.5; color:var(--accent-primary)">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                    <line x1="8" y1="14" x2="16" y2="14"></line>
                    <line x1="12" y1="18" x2="12" y2="18"></line>
                </svg>
                <p>Digite o número do Relatório de Pagamento abaixo da barra de pesquisa para visualizar a prestação de contas daquele lote.</p>
            </div>
        `;
        return;
    }

    const data = window.__appData; // usa cache local
    if (!data || !data.relPagamento) return;

    // Filtra ignorando case, já que 'RELATÓRIO' pode ser '1' ou '0001' se houver pattern textual
    const filterId = String(relatorioId).toLowerCase();

    // Pesquisa na aba de relPagamento pela coluna 'RELATÓRIO'
    const pedidosRelatorio = data.relPagamento.filter(r => String(r['RELATÓRIO']).toLowerCase() === filterId);

    if (pedidosRelatorio.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>Nenhum pagamento encontrado para o relatório número "<strong>${relatorioId}</strong>".</p>
                <p style="font-size: 0.8rem; opacity: 0.7; margin-top: 8px;">Verifique se o número foi digitado corretamente.</p>
            </div>
        `;
        return;
    }

    renderRelatorioResult(relatorioId, pedidosRelatorio);
}

/**
 * Monta a interface de resultado para aquele Relatório
 */
function renderRelatorioResult(id, pedidos) {
    const container = document.getElementById('relatorio-resultados');

    let totalValue = 0;
    let todosPagos = true;

    // Calcula se todos os itens estão como pagos e a soma total
    pedidos.forEach(p => {
        // Parse "R$ 1.650,00" -> 1650.00
        const valorStr = p['VALOR'] || '0';
        const numStr = valorStr.replace(/[^\d,]/g, '').replace(',', '.');
        totalValue += parseFloat(numStr) || 0;

        if (!p['PAGAMENTO']) {
            todosPagos = false;
        }
    });

    const formatCurrency = (val) => {
        return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    let statusBadge = '';
    if (todosPagos) {
        statusBadge = '<span class="relatorio-badge success"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> Pago</span>';
    } else {
        statusBadge = '<span class="relatorio-badge warning"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> Aguardando Pagamento</span>';
    }

    let html = `
        <div class="card-relatorio">
            <div class="card-relatorio-header">
                <div class="card-relatorio-title">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    Relatório Nº ${id}
                </div>
                <div class="card-relatorio-badges">
                    <span class="relatorio-badge">💰 Valor Total Lote: ${formatCurrency(totalValue)}</span>
                    ${statusBadge}
                </div>
            </div>
            
            <div class="table-scroll">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th class="col-pedido">Pedido</th>
                            <th class="col-servidor">Beneficiário</th>
                            <th class="col-tipo">Tipo</th>
                            <th class="col-dotacao">Dotação</th>
                            <th class="col-valor">Valor</th>
                            <th class="col-envio">Enviado em</th>
                            <th class="col-pagamento">Data Pagto</th>
                        </tr>
                    </thead>
                    <tbody>
    `;

    // `formatDate` importado globalmente do dashboard.js
    pedidos.forEach(p => {
        let envDate = typeof formatDate === 'function' ? formatDate(p['ENVIO']) : p['ENVIO'];
        let pagDate = p['PAGAMENTO'] ? (typeof formatDate === 'function' ? formatDate(p['PAGAMENTO']) : p['PAGAMENTO']) : '—';

        html += `
            <tr>
                <td class="col-pedido">${p['PEDIDO'] || '—'}</td>
                <td class="col-servidor">${p['BENEFICIÁRIO'] || '—'}</td>
                <td class="col-tipo">${p['TIPO'] || 'Pedido'}</td>
                <td class="col-dotacao">${p['DOTAÇÃO'] || '—'}</td>
                <td class="col-valor">${p['VALOR'] || '—'}</td>
                <td class="col-envio">${envDate}</td>
                <td class="col-pagamento">${pagDate}</td>
            </tr>
        `;
    });

    html += `
                    </tbody>
                </table>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

// Iniciar Listeners específicos da tela de Relatórios
function initRelatorios() {
    setupRelatoriosTabs();
    setupRelatoriosSearch();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRelatorios);
} else {
    initRelatorios();
}
