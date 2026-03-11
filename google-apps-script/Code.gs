/**
 * Google Apps Script - Backend API para App Diárias
 *
 * INSTRUÇÕES DE DEPLOY:
 * 1. Acesse https://script.google.com e crie um novo projeto
 * 2. Cole este código no editor
 * 3. Substitua SPREADSHEET_ID e GOOGLE_CLIENT_ID pelos valores reais
 * 4. Clique em "Implantar" > "Nova implantação"
 * 5. Tipo: "App da Web"
 * 6. Executar como: "Eu" (sua conta)
 * 7. Quem tem acesso: "Qualquer pessoa"
 * 8. Copie a URL gerada e cole no arquivo js/api.js (variável API_URL)
 *
 * SEGURANÇA:
 * - A autenticação é feita via Google Sign-In (ID Token)
 * - O backend verifica se o token é válido e se o email tem acesso à planilha
 * - Apenas viewers e editors da planilha recebem os dados
 */

const SPREADSHEET_ID = '1EtSEJiIW2W_O17hWK6lFuoeMonhvmSuNYhC92ygbn28';

/**
 * Client ID do Google OAuth 2.0.
 * Deve ser o MESMO Client ID configurado no frontend (js/api.js).
 * Gerado no Google Cloud Console > APIs e Serviços > Credenciais.
 *
 * ⚠️  SUBSTITUA pelo seu Client ID real.
 */
const GOOGLE_CLIENT_ID = '320108951287-hjnhmg0mglksli9cljiq9som7v03ovde.apps.googleusercontent.com';

/**
 * Verifica o ID Token do Google e retorna o email do usuário.
 * @param {string} idToken - Token JWT do Google Identity Services
 * @returns {string} Email do usuário autenticado
 * @throws {Error} Se o token for inválido
 */
function verificarTokenGoogle(idToken) {
  if (!idToken) {
    throw new Error('Token de autenticação ausente.');
  }

  try {
    const response = UrlFetchApp.fetch(
      'https://oauth2.googleapis.com/tokeninfo?id_token=' + idToken,
      { muteHttpExceptions: true }
    );

    const statusCode = response.getResponseCode();
    if (statusCode !== 200) {
      throw new Error('Token inválido ou expirado.');
    }

    const payload = JSON.parse(response.getContentText());

    // Verifica se o token foi emitido para o nosso Client ID
    if (payload.aud !== GOOGLE_CLIENT_ID) {
      throw new Error('Token não foi emitido para esta aplicação.');
    }

    // Verifica se o token não está expirado
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && parseInt(payload.exp) < now) {
      throw new Error('Token expirado. Faça login novamente.');
    }

    return payload.email;
  } catch (error) {
    if (error.message.includes('Token')) {
      throw error;
    }
    throw new Error('Falha ao verificar autenticação: ' + error.message);
  }
}

/**
 * Verifica se o email tem acesso (viewer ou editor) à planilha.
 * @param {string} email - Email do usuário autenticado
 * @returns {boolean}
 */
function emailTemAcessoAPlanilha(email) {
  try {
    const file = DriveApp.getFileById(SPREADSHEET_ID);
    const emailLower = email.toLowerCase();

    // Verifica se é editor
    const editors = file.getEditors();
    for (let i = 0; i < editors.length; i++) {
      if (editors[i].getEmail().toLowerCase() === emailLower) {
        return true;
      }
    }

    // Verifica se é viewer
    const viewers = file.getViewers();
    for (let i = 0; i < viewers.length; i++) {
      if (viewers[i].getEmail().toLowerCase() === emailLower) {
        return true;
      }
    }

    // Verifica se o proprietário é o próprio usuário
    const owner = file.getOwner();
    if (owner && owner.getEmail().toLowerCase() === emailLower) {
      return true;
    }

    return false;
  } catch (error) {
    Logger.log('Erro ao verificar acesso: ' + error.message);
    return false;
  }
}

/**
 * Handler principal para requisições GET
 */
function doGet(e) {
  const params = e.parameter;
  const idToken = params.id_token;

  // 1. Verifica o token de autenticação Google
  let email;
  try {
    email = verificarTokenGoogle(idToken);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        error: 'Acesso negado. ' + error.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // 2. Verifica se o email tem acesso à planilha
  if (!emailTemAcessoAPlanilha(email)) {
    return ContentService
      .createTextOutput(JSON.stringify({
        error: 'Acesso negado. Seu email (' + email + ') não tem permissão para acessar esta planilha. Solicite acesso ao administrador.'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // 3. Processa a requisição
  const action = params.action || 'getAll';

  try {
    let result;

    switch (action) {
      case 'getSheet':
        result = getSheetData(params.sheet);
        break;
      case 'getAll':
        result = getAllData();
        break;
      default:
        result = { error: 'Ação não reconhecida: ' + action };
    }

    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Retorna todos os dados de todas as abas necessárias
 */
function getAllData() {
  return {
    pedidos: getSheetData('PEDIDOS'),
    relPagamento: getSheetData('REL_PAGAMENTO'),
    servidores: getSheetData('SERVIDORES'),
    servicos: getSheetData('SERVIÇOS'),
    cotas: getSheetData('COTAS'),
    assinaturasPendentes: getSheetData('ASSINATURAS_PENDENTES')
  };
}

/**
 * Retorna os dados de uma aba específica como array de objetos
 * @param {string} sheetName - Nome da aba
 * @returns {Array<Object>} Dados da aba
 */
function getSheetData(sheetName) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    throw new Error('Aba não encontrada: ' + sheetName);
  }

  const data = sheet.getDataRange().getValues();

  if (data.length < 2) {
    return [];
  }

  const headers = data[0].map(h => String(h).trim());
  const rows = [];

  for (let i = 1; i < data.length; i++) {
    const row = {};
    let hasValue = false;

    for (let j = 0; j < headers.length; j++) {
      let value = data[i][j];

      // Converte datas para string ISO
      if (value instanceof Date) {
        value = Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd');
      }

      // Converte booleanos
      if (typeof value === 'string') {
        if (value.toUpperCase() === 'TRUE') value = true;
        else if (value.toUpperCase() === 'FALSE') value = false;
      }

      row[headers[j]] = value;
      if (value !== '' && value !== null && value !== undefined) {
        hasValue = true;
      }
    }

    if (hasValue) {
      rows.push(row);
    }
  }

  return rows;
}

/**
 * Handler para requisições POST (operações de escrita — uso futuro)
 */
function doPost(e) {
  const params = e.parameter;
  const idToken = params.id_token;

  // Verifica autenticação
  let email;
  try {
    email = verificarTokenGoogle(idToken);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        error: 'Acesso negado. ' + error.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Verifica acesso à planilha
  if (!emailTemAcessoAPlanilha(email)) {
    return ContentService
      .createTextOutput(JSON.stringify({
        error: 'Acesso negado. Sem permissão.'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  try {
    const body = JSON.parse(e.postData.contents);
    return ContentService
      .createTextOutput(JSON.stringify({ error: 'Ação POST não implementada: ' + (body.action || '?') }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Função para testes — execute no editor do Apps Script
 */
function testGetAllData() {
  const data = getAllData();
  Logger.log(JSON.stringify(data, null, 2));
}

/**
 * Testa a verificação de acesso do proprietário/editor/viewer
 */
function testVerificarAcesso() {
  const email = Session.getActiveUser().getEmail();
  Logger.log('Email: ' + email);
  Logger.log('Tem acesso: ' + emailTemAcessoAPlanilha(email));
}
