/**
 * cotas.js — Lógica para a visualização de Cotas Mensais por Diretoria (Fase 3)
 */

// Estado local da view de Cotas
const cotasState = {
    mesesAno: [], // Lista combinada ex: "JANEIRO/2026"
    mesAtual: "",
    anoAtual: "",
    diretorias: ["DIRAD", "DIRHAB", "DIRET", "DIRVE", "PRESIDÊNCIA", "FISC. DE TRÂNSITO", "DIRENG", "INTERESTADUAL"],
    diretoriaSelecionada: null
};

/**
 * Inicializa a view de Cotas (chamado após carregar os dados no app.js)
 */
function initCotas() {
    setupCotasFilters();

    // Adicionar listener na tab de Cotas para desenhar na primeira vez que clicar
    const btnCotas = document.querySelector('.tab-btn[data-target="view-cotas"]');
    if (btnCotas) {
        btnCotas.addEventListener('click', () => {
            carregarFiltrosIniciais(); // Chama sempre; ele reescreve só se precisar
        });
    }

    // Fechar painel de detalhes
    const closeBtn = document.getElementById('close-cota-detalhes-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', fecharDetalhesCota);
    }
}

/**
 * Lê a aba COTAS para extrair Mês e Ano disponíveis
 */
function carregarFiltrosIniciais() {
    const data = window.__appData;
    if (!data || !data.cotas) return;

    const selectMes = document.getElementById('cota-mes-select');
    const selectAno = document.getElementById('cota-ano-select');

    if (!selectMes || !selectAno) return;

    // Extrai meses e anos únicos
    const mesesSet = new Set();
    const anosSet = new Set();

    data.cotas.forEach(row => {
        if (row['MÊS']) mesesSet.add(String(row['MÊS']).toUpperCase());
        if (row['ANO']) anosSet.add(String(row['ANO']));
    });

    const meses = Array.from(mesesSet);
    const anos = Array.from(anosSet).sort().reverse(); // Anos mais recentes primeiro

    // Preenche selects
    selectMes.innerHTML = meses.map(m => `<option value="${m}">${m}</option>`).join('');
    selectAno.innerHTML = anos.map(a => `<option value="${a}">${a}</option>`).join('');

    if (meses.length === 0) {
        document.getElementById('cotas-grid').innerHTML = `
            <div class="empty-state">
                <p>Nenhuma cota cadastrada base de dados.</p>
            </div>
        `;
        return;
    }

    // Seleciona o primeiro mês/ano por padrão e processa
    cotasState.mesAtual = selectMes.value;
    cotasState.anoAtual = selectAno.value;

    renderizarCotasGrid();
}

/**
 * Adiciona eventos aos selects
 */
function setupCotasFilters() {
    const selectMes = document.getElementById('cota-mes-select');
    const selectAno = document.getElementById('cota-ano-select');

    if (selectMes) {
        selectMes.addEventListener('change', (e) => {
            cotasState.mesAtual = e.target.value;
            fecharDetalhesCota();
            renderizarCotasGrid();
        });
    }

    if (selectAno) {
        selectAno.addEventListener('change', (e) => {
            cotasState.anoAtual = e.target.value;
            fecharDetalhesCota();
            renderizarCotasGrid();
        });
    }
}

/**
 * Recupera os dados do mês/ano e desenha os cards de cada diretoria
 */
function renderizarCotasGrid() {
    const grid = document.getElementById('cotas-grid');
    if (!grid) return;

    const data = window.__appData;
    if (!data || !data.cotas) return;

    // Busca a linha correspondente ao mês e ano selecionados
    const cotaMes = data.cotas.find(c =>
        String(c['MÊS']).toUpperCase() === cotasState.mesAtual &&
        String(c['ANO']) === cotasState.anoAtual
    );

    if (!cotaMes) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <p>Nenhuma cota definida para <strong>${cotasState.mesAtual}/${cotasState.anoAtual}</strong>.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = ''; // Limpa grid

    cotasState.diretorias.forEach(dir => {
        // Ignorar se a coluna não existir (algumas abas podem não ter todas configuradas ainda)
        if (cotaMes[dir] === undefined) return;

        // Limpeza de string e fallback para strings vazias (R$ 25.000,00 -> 25000)
        let tStr = String(cotaMes[dir] || '0').trim();
        if (tStr === '') tStr = '0';
        const totalStr = tStr.replace(/[^\d,]/g, '').replace(',', '.');
        const countTotal = parseFloat(totalStr) || 0;

        const utilKey = `${dir} - UTILIZADO`;
        let uStr = String(cotaMes[utilKey] || '0').trim();
        if (uStr === '') uStr = '0';
        const utilStr = uStr.replace(/[^\d,]/g, '').replace(',', '.');
        const countUtilizado = parseFloat(utilStr) || 0;

        // Se total for zero e util = 0, para não dividir por 0
        let percentage = 0;
        if (countTotal > 0) {
            percentage = (countUtilizado / countTotal) * 100;
        } else if (countUtilizado > 0) {
            // Caso a cota limite seja 0 mas teve gasto (ex: Interestadual)
            percentage = 100;
        }

        // Determinar cor baseada no consumo
        let cssClass = 'safe';
        if (percentage >= 90) cssClass = 'danger';
        else if (percentage >= 75) cssClass = 'warning';

        // Formatação
        const fmtTotal = countTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        const fmtUtilizado = countUtilizado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        // Garante limite visual da barra em 100%
        const barWidth = Math.min(percentage, 100);

        const card = document.createElement('div');
        card.className = 'cota-card';
        card.setAttribute('data-dir', dir);
        card.innerHTML = `
            <div class="cota-diretoria-name">
                ${dir}
                ${percentage >= 100 ? '<span title="Cota Excedida">⚠️</span>' : ''}
            </div>
            
            <div class="cota-values-row">
                <span class="cota-label">Cota Total</span>
                <span class="cota-val">${fmtTotal}</span>
            </div>
            
            <div class="cota-values-row">
                <span class="cota-label">Utilizado</span>
                <span class="cota-val utilizado">${fmtUtilizado}</span>
            </div>

            <div class="cota-progress-container">
                <div class="cota-progress-bar ${cssClass}" style="width: ${barWidth}%"></div>
            </div>
            
            <span class="cota-percentage">${percentage.toFixed(1)}% consumido</span>
        `;

        // Evento de clique no Card
        card.addEventListener('click', () => abrirDetalhesCota(dir));

        grid.appendChild(card);
    });
}

