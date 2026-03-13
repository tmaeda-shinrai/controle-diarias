/**
 * historico-pagamentos.js — Lógica para a visualização do Histórico de Pagamentos por Beneficiário (Fase 6)
 *
 * Exibe todos os registros da aba REL_PAGAMENTO, cruzando com PEDIDOS para
 * exibir TRECHO, INÍCIO e FINAL de cada viagem. Considera tanto pedidos
 * normais quanto reembolsos.
 */

function initHistoricoPagamentos() {
    setupHistoricoSearch();

    // Re-renderizar quando a aba for clicada
    const btnHistorico = document.querySelector('.tab-btn[data-target="view-historico-pagamentos"]');
    if (btnHistorico) {
        btnHistorico.addEventListener('click', () => {
            renderHistoricoPagamentos();
        });
    }
}

function setupHistoricoSearch() {
    const input = document.getElementById('search-historico-input');
    const clearBtn = document.getElementById('clear-historico-filter-btn');
    let debounceTimer;

    if (input) {
        input.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                renderHistoricoPagamentos(e.target.value);
            }, 300);
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                input.value = '';
                renderHistoricoPagamentos();
            }
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (input) input.value = '';
            renderHistoricoPagamentos();
        });
    }
}

function renderHistoricoPagamentos(searchTerm = '') {
    const tbody = document.getElementById('tbody-historico-pagamentos');
    const input = document.getElementById('search-historico-input');
    if (!tbody) return;

    const data = window.__appData;
    if (!data || !data.relPagamento) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 32px;">Nenhum dado carregado.</td></tr>`;
        return;
    }

    let registrosFiltrados = [...data.relPagamento];

    const term = (searchTerm || (input ? input.value : '')).trim().toLowerCase();

    let servidoresEncontrados = [];

    if (term) {
        registrosFiltrados = registrosFiltrados.filter(r => {
            const nome = String(r['BENEFICIÁRIO'] || r['BENEFICIARIO'] || '').toLowerCase();
            return nome.includes(term);
        });

        // Buscar dados dos servidores correspondentes cruzando com a tabela de pedidos
        const nomesBenef = [...new Set(
            registrosFiltrados.map(r => String(r['BENEFICIÁRIO'] || r['BENEFICIARIO'] || '').toLowerCase())
        )];

        const matriculasEncontradas = [...new Set(
            (data.pedidos || [])
                .filter(p => nomesBenef.includes(String(p['SERVIDOR'] || '').toLowerCase()))
                .map(p => String(p['MATRÍCULA'] || p['MATRICULA'] || ''))
        )];

        servidoresEncontrados = (data.servidores || []).filter(s => {
            const mat = String(s['MATRÍCULA'] || s['MATRICULA'] || '');
            return matriculasEncontradas.includes(mat);
        });
    }

    // Exibir ou ocultar painel de informações do servidor
    const panel = document.getElementById('historico-servidor-info');
    if (panel) {
        if (servidoresEncontrados.length > 0 && term !== '') {
            showServidoresHistoricoInfo(servidoresEncontrados, panel);
        } else {
            panel.classList.remove('visible');
            panel.style.maxHeight = '0';
            panel.style.opacity = '0';
            panel.style.padding = '0';
        }
    }

    if (registrosFiltrados.length === 0) {
        tbody.innerHTML = `<tr>
            <td colspan="7" style="text-align:center; padding: 32px; color: var(--text-muted);">
                Nenhum registro de pagamento encontrado.
            </td>
        </tr>`;
        return;
    }

    // Mapa de pedidos para lookup rápido por número de pedido
    const pedidosMap = {};
    (data.pedidos || []).forEach(p => {
        pedidosMap[p['PEDIDO']] = p;
    });

    // Ordenar por data de pagamento mais recente primeiro; sem data vai para o final
    registrosFiltrados.sort((a, b) => {
        const pagA = a['PAGAMENTO'];
        const pagB = b['PAGAMENTO'];
        const hasA = pagA && String(pagA).trim() !== '';
        const hasB = pagB && String(pagB).trim() !== '';

        if (!hasA && !hasB) return 0;
        if (!hasA) return 1;
        if (!hasB) return -1;

        const dateA = typeof parseDate === 'function' ? parseDate(pagA) : new Date(pagA);
        const dateB = typeof parseDate === 'function' ? parseDate(pagB) : new Date(pagB);
        return (dateB || new Date(0)) - (dateA || new Date(0));
    });

    let html = '';

    registrosFiltrados.forEach(r => {
        const numPedido = r['PEDIDO'] || '—';
        const beneficiario = r['BENEFICIÁRIO'] || r['BENEFICIARIO'] || '—';
        const tipo = r['TIPO'] || '—';
        const pagamentoRaw = r['PAGAMENTO'];

        // Cross-reference com a aba PEDIDOS para obter trecho e datas
        const pedido = pedidosMap[numPedido];
        const trecho = pedido ? (pedido['TRECHO'] || '—') : '—';
        const inDate = pedido ? (pedido['INÍCIO'] || pedido['INICIO']) : null;
        const fnDate = pedido ? pedido['FINAL'] : null;

        const inicioDate = typeof formatDate === 'function' ? formatDate(inDate) : inDate || '—';
        const finalDate = typeof formatDate === 'function' ? formatDate(fnDate) : fnDate || '—';
        const pagamentoFormatted = (pagamentoRaw && String(pagamentoRaw).trim() !== '')
            ? (typeof formatDate === 'function' ? formatDate(pagamentoRaw) : pagamentoRaw)
            : null;

        // Badge de TIPO
        let tipoBadge;
        const tipoNorm = String(tipo).trim().toLowerCase();
        if (tipoNorm === 'relatório' || tipoNorm === 'relatorio') {
            tipoBadge = `
                <div class="status-badge" style="background: rgba(230, 162, 60, 0.12); color: #e6a23c; border: 1px solid rgba(230, 162, 60, 0.35); font-weight: 500; display: inline-flex; align-items: center; justify-content: center; padding: 5px 12px; border-radius: 20px; font-size: 0.82rem; white-space: nowrap;">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 5px;"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>
                    Reembolso
                </div>`;
        } else {
            tipoBadge = `
                <div class="status-badge" style="background: rgba(100, 165, 240, 0.1); color: #64a5f0; border: 1px solid rgba(100, 165, 240, 0.3); font-weight: 500; display: inline-flex; align-items: center; justify-content: center; padding: 5px 12px; border-radius: 20px; font-size: 0.82rem; white-space: nowrap;">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 5px;"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                    Pedido
                </div>`;
        }

        // Exibição da data de pagamento
        const dataBadge = pagamentoFormatted
            ? `<span style="font-weight: 500;">${pagamentoFormatted}</span>`
            : `<span style="color: var(--text-muted); font-size: 0.85rem;">Aguardando</span>`;

        html += `
            <tr>
                <td class="col-pedido"><strong>${numPedido}</strong></td>
                <td class="col-servidor">
                    <span style="font-weight: 500;">${beneficiario}</span>
                </td>
                <td class="col-trecho">${trecho}</td>
                <td class="col-inicio">${inicioDate}</td>
                <td class="col-final">${finalDate}</td>
                <td style="min-width: 130px; text-align: center;">${tipoBadge}</td>
                <td class="col-situacao" style="text-align: center;">${dataBadge}</td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

/**
 * Exibe informações do servidor em painel, igual ao Lançamento de Ponto
 */
function showServidoresHistoricoInfo(servidores, panel) {
    if (!panel) return;

    panel.innerHTML = servidores.map((servidor, index) => {
        const isLast = index === servidores.length - 1;
        return `
            <div class="servidor-card-item" style="${!isLast ? 'margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid var(--border-color);' : ''}">
                <div class="servidor-header">
                    <div class="servidor-avatar">${(servidor['SERVIDOR'] || 'S')[0]}</div>
                    <div class="servidor-details">
                        <h3 class="servidor-name-clickable" onclick="selectBeneficiarioHistorico('${servidor['SERVIDOR'] || ''}')" title="Clique para preencher a busca">${servidor['SERVIDOR'] || '—'}</h3>
                        <span class="servidor-matricula">Matrícula: ${servidor['MATRÍCULA'] || servidor['MATRICULA'] || '—'}</span>
                    </div>
                </div>
                <div class="servidor-data">
                    <div class="servidor-field">
                        <span class="field-label">CPF</span>
                        <span class="field-value">${servidor['CPF'] || '—'}</span>
                    </div>
                    <div class="servidor-field">
                        <span class="field-label">Banco</span>
                        <span class="field-value">${servidor['BANCO'] || '—'}</span>
                    </div>
                    <div class="servidor-field">
                        <span class="field-label">Agência</span>
                        <span class="field-value">${servidor['AgenciaCod'] || '—'}</span>
                    </div>
                    <div class="servidor-field">
                        <span class="field-label">Conta</span>
                        <span class="field-value">${servidor['ContaNro'] || '—'}</span>
                    </div>
                </div>
                ${servidor['Obs'] ? `
                    <div class="servidor-obs">
                        <span class="obs-label">📌 Observações</span>
                        <p>${servidor['Obs']}</p>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');

    panel.classList.add('visible');
    if (!panel.classList.contains('servidor-info-base-classes')) {
        panel.classList.add('servidor-info-base-classes');
        panel.style.background = 'var(--bg-card)';
        panel.style.border = '1px solid var(--border-color)';
        panel.style.borderRadius = 'var(--radius-lg)';
        panel.style.padding = '0';
        panel.style.marginBottom = '24px';
        panel.style.maxHeight = '0';
        panel.style.opacity = '0';
        panel.style.overflow = 'hidden';
        panel.style.transition = 'all var(--transition-slow)';
    }

    setTimeout(() => {
        panel.style.padding = '20px';
        panel.style.maxHeight = '2000px';
        panel.style.opacity = '1';
        panel.style.overflowY = 'auto';
    }, 10);
}

/**
 * Função global para selecionar um beneficiário ao clicar no card do painel
 */
window.selectBeneficiarioHistorico = function (nome) {
    const searchInput = document.getElementById('search-historico-input');
    if (searchInput && nome) {
        searchInput.value = nome;
        renderHistoricoPagamentos(nome);
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHistoricoPagamentos);
} else {
    initHistoricoPagamentos();
}
