const axios = require('axios')
const { USER_AGENTS, APIS } = require('../consts.js')

const selectRandom = () => {
  const randomNumber = Math.floor(Math.random() * USER_AGENTS.length)
  return USER_AGENTS[randomNumber]
}

const getAPIs = async (searchString) => {
  const encodedString = encodeURI(searchString)
  const selectedUserAgent = selectRandom()
  const header = {
    'User-Agent': selectedUserAgent
  }

  const url = `${APIS.PUBLIC_APIS}?description=${encodedString}`

  try {
    const { data } = await axios(url, header)
    const { entries } = data

    return entries.map((entry) => {
      const {
        API: label,
        Description: detail,
        Link: link
      } = entry

      return { label, detail, link }
    })
  } catch (e) {
    return []
  }
}

module.exports = { getAPIs }
