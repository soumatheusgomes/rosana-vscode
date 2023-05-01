const vscode = require('vscode')
const webview = require('./utils/webview.js')
const language = require('./utils/language.js')
const prompts = require('./utils/prompts.js')
const stackoverflow = require('./utils/stackoverflow.js')
const stackOverflowWebview = require('./utils/stackoverflow_webview.js')
const openAIClient = require('./clients/openai_client.js')
const cohereClient = require('./clients/cohere_client.js')
const aiClient = require('./clients/ai_client.js')
const apis = require('./utils/apis.js')
const { setApiKey } = require('./utils/apikey.js')
const { DEFAULT_MODEL_BY_PROVIDER } = require('./consts.js')
const { ACTION_TYPES } = require('./enums.js')
const ChatSidebarProvider = require('./ChatSidebarProvider')

/* GLOBAL VARs */

// OpenAI - Cohere API Key
const API_KEY = 'API_KEY'

// StackOverflow Vars
let soURL = ''
let soTitle = ''
let soPost = ''
let soPostHTML = ''
let soAnswer = ''
let soAnswerHTML = ''
let soScore = ''

function getConfig({ config, defaultValue = '' }) {
  return vscode.workspace.getConfiguration().get(config) || defaultValue
}

async function getOpenAI(cleanPromptText, promptType, context) {
  // API Settings
  let apiKey = await context.secrets.get(API_KEY)

  if (!apiKey) {
    vscode.window.showWarningMessage('Digite sua API KEY para salvá-la com segurança.')
    await setApiKey(context)
    apiKey = await context.secrets.get(API_KEY) // retry
    if (!apiKey) {
      return 'Por favor, insira sua API KEY.'
    }
  }

  const provider = getConfig({ config: 'Rosana.apiKey' })
  const defaultModel = DEFAULT_MODEL_BY_PROVIDER[provider] || ''

  const model = getConfig({ config: 'Rosana.model', defaultValue: defaultModel })
  const temperature = getConfig({ config: 'Rosana.temperature', defaultValue: '0.3' })
  const maxTokens = getConfig({ config: 'Rosana.maxTokens', defaultValue: '500' })
  const language = getConfig({ config: 'Rosana.query.language' })

  // One Shot
  const oneShotPrompt = prompts.getCommandPrompt(cleanPromptText, promptType, language)

  // Progress Location init
  const progressOptions = {
    location: vscode.ProgressLocation.Notification,
    title: 'Rosana',
    cancellable: true
  }

  let response

  await vscode.window.withProgress(progressOptions, async (progress, token) => {
    // Update the progress bar
    progress.report({ message: 'Formatando texto' })

    // if the progress is canceled
    if (token.isCancellationRequested) return

    // Update the progress bar
    progress.report({ message: 'Eu estou pensando...' })

    try {
      if (model === 'gpt-3.5-turbo' || model === 'gpt-3.5-turbo-0301' || model === 'gpt-4' || model === 'gpt-4-32k') {
        response = await openAIClient.createChatCompletion({ apiKey, model, text: oneShotPrompt })
      } else {
        if (provider === 'OpenAI') {
          response = await openAIClient.createOpenAiCompletion(apiKey, model, oneShotPrompt, temperature, maxTokens)
        } else if (provider === 'Cohere') {
          response = await cohereClient.createCohereCompletion(apiKey, model, oneShotPrompt, temperature, maxTokens)
        } else if (provider === 'AI21') {
          response = await aiClient.createAICompletion(apiKey, model, oneShotPrompt, temperature, maxTokens)
        }
      }
      if (!response) {
        response = `${provider} A API não pôde processar a consulta, tente selecionar o código e usar o "Pergunte a Rosana" para escrever sua própria consulta`
      }
    } catch (error) {
      response = `${provider} API Response was: ${error}`
      vscode.window.showErrorMessage(response)
    }

    progress.report({ increment: 100, message: '' })
  }).then(undefined, err => {
    response = 'Error: ' + err
  })

  return response
}

