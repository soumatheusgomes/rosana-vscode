const prompts = {
  Portuguese: {
    'chatRosana': `Eu sou um assistente especialista em programação útil. Se você me fizer uma pergunta que esteja enraizada na verdade, eu lhe darei a resposta.
      VOCÊ: O que é uma API?
      ROSANA: Uma API é um conjunto de regras para interagir com software ou serviço.
      VOCÊ: `,
    'askRosana': '',
    'explainRosana': 'Explique o que esse código faz: ',
    'refactorRosana': 'Encontre possíveis problemas no código e refatore-o sem perder nenhuma funcionalidade, e explique o que estava errado e as alterações feitas: ',
    'documentRosana': 'Documente o seguinte código: ',
    'findProblemsRosana': 'Encontre possíveis problemas no código, refatore-o sem perder nenhuma funcionalidade e explique o que estava errado: ',
    'getRosana': 'Escreva um código em ',
    'unitTestRosana': 'Escreva o código de teste unitário para o seguinte código: '
  },
  English: {
    'chatRosana': `I am a helpful programming expert assistant. If you ask me a question that is rooted in truth, I will give you the answer.
      VOCÊ: What is an API?
      ROSANA: An API is a set of rules for interacting with software or a service.
      VOCÊ: `,
    'askRosana': '',
    'explainRosana': 'Explain what this code does: ',
    'refactorRosana': 'Refactor this code and explain what\'s changed: ',
    'documentRosana': 'Document the following code: ',
    'findProblemsRosana': 'Find problems with the following code, fix them and explain what was wrong: ',
    'getRosana': 'Write a code in ',
    'unitTestRosana': 'Write the unit test code for the following code: '
  }
}

const getCommandPrompt = (cleanPromptText, promptType, language) => {
  let commandPrompt = '';

  if (promptType in prompts[language]) {
    commandPrompt = prompts[language][promptType];
  }

  if (promptType === 'compileAndRunRosana') {
    commandPrompt = `Aja como se fosse um console, se houver algum erro, mostre a mensagem de erro, se não houver erro, compile e execute o código a seguir e explique em ${language} o que aconteceu na execução:
    '''
    ${cleanPromptText}
    '''
    Resultado:`
  } else {
    commandPrompt += cleanPromptText;
  }

  return commandPrompt;
}

module.exports = { getCommandPrompt }

