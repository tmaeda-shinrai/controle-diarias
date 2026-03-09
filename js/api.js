/**
 * api.js — Módulo de comunicação com Google Apps Script
 * 
 * IMPORTANTE: Substitua a URL abaixo pela URL da sua implantação do Apps Script.
 */

const API_URL = 'https://script.google.com/macros/s/AKfycbyOSiPzt8Zo-mbMBDKphnw3bC8Fhmzy6ernn-DK3Hw-CAiO9Hxq9s1i0TQ2xBRM_9xN/exec';

/**
 * Token de acesso — deve ser idêntico ao definido em Code.gs.
 * Compartilhe apenas com quem deve ter acesso ao sistema.
 */
const ACCESS_TOKEN = '$1leAh3FKwtRXO2cyPkHgY4D2D8JDdF2nvszIo!A';

// Cache local para reduzir chamadas
let _cache = null;
let _cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

/**
 * Busca todos os dados da API (com cache)
 * @param {boolean} forceRefresh - Se true, ignora o cache
 * @returns {Promise<Object>} Todos os dados das abas
 */
async function fetchAllData(forceRefresh = false) {
  const now = Date.now();

  if (!forceRefresh && _cache && (now - _cacheTimestamp) < CACHE_TTL) {
    return _cache;
  }

  try {
    showLoading(true);
    const response = await fetch(`${API_URL}?action=getAll&token=${encodeURIComponent(ACCESS_TOKEN)}`);

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    _cache = data;
    _cacheTimestamp = now;
    return data;

  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    showError('Não foi possível carregar os dados. Verifique sua conexão e a URL da API.');
    throw error;
  } finally {
    showLoading(false);
  }
}

/**
 * Busca dados de uma aba específica
 * @param {string} sheetName - Nome da aba
 * @returns {Promise<Array>}
 */
async function fetchSheet(sheetName) {
  try {
    const response = await fetch(`${API_URL}?action=getSheet&sheet=${encodeURIComponent(sheetName)}&token=${encodeURIComponent(ACCESS_TOKEN)}`);

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Erro ao buscar aba ${sheetName}:`, error);
    throw error;
  }
}

/**
 * Invalida o cache (para forçar recarga na próxima busca)
 */
function invalidateCache() {
  _cache = null;
  _cacheTimestamp = 0;
}

/**
 * Mostra/esconde indicador de carregamento
 */
function showLoading(show) {
  const loader = document.getElementById('loading-overlay');
  if (loader) {
    loader.classList.toggle('active', show);
  }
}

/**
 * Exibe mensagem de erro na tela
 */
function showError(message) {
  const errorEl = document.getElementById('error-toast');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add('visible');
    setTimeout(() => errorEl.classList.remove('visible'), 6000);
  }
}
