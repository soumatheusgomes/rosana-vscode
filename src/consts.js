const APIS = {
  PUBLIC_APIS: 'https://api.publicapis.org/entries'
}

const COMMENT_CHARACTER_BY_LANGUAGE = {
  'c++': '//',
  c: '//',
  cpp: '//',
  csharp: '//',
  css: '/*',
  dart: '//',
  go: '//',
  html: '<!--',
  java: '//',
  javascript: '//',
  javascriptreact: '//',
  json: '//',
  kotlin: '//',
  php: '//',
  powershell: '#',
  python: '#',
  r: '#',
  ruby: '#',
  shellscript: '#',
  swift: '//',
  terraform: '#',
  typescript: '//',
  typescriptreact: '//',
  vue: '//',
  yaml: '#'
}

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36'
]

const URL_ERRORS = {
  OpenAI: 'More information about this error: https://platform.openai.com/docs/guides/error-codes',
  Cohere: 'More information about this error: https://docs.cohere.ai/reference/errors#!'
}

const DEFAULT_MODEL_BY_PROVIDER = {
  OpenAI: 'text-davinci-003',
  Cohere: 'command-xlarge-nightly'
}

module.exports = {
  APIS,
  COMMENT_CHARACTER_BY_LANGUAGE,
  DEFAULT_MODEL_BY_PROVIDER,
  USER_AGENTS,
  URL_ERRORS
}
