const vscode = require('vscode')
const prompts = require('./utils/prompts.js')
const openAIClient = require('./clients/openai_client.js')
const cohereClient = require('./clients/cohere_client.js')
const aiClient = require('./clients/ai_client.js')
const anthropicClient = require('./clients/anthropic_client.js')

// OpenAI - Cohere API Key
const API_KEY = 'API_KEY'

class ChatSidebarProvider {
  constructor(context) {
    this._view = null
    this._extensionUri = context.extensionUri
    this._vscode = vscode
    this._context = context
  }

  static getChatInstance(context) {
    if (!ChatSidebarProvider._instance) {
      ChatSidebarProvider._instance = new ChatSidebarProvider(context)
      console.log('Congratulations, your extension "rosana" is now active!')
    }
    return ChatSidebarProvider._instance
  }

  get view() {
    return this._view
  }

  resolveWebviewView(webviewView) {
    this._view = webviewView
    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true
    }

    this._update()

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview)
  }

  _update() {
    if (!this._view) {
      return
    }

    this._view.webview.html = this._getHtmlForWebview(this._view.webview)
    const apiKey = this._context.secrets.get(API_KEY)

    if (!apiKey) {
      vscode.window.showWarningMessage('Digite sua API KEY para salvá-la com segurança.')
      return 'Por favor, insira sua API KEY'
    }

    const provider = vscode.workspace.getConfiguration().get('Rosana.apiKey')
    const model = vscode.workspace.getConfiguration().get('Rosana.model')
    const temperature = vscode.workspace.getConfiguration().get('Rosana.temperature')
    const maxTokens = vscode.workspace.getConfiguration().get('Rosana.maxTokens')
    const language = vscode.workspace.getConfiguration().get('Rosana.query.language')
    let response
    let oneShotPrompt

    this._view.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case 'sendPrompt': {
          const uniqueId = data.uniqueId
          let message = data.text
          let lastMessage = data.lastMessage
          const promptType = data.promptType

          // check if it have a selected text

          let selectedText = ''
          const { activeTextEditor } = vscode.window
          if (activeTextEditor) {
            const { document } = activeTextEditor

            const { selection } = activeTextEditor
            selectedText = document.getText(selection)
          } else {
            console.log('No active text editor found.')
          }

          try {
            if (lastMessage !== '') {
              lastMessage = ' -Respond about this context ### ' + lastMessage
            }
            if (selectedText !== '') {
              if (!promptType) {
                message = message + ' -Respond about this code ### ' + selectedText
              } else {
                message = prompts.getCommandPrompt(message, promptType, language)
              }
            }
            if (model === 'gpt-3.5-turbo' || model === 'gpt-3.5-turbo-0301' || model === 'gpt-4' || model === 'gpt-4-32k') {
              if (apiKey.g === undefined || apiKey.g === '') {
                vscode.window.showErrorMessage('Digite sua API KEY para salvá-la com segurança.')
                this._view.webview.postMessage({
                  type: 'showResponse',
                  ok: true,
                  text: 'Por favor, insira sua API KEY',
                  uniqueId
                })
                return
              }
              await openAIClient.createChatCompletion({
                apiKey: apiKey.g,
                model,
                text: message,
                lastMessage,
                maxTokens,
                callback: (message) => { // send message to the webview
                  this._view.webview.postMessage(message)
                },
                uniqueId,
                stopTriggered: data.stop
              })
            } else {
              if (lastMessage !== '') {
                lastMessage = ' -Respond about this context ### ' + lastMessage
              }
              if (selectedText !== '') {
                message = message + ' -Respond about this code ### ' + selectedText
              }
              // no chat options, we have to create the prompt
              oneShotPrompt = prompts.getCommandPrompt(message, 'chatRosana', language)

              if (provider === 'OpenAI') {
                response = await openAIClient.createOpenAiCompletion(apiKey.g, model, oneShotPrompt, temperature, maxTokens)
              }
              if (provider === 'Cohere') {
                response = await cohereClient.createCohereCompletion(apiKey.g, model, oneShotPrompt, temperature, maxTokens)
              }

              if (provider === 'AI21') {
                response = await aiClient.createAICompletion(apiKey.g, model, oneShotPrompt, temperature, maxTokens)
              }

              if (provider === 'Anthropic') {
                await anthropicClient.createChatCompletion({
                  apiKey: apiKey.g,
                  model,
                  text: message,
                  lastMessage,
                  maxTokens,
                  temperature,
                  callback: (message) => { // send message to the webview
                    this._view.webview.postMessage(message)
                  },
                  uniqueId
                })
              } else {
                if (!response) {
                  response = `${provider} API could not process the query`
                }
              }
            }
          } catch (error) {
            response = `${provider} API Response was: ${error}`
            vscode.window.showErrorMessage(response)
          }
          if (response) {
            this._view.webview.postMessage({
              type: 'showResponse',
              ok: true,
              text: response,
              uniqueId
            })
          }
          break
        }
        case 'saveHistory': {
          const history = data.history
          this._context.globalState.update('history', history)
          break
        }
        case 'clearHistory': {
          this._context.globalState.update('history', '')
          this._view.webview.html = this._getHtmlForWebview(this._view.webview)
          break
        }
        case 'openSettings': {
          const settingsCommand = 'workbench.action.openSettings'
          vscode.commands.executeCommand(settingsCommand, 'rosana')
          break
        }
      }
    })
  }

  _getHtmlForWebview(webview) {
    console.log('getHtmlForWebview')
    const nonce = this._getNonce()
    const styleVscode = webview.asWebviewUri(vscode.Uri.joinPath(this._context.extensionUri, 'media', 'vscode.css'))
    const scriptChat = webview.asWebviewUri(vscode.Uri.joinPath(this._context.extensionUri, 'media', 'chat.js'))
    const styleChat = webview.asWebviewUri(vscode.Uri.joinPath(this._context.extensionUri, 'media', 'chat.css'))
    const styleGithubDark = webview.asWebviewUri(vscode.Uri.joinPath(this._context.extensionUri, 'media', 'github_dark.css'))
    const highlightMinJs = webview.asWebviewUri(vscode.Uri.joinPath(this._context.extensionUri, 'media', 'highlight.min.js'))
    const markedMindJs = webview.asWebviewUri(vscode.Uri.joinPath(this._context.extensionUri, 'media', 'marked.min.js'))
    const showdownJs = webview.asWebviewUri(vscode.Uri.joinPath(this._context.extensionUri, 'media', 'showdown.min.js'))
    const logo = webview.asWebviewUri(vscode.Uri.joinPath(this._context.extensionUri, 'media', 'logo.png'))

    const sendButtonSvg = '<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M8.08074 5.36891L10.2202 7.50833L4.46802 7.50833L4.46802 8.50833L10.1473 8.50833L8.08073 10.5749L8.78784 11.282L11.7444 8.32545L11.7444 7.61835L8.78784 4.6618L8.08074 5.36891Z"/><path d="M8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8C14 11.3137 11.3137 14 8 14ZM8 13C10.7614 13 13 10.7614 13 8C13 5.23858 10.7614 3 8 3C5.23858 3 3 5.23858 3 8C3 10.7614 5.23858 13 8 13Z"/></svg>'
    const clearButtonSvg = '<svg width="24" height="24" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 3h3v1h-1v9l-1 1H4l-1-1V4H2V3h3V2a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v1zM9 2H6v1h3V2zM4 13h7V4H4v9zm2-8H5v7h1V5zm1 0h1v7H7V5zm2 0h1v7H9V5z"/></svg>'

    const history = this._context.globalState.get('history') || ''
    const initialTemplate = `
    <div class="initialTemplate">
      <div class="wrapper ai">
        <div class="chat">
          <div class="profile chat_header">
            <img src="${logo}" height="48" alt=""> <span>Rosana</span>
          </div>
            <p>
                Olá, sou a Rosana, sua assitente agora no VS Code. Vou te ajudar a codar por hobbie.
            </p>
            <p>
                Para começar, basta selecionar uma seção de código e escolher uma das seguintes opções:
            </p>
            <ul>
                <li>✨<button>Explique o código selecionado.</button></li>
                <li>✨<button>Identifique quaisquer problemas no meu código selecionado.</button></li>
                <li>✨<button>Criar testes unitários para meu código selecionado.</button></li>
            </ul>
            <button id="btn-settings">Configurações</button>
        </div>
    </div>
  </div>`
    const chat = history.length ? history : initialTemplate
    return `
      <!doctype html>
        <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${webview.cspSource}; script-src 'nonce-${nonce}';">
                <link rel="stylesheet" href="${styleVscode}">
                <link rel="stylesheet" href="${styleChat}">
                <link rel="stylesheet" href="${styleGithubDark}">
                <script nonce="${nonce}" src="${highlightMinJs}"></script>
                <script nonce="${nonce}" src="${showdownJs}"></script>
                <script nonce="${nonce}" src="${showdownJs}"></script>
                <script nonce="${nonce}" src="${markedMindJs}"></script>
            </head>
            <body class="background: black">
                    <form id="app" class="">
                        <input type="hidden" name="lastUniqueId" id="lastUniqueId" value="">
                        <div id="header">
                          <button title="clear chat" id="btn-clear" >${clearButtonSvg}</button>
                        </div>
                        <div id="chat_container" class="hljs">
                            ${chat}
                        </div>
                        <button id="stopResponse">Encerrar resposta</button>
                        <footer>
                          <textarea type="text" rows="1" tabindex="0" name="prompt" id="prompt" placeholder="Pergunte algo..."></textarea>
                          <button type="submit" id="btn-question">${sendButtonSvg}</button>
                        </footer>
                    </form>
                    <script nonce="${nonce}" src="${scriptChat}" >
            </body>
        </html>
      `
  }

  _getNonce() {
    let text = ''
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < 32; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
  }

  static register(context) {
    const provider = ChatSidebarProvider.getChatInstance(context)
    context.subscriptions.push(
      vscode.window.registerWebviewViewProvider(
        'rosana-sidebar',
        provider,
        {
          webviewOptions: {
            retainContextWhenHidden: true
          }
        }
      )
    )
  }
}

ChatSidebarProvider.viewType = 'miExtension.sidebar'

module.exports = ChatSidebarProvider
