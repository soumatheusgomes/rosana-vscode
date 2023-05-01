const axios = require('axios')

const createAICompletion = async (apiKey, model, oneShotPrompt, temperature, maxTokens) => {
  let completion = null

  // completion = await cohere.generate({
  //     model: model,
  //     prompt: one_shot_prompt,
  //     max_tokens: maxTokens,
  //     temperature: temperature,
  //     k: 0,
  //     p: 0.75,
  //     frequency_penalty: 0,
  //     presence_penalty: 0,
  //     stop_sequences: [],
  // });

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  }

  const data = {
    prompt: oneShotPrompt,
    numResults: 1,
    maxTokens,
    temperature,
    topKReturn: 0,
    topP: 1,
    countPenalty: {
      scale: 0,
      applyToNumbers: false,
      applyToPunctuations: false,
      applyToStopwords: false,
      applyToWhitespaces: false,
      applyToEmojis: false
    },
    frequencyPenalty: {
      scale: 0,
      applyToNumbers: false,
      applyToPunctuations: false,
      applyToStopwords: false,
      applyToWhitespaces: false,
      applyToEmojis: false
    },
    presencePenalty: {
      scale: 0,
      applyToNumbers: false,
      applyToPunctuations: false,
      applyToStopwords: false,
      applyToWhitespaces: false,
      applyToEmojis: false
    },
    stopSequences: ['USER:']
  }

  const url = `https://api.ai21.com/studio/v1/experimental/${model}/complete`

  await axios.post(url, data, { headers })
    .then(response => {
      const dataResponse = {
        response
      }
      completion = dataResponse
    })
    .catch(error => {
      completion = error
    })
  console.log(completion.response.data.completions[0])

  // AI21 completion
  return completion.response.data.completions[0].data.text
}

module.exports = { createAICompletion }
