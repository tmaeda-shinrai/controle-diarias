/**
 * dashboard.js — Renderização do Dashboard
 */

let _expandedStatus = null;
let _currentFilter = '';
let _filteredServidor = null;

/**
 * Renderiza o dashboard completo
 * @param {Object} processedData - Dados de processarTodosStatus()
 * @param {Object} rawData - Dados brutos da API
 */
function renderDashboard(processedData, rawData) {
  renderCards(processedData.statusCounts);
  renderTotals(processedData);

  if (_expandedStatus) {
    renderExpandedTable(processedData.statusPedidos[_expandedStatus] || [], _expandedStatus, rawData);
  }
}

/**
 * Renderiza os cards de status
 */
function renderCards(statusCounts) {
  const container = document.getElementById('status-cards');
  if (!container) return;

  container.innerHTML = '';

  const orderedStatuses = Object.values(STATUS).sort((a, b) => {
    return STATUS_META[a].order - STATUS_META[b].order;
  });

  orderedStatuses.forEach(status => {
    const meta = STATUS_META[status];
    const count = statusCounts[status] || 0;
    const isExpanded = _expandedStatus === status;

    const card = document.createElement('div');
    card.className = `status-card ${isExpanded ? 'expanded' : ''} ${count === 0 ? 'empty' : ''}`;
    card.style.setProperty('--card-gradient', meta.gradient);
    card.setAttribute('data-status', status);

    card.innerHTML = `
      <div class="card-glow"></div>
      <div class="card-content">
        <div class="card-icon">${meta.icon}</div>
        <div class="card-info">
          <span class="card-count">${count}</span>
          <span class="card-label">${status}</span>
        </div>
      </div>
      <div class="card-indicator">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
    `;

    card.addEventListener('click', () => toggleCardExpansion(status));
    container.appendChild(card);
  });
}

/**
 * Renderiza totais no header
 */
function renderTotals(processedData) {
  const totalEl = document.getElementById('total-solicitacoes');
  const pendentesEl = document.getElementById('total-pendentes');

  if (totalEl) {
    totalEl.textContent = processedData.allPedidos.length;
  }

  if (pendentesEl) {
    const pendentes = [
      STATUS.RELATORIO_PENDENTE,
      STATUS.DEVOLUCAO_PENDENTE,
      STATUS.REEMBOLSO_EM_PROCESSO,
      STATUS.ASSINATURA_PENDENTE
    ].reduce((sum, s) => sum + (processedData.statusCounts[s] || 0), 0);
    pendentesEl.textContent = pendentes;
  }
}

/**
 * Alterna a expansão de um card
 */
