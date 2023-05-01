const cohere = require('cohere-ai')
const { URL_ERRORS } = require('../consts.js')
const vscode = require('vscode')

const createCohereCompletion = async (apiKey, model, oneShotPrompt, temperature, maxTokens) => {
  cohere.init(apiKey)

  const completion = await cohere.generate({
    model,
    prompt: oneShotPrompt,
    max_tokens: maxTokens,
    temperature,
    k: 0,
    p: 0.75,
    frequency_penalty: 0,
    presence_penalty: 0,
    stop_sequences: ['USER:']
  }).catch((error) => {
    console.log(error)
    return { isError: true, status: error.status, body: error.response.body }
  })

  const { statusCode, body } = completion
  if (statusCode !== 200) {
    const httpError = body.message
    const errorMessage = `Cohere: API Response was: Error ${statusCode}: ${httpError} ${URL_ERRORS.Cohere}`
    return errorMessage
  }

  const { generations = [] } = body

  if (generations.length === 0 || generations[0].text === '') {
    vscode.window.showErrorMessage('Cohere: No completion found.')
    return
  }

  return generations[0].text
}

module.exports = { createCohereCompletion }
