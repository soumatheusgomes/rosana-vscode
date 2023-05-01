// const { ACTION_TYPES } = require('../enums.js')

let oneShotPrompt = ''

const getCommandPrompt = (cleanPromptText, promptType, language) => {
  if (language === 'Spanish') {
    switch (promptType) {
      case 'chatRosana':
        oneShotPrompt = `Soy un asistente experto en programación. Si me haces una pregunta que tiene sus raíces en la verdad, te daré la respuesta.
        USER: ¿Qué es una API?
        BOT: Una API es un conjunto de reglas para interactuar con software o un servicio.
        USER: `
        break
      case 'askRosana':
        oneShotPrompt = ''
        break
      case 'explainRosana':
        oneShotPrompt = 'Explica que hace este código: '
        break
      case 'refactorRosana':
        oneShotPrompt = 'Refactoriza este código y explica que cambios se hicieron: '
        break
      case 'documentRosana':
        oneShotPrompt = 'Escribe nuevamente este código y agrega comentarios: '
        break
      case 'findProblemsRosana':
        oneShotPrompt = 'Encuentra los problemas del siguiente código, arréglalos y explica que estaba incorrecto: '
        break
      case 'getRosana':
        oneShotPrompt = 'Escribe un código en '
        break
      case 'unitTestRosana':
        oneShotPrompt = 'Escribe el código de pruebas unitarias del siguiente código: '
        break
      default:
      // código para ejecutar si expression no coincide con n ni con m
    }
  } else if (language === 'Portuguese') {
    switch (promptType) {
      case 'chatRosana':
        oneShotPrompt = `Eu sou um assistente especialista em programação útil. Se você me fizer uma pergunta que esteja enraizada na verdade, eu lhe darei a resposta.
        USER:: O que é uma API?
        BOT: Uma API é um conjunto de regras para interagir com software ou serviço.
        USER: `
        break
      case 'askRosana':
        oneShotPrompt = ''
        break
      case 'explainRosana':
        oneShotPrompt = 'Explique o que esse código faz: '
        break
      case 'refactorRosana':
        oneShotPrompt = 'Encontre possíveis problemas no código e refatore-o sem perder nenhuma funcionalidade, e explique o que estava errado e as alterações feitas: '
        break
      case 'documentRosana':
        oneShotPrompt = 'Documente o seguinte código: '
        break
      case 'findProblemsRosana':
        oneShotPrompt = 'Encontre possíveis problemas no código, refatore-o sem perder nenhuma funcionalidade e explique o que estava errado: '
        break
      case 'getRosana':
        oneShotPrompt = 'Escreva um código em '
        break
      case 'unitTestRosana':
        oneShotPrompt = 'Escreva o código de teste unitário para o seguinte código: '
        break
      default:
      // código para ejecutar si expression no coincide con n ni con m
    }
  } else if (language === 'English') {
    switch (promptType) {
      case 'chatRosana':
        oneShotPrompt = `I am a helpful programming expert assistant. If you ask me a question that is rooted in truth, I will give you the answer.
        USER: What is an API?
        BOT: An API is a set of rules for interacting with software or a service.
        USER: `
        break
      case 'askRosana':
        oneShotPrompt = ''
        break
      case 'explainRosana':
        oneShotPrompt = 'Explain what this code does: '
        break
      case 'refactorRosana':
        oneShotPrompt = 'Refactor this code and explain what\'s changed: '
        break
      case 'documentRosana':
        oneShotPrompt = 'Document the following code: '
        break
      case 'findProblemsRosana':
        oneShotPrompt = 'Find problems with the following code, fix them and explain what was wrong: '
        break
      case 'getRosana':
        oneShotPrompt = 'Write a code in '
        break
      case 'unitTestRosana':
        oneShotPrompt = 'Write the unit test code for the following code: '
        break
      default:
      // código para ejecutar si expression no coincide con n ni con m
    }
  } else if (language === 'French') {
    switch (promptType) {
      case 'chatRosana':
        oneShotPrompt = `Je suis un assistant expert en programmation utile. Si vous me posez une question qui est enracinée dans la vérité, je vous donnerai la réponse.
        USER: Qu'est-ce qu'une API ?
        BOT: Une API est un ensemble de règles permettant d'interagir avec un logiciel ou un service.
        USER: `
        break
      case 'askRosana':
        oneShotPrompt = ''
        break
      case 'explainRosana':
        oneShotPrompt = 'Expliquez ce que fait ce code: '
        break
      case 'refactorRosana':
        oneShotPrompt = 'Refactorisez ce code et expliquez ce qui a changé: '
        break
      case 'documentRosana':
        oneShotPrompt = 'Documentez le code suivant: '
        break
      case 'findProblemsRosana':
        oneShotPrompt = 'Trouvez des problèmes avec le code suivant, corrigez-les et expliquez ce qui n\'allait pas: '
        break
      case 'getRosana':
        oneShotPrompt = 'Écrivez un code dans '
        break
      case 'unitTestRosana':
        oneShotPrompt = 'Écrivez le code de test unitaire pour le code suivant: '
        break
      default:
      // código para ejecutar si expression no coincide con n ni con m
    }
  } else if (language === 'Japanese') {
    switch (promptType) {
      case 'chatRosana':
        oneShotPrompt = `私は役に立つプログラミング専門家のアシスタントです。真実に根ざした質問をしてくれれば、答えてあげます。
        USER: API とは何ですか?
        BOT: API は、ソフトウェアまたはサービスと対話するための一連のルールです。
        USER: `
        break
      case 'askRosana':
        oneShotPrompt = ''
        break
      case 'explainRosana':
        oneShotPrompt = 'このコードが何をするか説明してください '
        break
      case 'refactorRosana':
        oneShotPrompt = 'このコードをリファクタリングし、どのような変更が行われたかを説明します。 '
        break
      case 'documentRosana':
        oneShotPrompt = '次のコードを文書化します。: '
        break
      case 'findProblemsRosana':
        oneShotPrompt = '次のコードの問題を見つけて修正し、何が問題だったかを説明してください。 '
        break
      case 'getRosana':
        oneShotPrompt = 'にコードを書きます '
        break
      case 'unitTestRosana':
        oneShotPrompt = '次のコードの単体テスト コードを記述します。 '
        break
      default:
        // código para ejecutar si expression no coincide con n ni con m
        break
    }
    oneShotPrompt = oneShotPrompt + cleanPromptText
  } else if (language === 'Russian') {
    switch (promptType) {
      case 'chatRosana':
        oneShotPrompt = `Я полезный помощник эксперта по программированию. Если вы зададите мне вопрос, основанный на истине, я дам вам ответ.
        USER: Что такое API?
        BOT: API — это набор правил взаимодействия с программным обеспечением или сервисом.
        USER: `
        break
      case 'askRosana':
        oneShotPrompt = ''
        break
      case 'explainRosana':
        oneShotPrompt = 'Объясните, что делает этот код: '
        break
      case 'refactorRosana':
        oneShotPrompt = 'Проведите рефакторинг этого кода и объясните, какие изменения были внесены: '
        break
      case 'documentRosana':
        oneShotPrompt = 'Задокументируйте следующий код: '
        break
      case 'findProblemsRosana':
        oneShotPrompt = 'Найдите проблемы в следующем коде, исправьте их и объясните, что было не так: '
        break
      case 'getRosana':
        oneShotPrompt = 'Напишите код в '
        break
      case 'unitTestRosana':
        oneShotPrompt = 'Напишите код модульного теста для следующего кода: '
        break
      default:
      // código para ejecutar si expression no coincide con n ni con m
    }
  } else if (language === 'German') {
    switch (promptType) {
      case 'chatRosana':
        oneShotPrompt = `Ich bin ein hilfreicher Programmierexperten-Assistent. Wenn Sie mir eine Frage stellen, die in der Wahrheit verwurzelt ist, werde ich Ihnen die Antwort geben.
        USER: Was ist eine API?
        BOT: Eine API ist ein Satz von Regeln für die Interaktion mit Software oder einem Dienst.
        USER: `
        break
      case 'askRosana':
        oneShotPrompt = ''
        break
      case 'explainRosana':
        oneShotPrompt = 'Erklären Sie, was dieser Code bewirkt: '
        break
      case 'refactorRosana':
        oneShotPrompt = 'Überarbeiten Sie diesen Code und erklären Sie, welche Änderungen vorgenommen wurden: '
        break
      case 'documentRosana':
        oneShotPrompt = 'Dokumentieren Sie den folgenden Code: '
        break
      case 'findProblemsRosana':
        oneShotPrompt = 'Finden Sie die Probleme im folgenden Code, beheben Sie sie und erklären Sie, was falsch war: '
        break
      case 'getRosana':
        oneShotPrompt = 'Schreiben Sie einen Code hinein '
        break
      case 'unitTestRosana':
        oneShotPrompt = 'Schreiben Sie den Einheitentestcode für den folgenden Code: '
        break
      default:
      // código para ejecutar si expression no coincide con n ni con m
    }
  } else if (language === 'Arabic') {
    switch (promptType) {
      case 'chatRosana':
        oneShotPrompt = `أنا مساعد خبير برمجة مفيد. إذا سألتني سؤالًا متجذرًا في الحقيقة ، فسأعطيك الجواب.
        USER: ما هي API؟
        BOT: API عبارة عن مجموعة من القواعد للتفاعل مع برنامج أو خدمة.
        USER: `
        break
      case 'askRosana':
        oneShotPrompt = ''
        break
      case 'explainRosana':
        oneShotPrompt = 'اشرح ما يفعله هذا الرمز: '
        break
      case 'refactorRosana':
        oneShotPrompt = 'أعد تشكيل هذا الكود واشرح التغييرات التي تم إجراؤها: '
        break
      case 'documentRosana':
        oneShotPrompt = 'وثق الكود التالي: '
        break
      case 'findProblemsRosana':
        oneShotPrompt = 'ابحث عن المشاكل في الكود التالي وقم بإصلاحها واشرح الخطأ: '
        break
      case 'getRosana':
        oneShotPrompt = 'اكتب رمزًا '
        break
      case 'unitTestRosana':
        oneShotPrompt = 'اكتب كود اختبار الوحدة للرمز التالي: '
        break
      default:
      // código para ejecutar si expression no coincide con n ni con m
    }
  } else if (language === 'Hebrew') {
    switch (promptType) {
      case 'chatRosana':
        oneShotPrompt = `אני עוזר מומחה לתכנות מועיל. אם תשאל אותי שאלה ששורשיה באמת, אני אתן לך את התשובה.
        USER: מהו API?
        BOT: API הוא קבוצה של כללים לאינטראקציה עם תוכנה או שירות.
        USER: `
        break
      case 'askRosana':
        oneShotPrompt = ''
        break
      case 'explainRosana':
        oneShotPrompt = 'הסבר מה הקוד הזה עושה: '
        break
      case 'refactorRosana':
        oneShotPrompt = 'שחזר את הקוד הזה והסביר אילו שינויים בוצעו: '
        break
      case 'documentRosana':
        oneShotPrompt = 'כתוב את הקוד הזה שוב והוסף הערות: '
        break
      case 'findProblemsRosana':
        oneShotPrompt = 'מצא את הבעיות בקוד הבא, תקן אותן והסבר מה השתבש: '
        break
      case 'getRosana':
        oneShotPrompt = 'כתוב קוד ב '
        break
      case 'unitTestRosana':
        oneShotPrompt = 'כתוב את קוד בדיקת היחידה עבור הקוד הבא: '
        break
      default:
      // código para ejecutar si expression no coincide con n ni con m
    }
  } else if (language === 'Thai') {
    switch (promptType) {
      case 'chatRosana':
        oneShotPrompt = `ฉันเป็นผู้ช่วยผู้เชี่ยวชาญด้านการเขียนโปรแกรมที่เป็นประโยชน์ หากคุณถามคำถามที่มีรากฐานมาจากความจริง ฉันจะให้คำตอบแก่คุณ
        USER: API คืออะไร
        BOT: API คือชุดของกฎสำหรับการโต้ตอบกับซอฟต์แวร์หรือบริการ
        USER: `
        break
      case 'askRosana':
        oneShotPrompt = ''
        break
      case 'explainRosana':
        oneShotPrompt = 'อธิบายว่ารหัสนี้ทำอะไร: '
        break
      case 'refactorRosana':
        oneShotPrompt = 'ปรับโครงสร้างรหัสนี้ใหม่และอธิบายสิ่งที่เปลี่ยนแปลง: '
        break
      case 'documentRosana':
        oneShotPrompt = 'เอกสารรหัสต่อไปนี้: '
        break
      case 'findProblemsRosana':
        oneShotPrompt = 'ค้นหาปัญหาเกี่ยวกับโค้ดต่อไปนี้ แก้ไขและอธิบายสิ่งที่ผิดพลาด: '
        break
      case 'getRosana':
        oneShotPrompt = 'เขียนรหัสใน '
        break
      case 'unitTestRosana':
        oneShotPrompt = 'เขียนรหัสการทดสอบหน่วยสำหรับรหัสต่อไปนี้: '
        break
      default:
      // código para ejecutar si expression no coincide con n ni con m
    }
  } else if (language === 'Chinese') {
    switch (promptType) {
      case 'chatRosana':
        oneShotPrompt = `我是一个乐于助人的编程专家助理。如果你问我一个植根于真理的问题，我会给你答案。
        USER：什么是 API？
        BOT：API 是一组用于与软件或服务交互的规则。
        USER: `
        break
      case 'askRosana':
        oneShotPrompt = ''
        break
      case 'explainRosana':
        oneShotPrompt = '解释这段代码的作用：'
        break
      case 'refactorRosana':
        oneShotPrompt = '重构此代码并解释更改内容：'
        break
      case 'documentRosana':
        oneShotPrompt = '记录以下代码：'
        break
      case 'findProblemsRosana':
        oneShotPrompt = '查找以下代码的问题，修复它们并解释错误所在：'
        break
      case 'getRosana':
        oneShotPrompt = '写一段代码进去 '
        break
      case 'unitTestRosana':
        oneShotPrompt = '为以下代码编写单元测试代码：'
        break
      default:
      // código para ejecutar si expression no coincide con n ni con m
    }
  } else if (language === 'Italian') {
    switch (promptType) {
      case 'chatRosana':
        oneShotPrompt = `Sono un utile assistente esperto di programmazione. Se mi fai una domanda radicata nella verità, ti darò la risposta.
        USER: Cos'è un'API?
        BOT: un'API è un insieme di regole per interagire con un software o un servizio.
        USER: `
        break
      case 'askRosana':
        oneShotPrompt = ''
        break
      case 'explainRosana':
        oneShotPrompt = 'Spiega cosa fa questo codice: '
        break
      case 'refactorRosana':
        oneShotPrompt = 'Rifattorizza questo codice e spiega cosa è cambiato: '
        break
      case 'documentRosana':
        oneShotPrompt = 'Documenta il seguente codice: '
        break
      case 'findProblemsRosana':
        oneShotPrompt = 'Trova i problemi con il seguente codice, correggili e spiega cosa non andava: '
        break
      case 'getRosana':
        oneShotPrompt = 'Scrivi un codice '
        break
      case 'unitTestRosana':
        oneShotPrompt = 'Scrivere il codice unit test per il seguente codice: '
        break
      default:
      // código para ejecutar si expression no coincide con n ni con m
    }
  } else if (language === 'Ukrainian') {
    switch (promptType) {
      case 'chatRosana':
        oneShotPrompt = `Я корисний помічник експерта з програмування. Якщо ви задасте мені питання, яке базується на правді, я дам вам відповідь.
        USER: Що таке API?
        BOT: API — це набір правил для взаємодії з програмним забезпеченням або службою.
        USER: `
        break
      case 'askRosana':
        oneShotPrompt = ''
        break
      case 'explainRosana':
        oneShotPrompt = 'Поясніть, що робить цей код: '
        break
      case 'refactorRosana':
        oneShotPrompt = 'Рефакторіть цей код і поясніть, що змінилося: '
        break
      case 'documentRosana':
        oneShotPrompt = 'Задокументуйте наступний код: '
        break
      case 'findProblemsRosana':
        oneShotPrompt = 'Знайдіть проблеми з наступним кодом, виправте їх і поясніть, що не так: '
        break
      case 'getRosana':
        oneShotPrompt = 'Введіть код '
        break
      case 'unitTestRosana':
        oneShotPrompt = 'Напишіть код модульного тестування для такого коду: '
        break
      default:
      // código para ejecutar si expression no coincide con n ni con m
    }
  } else if (language === 'Polish') {
    switch (promptType) {
      case 'chatRosana':
        oneShotPrompt = `Jestem pomocnym asystentem eksperta programistycznego. Jeśli zadasz mi pytanie, które jest zakorzenione w prawdzie, dam ci odpowiedź.
        USER: Co to jest interfejs API?
        BOT: API to zestaw reguł interakcji z oprogramowaniem lub usługą.
        USER: `
        break
      case 'askRosana':
        oneShotPrompt = ''
        break
      case 'explainRosana':
        oneShotPrompt = 'Wyjaśnij, co robi ten kod: '
        break
      case 'refactorRosana':
        oneShotPrompt = 'Refaktoryzuj ten kod i wyjaśnij, co się zmieniło: '
        break
      case 'documentRosana':
        oneShotPrompt = 'Udokumentuj następujący kod: '
        break
      case 'findProblemsRosana':
        oneShotPrompt = 'Znajdź problemy z następującym kodem, napraw je i wyjaśnij, co było nie tak: '
        break
      case 'getRosana':
        oneShotPrompt = 'Wpisz kod w '
        break
      case 'unitTestRosana':
        oneShotPrompt = 'Napisz kod testu jednostkowego dla następującego kodu: '
        break
      default:
      // código para ejecutar si expression no coincide con n ni con m
    }
  } else if (language === 'Korean') {
    switch (promptType) {
      case 'chatRosana':
        oneShotPrompt = `저는 도움이 되는 프로그래밍 전문가 조수입니다. 진실에 뿌리를 둔 질문을 하시면 답을 드리겠습니다.
        USER: API란 무엇입니까?
        BOT: API는 소프트웨어 또는 서비스와 상호 작용하기 위한 일련의 규칙입니다.
        USER: `
        break
      case 'askRosana':
        oneShotPrompt = ''
        break
      case 'explainRosana':
        oneShotPrompt = '이 코드의 기능을 설명하십시오. '
        break
      case 'refactorRosana':
        oneShotPrompt = '이 코드를 리팩터링하고 변경된 사항을 설명합니다. '
        break
      case 'documentRosana':
        oneShotPrompt = '다음 코드를 문서화합니다. '
        break
      case 'findProblemsRosana':
        oneShotPrompt = '다음 코드에서 문제를 찾아 수정하고 무엇이 잘못되었는지 설명하십시오. '
        break
      case 'getRosana':
        oneShotPrompt = '에 코드 작성 '
        break
      case 'unitTestRosana':
        oneShotPrompt = '다음 코드에 대한 단위 테스트 코드를 작성합니다. '
        break
      default:
      // código para ejecutar si expression no coincide con n ni con m
    }
  } else if (language === 'Turkish') {
    switch (promptType) {
      case 'chatRosana':
        oneShotPrompt = `Yardımcı bir programlama uzmanı asistanıyım. Bana hakikate dayanan bir soru sorarsan, sana cevabını veririm.
        USER: API nedir?
        BOT: Bir API, yazılım veya bir hizmetle etkileşim kurmak için bir dizi kuraldır.
        USER: `
        break
      case 'askRosana':
        oneShotPrompt = ''
        break
      case 'explainRosana':
        oneShotPrompt = 'Bu kodun ne yaptığını açıklayın: '
        break
      case 'refactorRosana':
        oneShotPrompt = 'Bu kodu yeniden düzenleyin ve nelerin değiştiğini açıklayın: '
        break
      case 'documentRosana':
        oneShotPrompt = 'Aşağıdaki kodu belgeleyin: '
        break
      case 'findProblemsRosana':
        oneShotPrompt = 'Aşağıdaki kodla ilgili sorunları bulun, düzeltin ve neyin yanlış olduğunu açıklayın: '
        break
      case 'getRosana':
        oneShotPrompt = 'içine bir kod yaz '
        break
      case 'unitTestRosana':
        oneShotPrompt = 'Aşağıdaki kod için birim test kodunu yazın: '
        break
      default:
      // código para ejecutar si expression no coincide con n ni con m
    }
  }

  if (promptType === 'compileAndRunRosana') {
    oneShotPrompt = `Act as if you were a console, if there is any error it shows the error message if there is not error then Compile and Execute the following code,  Then he explains in ${language} what happened in the execution:
    '''
    ${cleanPromptText}
    '''
    Result:`
  } else {
    oneShotPrompt = oneShotPrompt + cleanPromptText
  }

  return oneShotPrompt
}

module.exports = { getCommandPrompt }