// asynchronous function to send the query to the provider
async function getRosanaOutput(text, type, context, languageId, dataFile) {
  const chat = false
  let copy = false
  let title = ''
  let typing = false

  // limpiamos el texto que ingresó el usuario
  const cleanPromptText = text.split('\r\n').join('\n')
  let responseText = ''
  try {
    responseText = await getOpenAI(cleanPromptText, type, context)
  } catch (error) {
    console.log(error)
  }

  if (type === ACTION_TYPES.ASK_STACK_OVERFLOW) {
    const soArray = [soURL, soTitle, soPost, soPostHTML, soAnswer, soAnswerHTML, soScore]
    ShowStackOverflowPanel(type, soArray, responseText, context)
    return
  }

  if (type === ACTION_TYPES.COMPILE_AND_RUN) {
    title = 'Rosana Console:'
    copy = true
    typing = false
    webview.createWebViewPanel(type, responseText, context, chat, copy, title, typing, dataFile, languageId)
    return
  }

  if (type === ACTION_TYPES.EXPLAIN_CODE) {
    title = 'Explain Rosana:'
    copy = true
    typing = false
    webview.createWebViewPanel(type, responseText, context, chat, copy, title, typing, dataFile, languageId)
    return
  }

  if (type === ACTION_TYPES.DOCUMENT_CODE) {
    title = 'Document Rosana:'
    copy = true
    typing = false
    webview.createWebViewPanel(type, responseText, context, chat, copy, title, typing, dataFile, languageId)
    return
  }

  if (type === ACTION_TYPES.FIND_PROBLEMS) {
    title = 'Find Problems Rosana:'
    copy = true
    typing = false
    webview.createWebViewPanel(type, responseText, context, chat, copy, title, typing, dataFile, languageId)
    return
  }

  if (type === ACTION_TYPES.SEARCH_APIS) {
    title = 'Search APIs Rosana:'
    copy = true
    typing = false
    webview.createWebViewPanel(type, responseText, context, chat, copy, title, typing, dataFile, languageId)
    return
  }

  const outputDocument = await vscode.workspace.openTextDocument({
    content: 'Loading...',
    language: 'markdown'
  })

  const outputDocumentEditor = await vscode.window.showTextDocument(
    outputDocument,
    {
      viewColumn: vscode.ViewColumn.Beside,
      preserveFocus: true,
      preview: true
    }
  )

  if (languageId != null) {
    vscode.languages.setTextDocumentLanguage(outputDocument, languageId)
  }

  // la cargamos en el editor
  outputDocumentEditor.edit(editBuilder => {
    editBuilder.replace(
      new vscode.Range(
        new vscode.Position(0, 0),
        new vscode.Position(99999999999999, 0)
      ),
      `${responseText}`
    )
  })
}

