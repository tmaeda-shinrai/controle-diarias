/**
 * api.js — Módulo de comunicação com Google Apps Script
 * 
 * Autenticação via Google Sign-In.
 * O ID Token do Google é enviado ao backend, que verifica se o
 * usuário tem acesso à planilha antes de retornar os dados.
 */

const API_URL = 'https://script.google.com/macros/s/AKfycbzwuTUZF07XWZEyQhMbcN2lnbZFPwgn5IBHNDCmCcRuwUAVDGy4JAfwi2Dc3lA2LLFT/exec';

/**
 * Client ID do Google OAuth 2.0 (público — não é um segredo).
 * Gerado no Google Cloud Console > APIs e Serviços > Credenciais.
 * 
 * ⚠️  SUBSTITUA pelo seu Client ID real.
 */
const GOOGLE_CLIENT_ID = '320108951287-hjnhmg0mglksli9cljiq9som7v03ovde.apps.googleusercontent.com';

// Token da sessão Google (apenas em memória — nunca em localStorage)
let _idToken = null;
let _userProfile = null;

// Cache local para reduzir chamadas
let _cache = null;
let _cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

/* ===========================================
   Google Identity Services — Autenticação
   =========================================== */

/**
 * Inicializa o Google Identity Services
 */
function initGoogleAuth() {
  if (typeof google === 'undefined' || !google.accounts) {
    console.error('Google Identity Services não carregou.');
    return;
  }

  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleCredentialResponse,
    auto_select: false,
    cancel_on_tap_outside: true,
  });
}

/**
 * Callback executado após o login com Google
 */
function handleCredentialResponse(response) {
  if (!response.credential) {
    showLoginError('Falha ao autenticar. Tente novamente.');
    return;
  }

  _idToken = response.credential;

  // Decodifica o JWT para obter dados do perfil (parte pública)
  const payload = parseJwt(_idToken);
  _userProfile = {
    email: payload.email,
    name: payload.name,
    picture: payload.picture,
  };

  // Esconde tela de login e mostra o app
  hideLoginScreen();
  showUserInfo();
  initApp();
}

/**
 * Decodifica payload de um JWT (sem verificar assinatura — apenas para exibição)
 */
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return {};
  }
}

/**
 * Exibe o botão "Entrar com Google" usando o prompt nativo
 */
function triggerGoogleLogin() {
  // Usa o renderButton como fallback e também o prompt
  const btnContainer = document.getElementById('google-btn-container');
  if (btnContainer) {
    google.accounts.id.renderButton(btnContainer, {
      type: 'standard',
      shape: 'rectangular',
      theme: 'filled_blue',
      size: 'large',
      text: 'signin_with',
      locale: 'pt-BR',
      width: 280,
    });
  }
}

/**
 * Faz logout do sistema
 */
function handleLogout() {
  _idToken = null;
  _userProfile = null;
  _cache = null;
  _cacheTimestamp = 0;

  google.accounts.id.disableAutoSelect();

  showLoginScreen();
  hideUserInfo();
}

/* ===========================================
   UI — Login Screen
   =========================================== */

function hideLoginScreen() {
  const loginScreen = document.getElementById('login-screen');
  const appContainer = document.querySelector('.app-container');
  if (loginScreen) loginScreen.classList.add('hidden');
  if (appContainer) appContainer.style.display = '';
}

function showLoginScreen() {
  const loginScreen = document.getElementById('login-screen');
  const appContainer = document.querySelector('.app-container');
  if (loginScreen) loginScreen.classList.remove('hidden');
  if (appContainer) appContainer.style.display = 'none';
  // Renderiza o botão do Google novamente
  triggerGoogleLogin();
}

function showLoginError(message) {
  const errorEl = document.getElementById('login-error');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add('visible');
  }
}

function hideLoginError() {
  const errorEl = document.getElementById('login-error');
  if (errorEl) errorEl.classList.remove('visible');
}

function showUserInfo() {
  const userInfoEl = document.getElementById('user-info');
  if (userInfoEl && _userProfile) {
    const avatar = userInfoEl.querySelector('.user-avatar');
    const email = userInfoEl.querySelector('.user-email');
    if (avatar) avatar.src = _userProfile.picture || '';
    if (email) email.textContent = _userProfile.email || '';
    userInfoEl.style.display = 'flex';
  }
}

function hideUserInfo() {
  const userInfoEl = document.getElementById('user-info');
  if (userInfoEl) userInfoEl.style.display = 'none';
}

/* ===========================================
   API — Comunicação com o Backend
   =========================================== */

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

  if (!_idToken) {
    throw new Error('Usuário não autenticado.');
  }

  try {
    showLoading(true);
    const response = await fetch(`${API_URL}?action=getAll&id_token=${encodeURIComponent(_idToken)}`);

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      // Se o erro for de acesso, volta para a tela de login
      if (data.error.includes('Acesso negado') || data.error.includes('Token')) {
        handleLogout();
        showLoginError(data.error);
      }
      throw new Error(data.error);
    }

    _cache = data;
    _cacheTimestamp = now;
    return data;

  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    showError('Não foi possível carregar os dados. Verifique sua conexão e tente novamente.');
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
  if (!_idToken) {
    throw new Error('Usuário não autenticado.');
  }

  try {
    const response = await fetch(`${API_URL}?action=getSheet&sheet=${encodeURIComponent(sheetName)}&id_token=${encodeURIComponent(_idToken)}`);

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

/**
 * Verifica se o usuário está autenticado
 */
function isAuthenticated() {
  return _idToken !== null;
}
