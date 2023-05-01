const API_KEY = 'API_KEY'
const vscode = require('vscode')

async function setApiKey (context) {
  // Check if context is defined and accessible
  if (!context) {
    vscode.window.showErrorMessage('Erro: o context não está disponível.')
    return
  }

  // Check if context.secrets is defined and accessible
  if (!context.secrets) {
    vscode.window.showErrorMessage('Erro: os secrets não estão disponíveis.')
    return
  }

  // We show a dialog box to the user to enter the Key
  const apiKey = await vscode.window.showInputBox({
    title: 'Digite sua API KEY',
    password: true,
    placeHolder: 'sk-..............................',
    ignoreFocusOut: true
  })

  // If the user canceled the dialog
  if (!apiKey) {
    vscode.window.showWarningMessage('Valor vazio.')
    return
  }

  // Storing a secret
  await context.secrets.store(API_KEY, apiKey)

  vscode.window.showInformationMessage('API KEY salva. Reinicie o VS Code (CTRL + F5 / CMD + F5).')
}

module.exports = { setApiKey }
