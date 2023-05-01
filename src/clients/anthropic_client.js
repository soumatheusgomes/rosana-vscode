/* eslint-disable n/no-callback-literal */
const https = require('https')
const { URL_ERRORS } = require('../consts.js')
const vscode = require('vscode')
let isStreaming = false

const createChatCompletion = async ({
  apiKey,
  model,
  text,
  lastMessage,
  callback = () => { },
  uniqueId = '',
  maxTokens,
  temperature,
  timeout = 1500,
  retry = false
}) => {
  isStreaming = !isStreaming

  if (isStreaming) {
    callback({
      type: 'isStreaming',
      ok: true
    })
    const options = {
      hostname: 'api.anthropic.com',
      port: 443,
      path: '/v1/complete',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      }
    }

    let notStream = ''
    let done = false
    let timeOuted = false

    const request = https.request(options, function (response) {
      response.on('data', async (chunk) => {
        if (!isStreaming) {
          request.abort()
          done = true
          callback({
            type: 'isStreaming',
            ok: false
          })
          return
        }

        const decoder = new TextDecoder('utf-8')
        const text = decoder.decode(chunk)
        if (text.includes('data: [DONE]')) {
          return
        }
        try {
          const data = JSON.parse(text.replace('data: ', ''))
          if (data.error) {
            const errorMessage = `OpenAI API Response was: Error ${response.statusCode}: ${data.error.message} ${URL_ERRORS.OpenAI}`
            vscode.window.showErrorMessage(errorMessage)
            callback({
              type: 'showResponse',
              isCompleteText: true,
              ok: true,
              text: errorMessage,
              uniqueId
            })
            notStream = errorMessage
            return
          }
          const claudeMsg = data.completion
          if (claudeMsg) {
            callback({
              type: 'showResponse',
              isCompleteText: true,
              ok: true,
              /* remove all <textarea> and </textarea> tags */
              text: claudeMsg.replaceAll('\\n', '\n').replaceAll('<textarea>', '').replaceAll('</textarea>', ''),
              uniqueId
            })
            notStream = claudeMsg
          }
        } catch (e) {
          console.error(e, text)
        }
      })
      response.on('error', (e) => {
        if (isStreaming) {
          const errorMessage = `OpenAI: API Response was: Error ${e.message} ${URL_ERRORS.OpenAI}`
          vscode.window.showErrorMessage(errorMessage)
          callback({
            type: 'showResponse',
            isCompleteText: true,
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
      prompt: '\n\n' +
        'System: You are an AI programming assistent. - Follow the user\'s requirements carefully & to the letter. -Then ouput the code in a sigle code block using markdown - Minimize any other prose.' + lastMessage +
        '\n\n' +
        'Human: ' + text + '' +
        '\n\n' +
        'Assistant: ',
      stream: true,
      max_tokens_to_sample: maxTokens,
      temperature,
      stop_sequences: ['\n\nHuman:', '\n\nSystem:']
    })
    if (!retry) {
      request.setTimeout(timeout, () => {
        request.abort()
        console.log('timeout ', timeout)
        timeOuted = true
        callback({
          type: 'isStreaming',
          ok: false
        })
      })
    }
    request.write(body)
    request.end()

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

    while (!done) {
      if (timeOuted) {
        return await createChatCompletion({
          apiKey,
          model,
          text,
          lastMessage,
          callback,
          uniqueId,
          maxTokens,
          temperature,
          timeout: timeout + 300,
          retry: true
        })
      }
      await sleep(200)
    }
    callback({
      type: 'isStreaming',
      ok: false
    })
    return notStream.replaceAll('\\n', '\n')
  }
  return ''
}

module.exports = { createChatCompletion }