// Init Webview
async function ShowStackOverflowPanel(type, soArray, response, context) {
  // Set the HTML and JavaScript content of the WebView
  stackOverflowWebview.createWebViewPanel(type, soArray, response, context)
}

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
  // sidebar
  const chatSidebarProvider = ChatSidebarProvider.getChatInstance(context)
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('rosana-sidebar', chatSidebarProvider, {
      webviewOptions: { retainContextWhenHidden: true }
    }
    )
  )

  const setApiKeyRosana = vscode.commands.registerCommand('rosana.setApiKeyRosana', async () => {
    await setApiKey(context)
  })

  const removeApiKeyRosana = vscode.commands.registerCommand('rosana.removeApiKeyRosana', async () => {
    await context.secrets.delete(API_KEY)
    vscode.window.showWarningMessage('Your API KEY was removed')
  })

  const getCode = vscode.commands.registerCommand('rosana.getCode', async () => {
    const editor = vscode.window.activeTextEditor
    const { document } = editor
    let { languageId } = document

    // terraform exeption
    if (languageId === 'tf') {
      languageId = 'terraform'
    }

    const commentCharacter = language.detectLanguage(languageId)
    if (commentCharacter === false) {
      vscode.window.showErrorMessage('This language is not supported')
      return
    }

    if (!editor) {
      vscode.window.showInformationMessage('Open an editor.')
      return
    }

    const cursorPosition = editor.selection.active
    const selection = new vscode.Selection(cursorPosition.line, 0, cursorPosition.line, cursorPosition.character)
    // console.log(document.getText(selection))

    const comment = document.getText(selection)

    const oneShotPrompt = languageId
    const errorMessageCursor = 'Create a comment and leave the cursor at the end of the comment line'
    if (comment === '') {
      vscode.window.showErrorMessage(
        errorMessageCursor
      )
      return
    }
    // el caracter existe
    const existsComment = comment.includes(commentCharacter)
    if (!existsComment) {
      vscode.window.showErrorMessage(errorMessageCursor)
      return
    }

    const finalComment = comment.replaceAll(commentCharacter, oneShotPrompt + ': ')
    // console.log({ finalComment })

    getRosanaOutput(finalComment, 'getRosana', context, languageId, [])
  })

  const askStackOverflow = vscode.commands.registerCommand('rosana.askStackOverflow', async () => {
    // validate to have an editor tab open
    if (vscode.window.activeTextEditor === undefined) {
      vscode.window.showWarningMessage(
        'To get started, you must first have an editor tab open'
      )
      return
    }

    const text = await vscode.window.showInputBox({
      title: 'Ask StackOverflow',
      prompt: 'Enter a question',
      placeHolder: 'Question...'
    })
    if (text) {
      const questions = await stackoverflow.getStackOverflowQuestions(text)

      if (questions == null) {
        vscode.window.showWarningMessage(
          'No questions related to this topic were found on StackOverflow, please try again in a different way.'
        )
        return
      }

      const options = await vscode.window.showQuickPick(questions, {
        matchOnDetail: true
      })

      // nothing selected
      if (options === undefined) {
        return
      }

      const result = await stackoverflow.getStackOverflowResult(options.link)
      const language = vscode.workspace.getConfiguration().get('Rosana.query.language')
      const finalText = 'This is a StackOverflow question:""" ' + result[2] + ' """. Now you write a respond in ' + language + ' like a programming expert: ';

      // r = [url, title, post, post_html, answer, answer_html, score]
      [soURL, soTitle, soPost, soPostHTML, soAnswer, soAnswerHTML, soScore] = result

      getRosanaOutput(finalText, 'askStackOverflow', context, null, [])
    } else {
      vscode.window.showErrorMessage('Empty text!')
    }
  })

  const searchApisRosana = vscode.commands.registerCommand('rosana.searchApisRosana', async () => {
    // validate to have an editor tab open
    if (vscode.window.activeTextEditor === undefined) {
      vscode.window.showWarningMessage(
        'To get started, you must first have an editor tab open'
      )
      return
    }

    const languageId = vscode.window.activeTextEditor.document.languageId

    const text = await vscode.window.showInputBox({
      title: 'Search APIs Rosana',
      prompt: "Find an API you'd like to work with",
      placeHolder: ''
    })

    if (text) {
      const apiResult = await apis.getAPIs(text)

      if (apiResult.length === 0) {
        vscode.window.showWarningMessage('No API found')
        return
      }

      const options = await vscode.window.showQuickPick(apiResult, {
        matchOnDetail: true
      })

      // nothing selected
      if (options === undefined) {
        return
      }

      const language = vscode.workspace.getConfiguration().get('Rosana.query.language')

      const finalText = `Act like a programming expert and write in ${language} a short description about "${options.label} ${options.link} ${options.detail}" with an code example in ${languageId}. Use this format:
        Documentation: ${options.link}
        Description:
        Example:
        `

      getRosanaOutput(finalText, 'searchApisRosana', context, languageId, [])
    } else {
      vscode.window.showErrorMessage(
        'Empty text!'
      )
    }
  })

  const askRosana = vscode.commands.registerCommand('rosana.askRosana', async () => {
    openChatView()
    vscode.window.showInformationMessage('Rosana Chat: Escreva sua pergunta no chat.')
  })

  const startRosanaCommand = (type) => {
    const selection = vscode.window.activeTextEditor.selection
    const selectedText = vscode.window.activeTextEditor.document.getText(selection)
    const chatSidebarProvider = ChatSidebarProvider.getChatInstance(context)

    if (selectedText === '') {
      vscode.window.showErrorMessage(
        'Nenhum texto selecionado!'
      )
    } else {
      openChatView()
      chatSidebarProvider.view.webview.postMessage({
        type,
        ok: true,
        selectedText
      })
    }
  }

  const commandExplainRosana = vscode.commands.registerCommand('rosana.explainRosana', async () => {
    startRosanaCommand('explainRosana')
  })

  const commandCompileAndRunRosana = vscode.commands.registerCommand('rosana.compileAndRunRosana', async () => {
    const selection = vscode.window.activeTextEditor.selection
    const selectedText = vscode.window.activeTextEditor.document.getText(selection)

    const pathFileName = vscode.window.activeTextEditor.document.fileName
    const fileName = pathFileName.substring(pathFileName.lastIndexOf('/') + 1)
    const startLine = vscode.window.activeTextEditor.selection.start.line + 1
    const endLine = vscode.window.activeTextEditor.selection.end.line + 1
    const languageId = vscode.window.activeTextEditor.document.languageId
    const dataFile = [fileName, startLine, endLine]

    if (selectedText === '') {
      vscode.window.showErrorMessage('Nenhum texto selecionado!')
    } else {
      getRosanaOutput(selectedText, 'compileAndRunRosana', context, languageId, dataFile)
    }
  })

  const commandRefactorRosana = vscode.commands.registerCommand('rosana.refactorRosana', async () => {
    startRosanaCommand('refactorRosana')
  })

  const commandDocumentRosana = vscode.commands.registerCommand('rosana.documentRosana', async () => {
    startRosanaCommand('documentRosana')
  })

  const commandFindProblemsRosana = vscode.commands.registerCommand('rosana.findProblemsRosana', async () => {
    startRosanaCommand('findProblemsRosana')
  })

  const commandUnitTestRosana = vscode.commands.registerCommand('rosana.unitTestRosana', async () => {
    startRosanaCommand('unitTestRosana')
  })

  // subscribed events
  context.subscriptions.push(
    askRosana,
    commandRefactorRosana,
    commandCompileAndRunRosana,
    commandExplainRosana,
    commandDocumentRosana,
    commandFindProblemsRosana,
    getCode,
    setApiKeyRosana,
    removeApiKeyRosana,
    commandUnitTestRosana,
    askStackOverflow,
    searchApisRosana
  )
}

function openChatView() {
  vscode.commands.executeCommand('workbench.view.extension.rosana-sidebar-view')
}

function closeChatView() {
  vscode.commands.executeCommand('workbench.action.closeSidebar')
}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
  activate,
  deactivate
}
