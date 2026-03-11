/**
 * lancamento-ponto.js — Lógica para a visualização de Lançamento de Ponto (Fase 5)
 */

function initLancamentoPonto() {
    setupPontoSearch();

    // Re-renderizar quando a aba for clicada
    const btnPonto = document.querySelector('.tab-btn[data-target="view-lancamento-ponto"]');
    if (btnPonto) {
        btnPonto.addEventListener('click', () => {
            renderLancamentoPonto();
        });
    }
}

function setupPontoSearch() {
    const input = document.getElementById('search-ponto-input');
    const clearBtn = document.getElementById('clear-ponto-filter-btn');
    let debounceTimer;

    if (input) {
        input.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                renderLancamentoPonto(e.target.value);
            }, 300);
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                input.value = '';
                renderLancamentoPonto();
            }
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (input) input.value = '';
            renderLancamentoPonto();
        });
    }
}

function renderLancamentoPonto(searchTerm = '') {
    const tbody = document.getElementById('tbody-lancamento-ponto');
    const input = document.getElementById('search-ponto-input');
    if (!tbody) return;

    const data = window.__appData;
    if (!data || !data.pedidos) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 32px;">Nenhum dado carregado.</td></tr>`;
        return;
    }

    // Mostrar TODOS os pedidos
    let pedidosFiltrados = [...data.pedidos];

    const term = (searchTerm || (input ? input.value : '')).trim().toLowerCase();
    
    // Variável para armazenar servidores encontrados na busca
    let servidoresEncontrados = [];
    
    if (term) {
        // Encontrar os pedidos que contém esse termo
        const pedidosCandidatos = pedidosFiltrados.filter(p => {
            const nome = String(p['SERVIDOR'] || '').toLowerCase();
            const mat = String(p['MATRÍCULA'] || p['MATRICULA'] || '').toLowerCase();
            return nome.includes(term) || mat.includes(term);
        });
        
        // Identificar nomes únicos dos pedidos encontrados
        const matriculasUnicas = [...new Set(pedidosCandidatos.map(p => String(p['MATRÍCULA'] || p['MATRICULA'] || '')))];
        
        // Extrair informações de servidores baseado nas matriculas
        servidoresEncontrados = data.servidores.filter(s => {
            const mat = String(s['MATRÍCULA'] || s['MATRICULA'] || '');
            return matriculasUnicas.includes(mat);
        });

        // Filtrar a tabela para mostrar dados de todas as pessoas dessas matrículas (mesmo se digitar nome errado em alguns pedidos da mesma matrícula)
        pedidosFiltrados = matriculasUnicas.length > 0
            ? pedidosFiltrados.filter(p => matriculasUnicas.includes(String(p['MATRÍCULA'] || p['MATRICULA'] || '')))
            : pedidosCandidatos;
    }
    
    // Mostra ou esconde as informações dos servidores pesquisados
    const panel = document.getElementById('ponto-servidor-info');
    if (panel) {
        if (servidoresEncontrados.length > 0 && term !== '') {
            showServidoresPontoInfo(servidoresEncontrados, panel);
        } else {
            panel.classList.remove('visible');
        }
    }

    if (pedidosFiltrados.length === 0) {
        tbody.innerHTML = `<tr>
            <td colspan="6" style="text-align:center; padding: 32px; color: var(--text-muted);">
                Nenhum pedido com relatório entregue encontrado.
            </td>
        </tr>`;
        return;
    }

    // Ordenar por data final mais recente, para facilitar o lançamento no ponto dos mais atuais primeiro
    pedidosFiltrados.sort((a, b) => {
        const dateA = parseDate(a['FINAL']) || new Date(0);
        const dateB = parseDate(b['FINAL']) || new Date(0);
        return dateB - dateA;
    });

    let html = '';
    
    // Usar os metadados globais, se disponíveis
    const statusMeta = typeof STATUS_META !== 'undefined' ? STATUS_META : {};

    pedidosFiltrados.forEach(p => {
        const numPedido = p['PEDIDO'] || '—';
        const servidor = p['SERVIDOR'] || '—';
        const mat = p['MATRÍCULA'] || p['MATRICULA'] || '';
        const trecho = p['TRECHO'] || '—';
        
        // Formatação de data via função global formatDate (se existir)
        const inDate = p['INÍCIO'] || p['INICIO'];
        const fnDate = p['FINAL'];
        const inicioDate = typeof formatDate === 'function' ? formatDate(inDate) : inDate || '—';
        const finalDate = typeof formatDate === 'function' ? formatDate(fnDate) : fnDate || '—';
        
        let statusBadge = '';
        const reportDelivered = p['RELATÓRIO'] === true || String(p['RELATÓRIO']).toUpperCase() === 'TRUE';
        
        // Se o relatório foi entregue, renderiza o badge verde; senão, deixa vazio
        if (reportDelivered) {
            statusBadge = `
                <div class="status-badge" style="background: rgba(46, 204, 113, 0.1); color: #2ecc71; border: 1px solid rgba(46, 204, 113, 0.3); font-weight: 500; display: inline-flex; align-items: center; justify-content: center; padding: 6px 14px; border-radius: 20px; font-size: 0.85rem;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    Relatório entregue
                </div>
            `;
        }

        html += `
            <tr>
                <td class="col-pedido"><strong>${numPedido}</strong></td>
                <td class="col-servidor">
                    <div style="display: flex; flex-direction: column;">
                        <span style="font-weight: 500;">${servidor}</span>
                        <span style="font-size: 0.8rem; color: var(--text-muted);">${mat}</span>
                    </div>
                </td>
                <td class="col-trecho">${trecho}</td>
                <td class="col-inicio">${inicioDate}</td>
                <td class="col-final">${finalDate}</td>
                <td class="col-situacao" style="text-align: center;">${statusBadge}</td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

/**
 * Função global chamada ao clicar no nome de um servidor num card do Lançamento de Ponto
 */
window.selectServidorPonto = function(nome) {
    const searchInput = document.getElementById('search-ponto-input');
    if (searchInput && nome) {
        searchInput.value = nome;
        renderLancamentoPonto(nome);
    }
};

/**
 * Exibe as informações em formato de cards igual ao Dashboard, num painel específico
 */
function showServidoresPontoInfo(servidores, panel) {
    if (!panel) return;

    panel.innerHTML = servidores.map((servidor, index) => {
        const isLast = index === servidores.length - 1;
        return `
            <div class="servidor-card-item" style="${!isLast ? 'margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid var(--border-color);' : ''}">
                <div class="servidor-header">
                    <div class="servidor-avatar">${(servidor['SERVIDOR'] || 'S')[0]}</div>
                    <div class="servidor-details">
                        <h3 class="servidor-name-clickable" onclick="selectServidorPonto('${servidor['SERVIDOR'] || ''}')" title="Clique para preencher a busca">${servidor['SERVIDOR'] || '—'}</h3>
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
    // Forçamos que a borda do painel seja igual a do dashboard
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

    // Usando setTimeout diminuto para garantir que o CSS aplique a altura máxima dinamicamente via JS/classe visible
    setTimeout(() => {
        panel.style.padding = '20px';
        panel.style.maxHeight = '2000px';
        panel.style.opacity = '1';
        panel.style.overflowY = 'auto';
    }, 10);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLancamentoPonto);
} else {
    initLancamentoPonto();
}
