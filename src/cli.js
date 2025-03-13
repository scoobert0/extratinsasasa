const inquirer = require('inquirer');
const { getTextFiles } = require('./fileList');

async function promptUser() {
  try {
    const txtFiles = await getTextFiles();
    
    if (txtFiles.length === 0) {
      throw new Error('NAO HA ARQUIVOS TXT NA PASTA DATA');
    }

    const { mode } = await inquirer.prompt([
      {
        type: 'list',
        name: 'mode',
        message: '🔍 SELECIONAR MODO DE BUSCA:',
        choices: [
          { name: '🔎 BUSCA POR URL', value: 'term' },
          { name: '💳 EXTRAIR CC', value: 'cc' },
          { name: '🔄 EXTRAIR CONSULTAVEL', value: 'consultavel' },
          { name: '📧 EXTRAIR EMAILS POR PROVEDOR', value: 'email' },
          { name: '📱 EXTRAIR TELEFONE E SENHA', value: 'phone' },
          { name: '🔢 EXTRAIR CPF E SENHA DE 6', value: 'cpf6' },
          { name: '🔢 EXTRAIR CPF E SENHA DE 8', value: 'cpf8' },
          { name: '🔡 EXTRAIR CPF E SENHA ALFANUMERICA', value: 'cpfalpha' },
          { name: '🏛️ EXTRAIR LOGINS GOV', value: 'gov' },
          { name: '🔍 EXTRAIR LOGINS DE PAINEL DE CONSULTA', value: 'consultation' }
        ]
      }
    ]);

    const { inputFile } = await inquirer.prompt([
      {
        type: 'list',
        name: 'inputFile',
        message: '📁 SELECIONE O ARQUIVO DE ENTRADA:',
        choices: txtFiles
      }
    ]);

    let searchTerm = '';
    if (mode === 'term') {
      const answer = await inquirer.prompt([
        {
          type: 'input',
          name: 'searchTerm',
          message: '✏️ INIRA A URL OU TERMO A SER BUSCADO:',
          validate: input => input.trim().length > 0 || '❌ NAO PODE SER VAZIO'
        }
      ]);
      searchTerm = answer.searchTerm.trim();
    }

    return {
      mode,
      searchTerm,
      inputFile,
      outputFile: mode === 'email' ? 'emails' : 
                  mode === 'gov' ? 'gov_logins' : 
                  mode === 'consultation' ? 'consultation_logins' : 
                  `results_${Date.now()}.txt`
    };
  } catch (error) {
    throw new Error(`❌ CLI Error: ${error.message}`);
  }
}

module.exports = { promptUser };