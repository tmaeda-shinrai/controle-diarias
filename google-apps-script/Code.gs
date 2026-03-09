/**
 * Google Apps Script - Backend API para App Diárias
 *
 * INSTRUÇÕES DE DEPLOY:
 * 1. Acesse https://script.google.com e crie um novo projeto
 * 2. Cole este código no editor
 * 3. Substitua SPREADSHEET_ID e ACCESS_TOKEN pelos valores reais
 * 4. Clique em "Implantar" > "Nova implantação"
 * 5. Tipo: "App da Web"
 * 6. Executar como: "Eu" (sua conta)
 * 7. Quem tem acesso: "Qualquer pessoa"
 * 8. Copie a URL gerada e cole no arquivo js/api.js (variável API_URL)
 * 9. Cole o mesmo ACCESS_TOKEN no arquivo js/api.js (variável ACCESS_TOKEN)
 */

const SPREADSHEET_ID = '1EtSEJiIW2W_O17hWK6lFuoeMonhvmSuNYhC92ygbn28';

/**
 * Token de acesso — funciona como uma senha compartilhada.
 * Somente quem tiver este token consegue chamar a API.
 * Use uma string longa e aleatória; compartilhe apenas com
 * quem deve ter acesso ao sistema.
 * Gere um token em: https://passwordsgenerator.net/
 */
const ACCESS_TOKEN = '$1leAh3FKwtRXO2cyPkHgY4D2D8JDdF2nvszIo!A';

/**
 * Verifica se o token enviado na requisição é válido.
 * @param {Object} params - e.parameter do doGet / corpo do doPost
 * @returns {boolean}
 */
function tokenValido(params) {
  return params && params.token === ACCESS_TOKEN;
}

/**
 * Handler principal para requisições GET
 */
function doGet(e) {
  // Valida o token de acesso
  if (!tokenValido(e.parameter)) {
    return ContentService
      .createTextOutput(JSON.stringify({
        error: 'Acesso negado. Token inválido ou ausente.'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const params = e.parameter;
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
  if (!usuarioTemAcesso()) {
    return ContentService
      .createTextOutput(JSON.stringify({
        error: 'Acesso negado. Solicite acesso à planilha de diárias para utilizar este sistema.'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  try {
    const body = JSON.parse(e.postData.contents);
    // Implementar ações de escrita conforme necessário
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
 * Testa a verificação de acesso para o usuário atual
 */
function testAcesso() {
  Logger.log('Email: ' + Session.getActiveUser().getEmail());
  Logger.log('Tem acesso: ' + usuarioTemAcesso());
}
