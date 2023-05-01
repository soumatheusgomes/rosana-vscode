/* eslint-disable n/no-callback-literal */
const vscode = require('vscode')
const { Configuration, OpenAIApi } = require('openai')
const { URL_ERRORS } = require('../consts.js')
const https = require('https')
let isStreaming = false
// const { promptLayer } = require('../utils/promptlayer.js')

const createOpenAiCompletion = async (apiKey, model, oneShotPrompt, temperature, maxTokens) => {
  const configuration = new Configuration({ apiKey })
  const openai = new OpenAIApi(configuration)
  // const requestStartTime = Date.now()
  const completion = await openai.createCompletion({
    model,
    prompt: oneShotPrompt,
    temperature,
    max_tokens: maxTokens,
    top_p: 1.0,
    frequency_penalty: 0.5,
    presence_penalty: 0.0,
    stop: ['USER:']
  }).catch((error) => {
    console.log(error)
    return { isError: true, status: error.response.status, body: error.response.data.error }
  })
  // const requestEndTime = Date.now()

  const { data, status: statusCode, body, isError } = completion
  if (isError) {
    const httpError = body.message
    const errorMessage = `OpenAI: API Response was: Error ${statusCode}: ${httpError} ${URL_ERRORS.OpenAI}`
    vscode.window.showErrorMessage(errorMessage)
    return errorMessage
  }

  const { usage, choices = [] } = data
  // OpenAI maxToken handler
  if (usage.total_tokens && usage.total_tokens >= maxTokens) {
    vscode.window.showWarningMessage(`Ops! Incomplete Completion.
    The request requires ${usage.total_tokens} tokens and you only have ${maxTokens}. Add more tokens in your Rosana Settings.`)
  }

  if (choices.length === 0 || choices[0].text === '') {
    vscode.window.showErrorMessage('OpenAI: No completion found.')
    return 'OpenAI: No completion found.'
  }

  return choices[0].text
}

const createChatCompletion = async ({
  apiKey,
  model,
  text,
  lastMessage,
  callback = () => { },
  uniqueId = '',
  maxTokens,
  // timeout = 1500,
  // retry = false,
  stopTriggered
}) => {
  isStreaming = !stopTriggered

  if (isStreaming) {
    callback({
      type: 'isStreaming',
      ok: true
    })
    const options = {
      hostname: 'api.openai.com',
      port: 443,
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + apiKey
      }
    }

    let notStream = ''
    let done = false
    // const timeOuted = false

    const request = https.request(options, function (response) {
      response.on('data', async (chunk) => {
        if (!isStreaming) {
          request.abort()
          done = true
          return
        }

        const decoder = new TextDecoder('utf-8')
        const text = decoder.decode(chunk)

        try {
          const data = JSON.parse(text.replace('data: ', ''))
          if (data.error) {
            const errorMessage = `OpenAI API Response was: Error ${response.statusCode}: ${data.error.message} ${URL_ERRORS.OpenAI}`
            vscode.window.showErrorMessage(errorMessage)
            callback({
              type: 'showResponse',
              ok: true,
              text: errorMessage,
              uniqueId
            })
            notStream = errorMessage
            return
          }
          const chatgptMsg = data.choices[0].delta.content
          if (chatgptMsg) {
            callback({
              type: 'showResponse',
              ok: true,
              text: chatgptMsg.replaceAll('\\n', '\n'),
              uniqueId
            })
            notStream += chatgptMsg
          }
        } catch (e) {
          if (text.includes('{"delta":{"content":')) {
            const times = text.split('{"delta":{"content":').length - 1
            for (let i = 0; i < times; i++) {
              const chatgptMsg = text.split('{"delta":{"content":"')[i + 1].split('"},"index":0')[0]
              if (!chatgptMsg) continue
              callback({
                type: 'showResponse',
                ok: true,
                text: chatgptMsg,
                uniqueId
              })
              notStream += chatgptMsg
            }
          }
        }
      })
      response.on('error', (e) => {
        if (isStreaming) {
          const errorMessage = `OpenAI: API Response was: Error ${e.message} ${URL_ERRORS.OpenAI}`
          vscode.window.showErrorMessage(errorMessage)
          callback({
            type: 'showResponse',
            ok: true,
            text: errorMessage,
            uniqueId
          })
          notStream = errorMessage
        }
        callback({
          type: 'isStreaming',
          ok: false
        })
      })
      response.on('end', () => {
        isStreaming = false
        done = true
        callback({
          type: 'isStreaming',
          ok: false
        })
      })
    })

    const body = JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content: 'You are an AI programming assistent. - Follow the user\'s requirements carefully & to the letter. -Then ouput the code in a sigle code block - Minimize any other prose.' + lastMessage
        },
        {
          role: 'user',
          content: text
        }
      ],
      stream: true,
      max_tokens: maxTokens
    })
    /* if (!retry) {
      request.setTimeout(timeout, () => {
        request.abort()
        console.log('timeout ', timeout)
        timeOuted = true
        callback({
          type: 'isStreaming',
          ok: false
        })
      })
    } */
    request.write(body)
    request.end()

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

    while (!done) {
      /* if (timeOuted) {
        return await createChatCompletion({
          apiKey,
          model,
          text,
          lastMessage,
          callback,
          uniqueId,
          maxTokens,
          timeout: timeout + 300,
          retry: true,
          stopTriggered
        })
      } */
      await sleep(200)
    }
    callback({
      type: 'isStreaming',
      ok: false
    })
    return notStream.replaceAll('\\n', '\n')
  } else {
    callback({
      type: 'isStreaming',
      ok: false
    })
  }
  return ''

  /* const { data, status: statusCode, body, isError } = completion
  if (isError) {
    const httpError = body.message
    const errorMessage = `OpenAI: API Response was: Error ${statusCode}: ${httpError} ${URL_ERRORS.OpenAI}`
    vscode.window.showErrorMessage(errorMessage)
    return errorMessage
  }

  const { usage, choices = [] } = data
  // OpenAI maxToken handler
  if (usage.total_tokens && usage.total_tokens >= maxTokens) {
    vscode.window.showWarningMessage(`Ops! Incomplete Completion.
    The request requires ${usage.total_tokens} tokens and you only have ${maxTokens}. Add more tokens in your Rosana Settings.`)
  }

  if (choices.length === 0 || choices[0].message.content === '') {
    vscode.window.showErrorMessage('OpenAI: No completion found.')
    return 'OpenAI: No completion found.'
  }

  // const role = choices[0].message.role
  const content = choices[0].message.content

  return content */
}

module.exports = { createOpenAiCompletion, createChatCompletion }
