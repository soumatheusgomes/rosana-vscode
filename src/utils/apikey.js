const API_KEY = 'API_KEY'
const vscode = require('vscode')

async function setApiKey (context) {
  // Check if context is defined and accessible
  if (!context) {
    vscode.window.showErrorMessage('Error: Context is not available.')
    return
  }

  // Check if context.secrets is defined and accessible
  if (!context.secrets) {
    vscode.window.showErrorMessage('Error: Secrets are not available.')
    return
  }

  // We show a dialog box to the user to enter the Key
  const apiKey = await vscode.window.showInputBox({
    title: 'Enter your API KEY',
    password: true,
    placeHolder: '**************************************',
    ignoreFocusOut: true
  })

  // If the user canceled the dialog
  if (!apiKey) {
    vscode.window.showWarningMessage('Empty value')
    return
  }

  // Storing a secret
  await context.secrets.store(API_KEY, apiKey)

  // Mostramos un mensaje al usuario para confirmar que la token se ha guardado de forma segura
  vscode.window.showInformationMessage('API KEY saved. Use the command "Developer: Reload Window"')
}

module.exports = { setApiKey }
