
const { COMMENT_CHARACTER_BY_LANGUAGE } = require('../consts.js')

const detectLanguage = (languageId) => {
  if (languageId === '') return false

  const commentCharacter = COMMENT_CHARACTER_BY_LANGUAGE[languageId]
  return commentCharacter || false
}

module.exports = { detectLanguage }