function toggleCardExpansion(status) {
  const tableSection = document.getElementById('expanded-table-section');

  if (_expandedStatus === status) {
    _expandedStatus = null;
    tableSection.classList.remove('visible');
    document.querySelectorAll('.status-card').forEach(c => c.classList.remove('expanded'));
    return;
  }

  _expandedStatus = status;
  document.querySelectorAll('.status-card').forEach(c => {
    c.classList.toggle('expanded', c.getAttribute('data-status') === status);
  });

  const data = window.__filteredData || window.__appData;
  if (data) {
    const processed = processarTodosStatus(data);
    renderExpandedTable(processed.statusPedidos[status] || [], status, data);
    tableSection.classList.add('visible');

    // Scroll suave até a tabela
    setTimeout(() => {
      tableSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }
}

/**
 * Renderiza a tabela expandida para um status
 */
function renderExpandedTable(pedidos, status, rawData) {
  const section = document.getElementById('expanded-table-section');
  const meta = STATUS_META[status];

  const headerEl = section.querySelector('.table-header');
  headerEl.innerHTML = `
    <span class="table-status-icon">${meta.icon}</span>
    <span class="table-status-name">${status}</span>
    <span class="table-count-badge">${pedidos.length} solicitaç${pedidos.length === 1 ? 'ão' : 'ões'}</span>
    <button class="close-table-btn" onclick="toggleCardExpansion('${status}')" title="Fechar">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </button>
  `;

  const tbody = section.querySelector('tbody');
  tbody.innerHTML = '';

  if (pedidos.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="empty-table">Nenhuma solicitação neste status</td>
      </tr>
    `;
    return;
  }

  // Busca dados de REL_PAGAMENTO para exibir valor e relatório
  const relPagamento = rawData.relPagamento || [];

  pedidos.forEach(pedido => {
    const relPag = relPagamento.find(r => {
      const pId = extrairSeqAno(r['PEDIDO']);
      const curId = extrairSeqAno(pedido['PEDIDO']);
      return pId && curId && pId.seq === curId.seq && pId.ano === curId.ano && String(r['TIPO']).toLowerCase() === 'pedido';
    });
    const relatorioEntregue = pedido['RELATÓRIO'] === true || pedido['RELATÓRIO'] === 'TRUE';

    // Badge exibido na coluna Situação
    let situacaoBadge = '—';
    if (status === STATUS.PEDIDO_SALVO && relatorioEntregue) {
      situacaoBadge = `<span class="badge-relatorio-entregue">📄 Relatório entregue</span>`;
    }

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="col-pedido">${pedido['PEDIDO'] || '—'}</td>
      <td class="col-servidor">${pedido['SERVIDOR'] || '—'}</td>
      <td class="col-trecho">${pedido['TRECHO'] || '—'}</td>
      <td class="col-inicio">${formatDate(pedido['INÍCIO'] || pedido['INICIO'])}</td>
      <td class="col-final">${formatDate(pedido['FINAL'])}</td>
      <td class="col-valor">${pedido['VALOR'] || '—'}</td>
      <td class="col-quant">${pedido['QUANT.'] || '—'}</td>
      <td class="col-situacao">${situacaoBadge}</td>
    `;
    tbody.appendChild(tr);
  });
}

/**
 * Aplica filtro de busca por nome ou matrícula
 */
function applyFilter(searchTerm) {
  _currentFilter = searchTerm.trim().toLowerCase();
  _filteredServidor = null;

  const data = window.__appData;
  if (!data) return;

  let filteredData;

  if (_currentFilter === '') {
    filteredData = { ...data };
    hideServidorInfo();
  } else {
    // 1ª passagem: encontra todos os pedidos que batem com o texto
    const pedidosCandidatos = data.pedidos.filter(p => {
      const nome = String(p['SERVIDOR'] || '').toLowerCase();
      const matricula = String(p['MATRÍCULA'] || p['MATRICULA'] || '').toLowerCase();
      return nome.includes(_currentFilter) || matricula.includes(_currentFilter);
    });

    const matriculasCandidatas = [...new Set(pedidosCandidatos.map(p => String(p['MATRÍCULA'] || p['MATRICULA'] || '')))];

    // Identifica os servidores de todos os pedidos encontrados
    const servidoresEncontrados = data.servidores.filter(s => {
      const mat = String(s['MATRÍCULA'] || s['MATRICULA'] || '');
      return matriculasCandidatas.includes(mat);
    });

    if (servidoresEncontrados.length > 0) {
      _filteredServidor = servidoresEncontrados[0]; // Mantendo para compatibilidade caso seja usado em outro lugar
      showServidoresInfo(servidoresEncontrados);
    } else {
      hideServidorInfo();
    }

    // 2ª passagem: os pedidos exibidos serão TODOS os pedidos das matrículas candidatas (para evitar que pedidos com erros de digitação de nome fiquem de fora)
    const pedidosFiltrados = matriculasCandidatas.length > 0
      ? data.pedidos.filter(p => 
        matriculasCandidatas.includes(String(p['MATRÍCULA'] || p['MATRICULA'] || '')))
      : pedidosCandidatos;

    // Filtra REL_PAGAMENTO pelos pedidos finais
    const pedidoNums = new Set(pedidosFiltrados.map(p => p['PEDIDO']));
    const relFiltrado = data.relPagamento.filter(r => pedidoNums.has(r['PEDIDO']));

    filteredData = {
      ...data,
      pedidos: pedidosFiltrados,
      relPagamento: relFiltrado
    };
  }

  const processed = processarTodosStatus(filteredData);
  window.__filteredData = filteredData;
  renderDashboard(processed, filteredData);
}

window.selectServidor = function(nome) {
  const searchInput = document.getElementById('search-input');
  if (searchInput && nome) {
    searchInput.value = nome;
    applyFilter(nome);
  }
};

/**
 * Exibe informações dos servidores filtrados
 */
function showServidoresInfo(servidores) {
  const panel = document.getElementById('servidor-info');
  if (!panel) return;

  panel.innerHTML = servidores.map((servidor, index) => {
    const isLast = index === servidores.length - 1;
    return `
      <div class="servidor-card-item" style="${!isLast ? 'margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid var(--border-color);' : ''}">
        <div class="servidor-header">
          <div class="servidor-avatar">${(servidor['SERVIDOR'] || 'S')[0]}</div>
          <div class="servidor-details">
            <h3 class="servidor-name-clickable" onclick="selectServidor('${servidor['SERVIDOR'] || ''}')" title="Clique para preencher a busca">${servidor['SERVIDOR'] || '—'}</h3>
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
}

/**
 * Esconde o painel de informações do servidor
 */
function hideServidorInfo() {
  const panel = document.getElementById('servidor-info');
  if (panel) {
    panel.classList.remove('visible');
  }
}

/**
 * Formata data para exibição (dd/mm/yyyy)
 */
function formatDate(value) {
  if (!value) return '—';

  const date = parseDate(value);
  if (!date) return String(value);

  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();

  return `${dd}/${mm}/${yyyy}`;
}
