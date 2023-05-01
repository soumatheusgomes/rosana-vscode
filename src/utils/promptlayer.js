// Credit to Dominic Nguyen https://twitter.com/domng_me for making this helper function
const promptLayer = async (tags, prompt, engine, requestResponse, requestStartTime, requestEndTime, promptLayerApiKey) => {
  try {
    const requestInput = {
      function_name: 'openai.Completion.create.js',
      args: [],
      kwargs: { engine, prompt },
      tags,
      request_response: requestResponse,
      request_start_time: Math.floor(requestStartTime / 1000),
      request_end_time: Math.floor(requestEndTime / 1000),
      api_key: promptLayerApiKey
    }
    await fetch('https://api.promptlayer.com/track-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(requestInput)
    })
  } catch (e) {
    console.error('promptLayer error', e)
  }
}

module.exports = { promptLayer }