/**
 * Abre o detalhamento listando os pedidos daquela diretoria que consumiram a cota no mes
 */
function abrirDetalhesCota(dir) {
    cotasState.diretoriaSelecionada = dir;

    // Ajuste visual nos cards
    document.querySelectorAll('.cota-card').forEach(c => {
        c.classList.toggle('selected', c.getAttribute('data-dir') === dir);
    });

    const section = document.getElementById('cota-detalhes-section');
    const titleEl = document.getElementById('cota-detalhe-title');
    const countEl = document.getElementById('cota-detalhe-count');
    const tbody = document.querySelector('#table-cota-detalhes tbody');

    titleEl.textContent = `Detalhamento — ${dir}`;
    tbody.innerHTML = '';

    const data = window.__appData;

    // 1. Identificar quais SERVIÇOS pertencem a esta diretoria
    const servicosDir = data.servicos
        .filter(s => String(s['DIRETORIA']).trim().toUpperCase() === dir.toUpperCase())
        .map(s => String(s['SERVIÇO']).trim().toUpperCase());

    // 2. Filtrar os pedidos que possuem tais serviços e que ACONTECERAM no mês/ano foco
    // *Regra de Negócio Adaptado do mockData/instruções: a cota mensal é calculada 
    // com base no INÍCIO do pedido. (Verificação por string MÊS).
    const mesIndexMap = {
        'JANEIRO': 0, 'FEVEREIRO': 1, 'MARÇO': 2, 'ABRIL': 3, 'MAIO': 4, 'JUNHO': 5,
        'JULHO': 6, 'AGOSTO': 7, 'SETEMBRO': 8, 'OUTUBRO': 9, 'NOVEMBRO': 10, 'DEZEMBRO': 11
    };

    const targetMonth = mesIndexMap[cotasState.mesAtual];
    const targetYear = parseInt(cotasState.anoAtual);

    const pedidosDaDiretoria = data.pedidos.filter(p => {
        const pServico = String(p['SERVIÇO']).trim().toUpperCase();
        if (!servicosDir.includes(pServico)) return false;

        // Confere mes/ano do inicio
        // Usar parseDate global se houver ou string split default js
        let pDate;
        if (typeof parseDate === 'function') {
            pDate = parseDate(p['INÍCIO'] || p['INICIO']);
        } else {
            pDate = new Date(p['INÍCIO'] || p['INICIO']);
        }

        if (!pDate || isNaN(pDate)) return false;

        return pDate.getMonth() === targetMonth && pDate.getFullYear() === targetYear;
    });

    countEl.textContent = `${pedidosDaDiretoria.length} pedido(s)`;

    if (pedidosDaDiretoria.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-table" style="text-align: center; padding: 24px; color: var(--text-muted);">Nenhum gasto registrado vinculando aos serviços desta diretoria neste mês exato.</td></tr>';
    } else {
        pedidosDaDiretoria.forEach(p => {
            let startV = typeof formatDate === 'function' ? formatDate(p['INÍCIO'] || p['INICIO']) : p['INÍCIO'];

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="col-pedido">${p['PEDIDO'] || '—'}</td>
                <td class="col-servidor">${p['SERVIDOR'] || '—'}</td>
                <td class="col-servico">${p['SERVIÇO'] || '—'}</td>
                <td class="col-inicio">${startV}</td>
                <td class="col-valor" style="font-weight: 600; color: var(--accent-warning);">${p['VALOR'] || '—'}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    section.classList.add('visible');

    setTimeout(() => {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

function fecharDetalhesCota() {
    cotasState.diretoriaSelecionada = null;
    const section = document.getElementById('cota-detalhes-section');
    if (section) section.classList.remove('visible');

    document.querySelectorAll('.cota-card').forEach(c => {
        c.classList.remove('selected');
    });
}

// Expõe para janela global para ser chamado após o fetch principal
window.initCotas = initCotas;
window.carregarFiltrosIniciais = carregarFiltrosIniciais;

// Inicia se script carregado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCotas);
} else {
    initCotas();
}
