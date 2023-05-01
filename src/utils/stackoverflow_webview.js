const vscode = require('vscode')
const { clearResponse, getUriMediaResource } = require('./webview')

// Función para crear y mostrar el WebView
const createWebViewPanel = (type, stackoverflow, response, context) => {
  // Crear un nuevo WebView
  const panel = vscode.window.createWebviewPanel(
    'rosana-panel-stackoverflow-view',
    'StackOverflow Rosana',
    vscode.ViewColumn.Beside, // Columna donde se mostrará
    {
      enableScripts: true, // Habilitar scripts
      localResourceRoots: [
        vscode.Uri.joinPath(context.extensionUri, 'media')
      ]
    }
  )

  if (typeof response === 'undefined') {
    response = 'Oops! Something happened, check the extension settings'
  }

  const cleanResponse = clearResponse({ response })

  const { webview } = panel

  // JS and CSS Files
  const styleMain = getUriMediaResource({ context, webview, media: 'main.css' })
  const highlightMinJs = getUriMediaResource({ context, webview, media: 'highlight.min.js' })
  const showdownJs = getUriMediaResource({ context, webview, media: 'showdown.min.js' })

  // Use a nonce to only allow specific scripts to be run
  const nonce = getNonce()
  // const so_array = [so_url, so_title, so_post, so_post_html, so_answer, so_answer_html, so_score];

  let answer = ''
  if (stackoverflow[4] === '') {
    answer = '<h3>No answer yet</h3>'
  } else {
    answer = `
      <h3> 🧠 Best Human Answer</h3>
      <br>
      ⬆️ ${stackoverflow[6]}
      <p>
        ${stackoverflow[5]}
      </p>
    `
  }

  const stackOverflowHTML = `
    <h3 class="h3 mb-3">
      <a href="${stackoverflow[0]}">${stackoverflow[1]}</a>
    </h3>
    <div>
      ${stackoverflow[3]}
    </div>
    <br>
      <code>
        ${answer}
      </code>
    <hr>
  `

  const html = `
    <!doctype html>
    <html>
    <head>
      <meta charset="UTF-8">

      <meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${webview.cspSource}; script-src 'nonce-${nonce}';">

      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="stylesheet" href="${styleMain}">
    </head>

    <body class="background: black">
    <main class="p-3 h-100 w-100 bg-secondary bg-opacity-10">
        <h1 class="h5 mb-3 text-center"><b>StackOverflow</b></h1>
        <div class="response rounded-4 bg-secondary bg-opacity-10 p-3" id="typing">
            ${stackOverflowHTML}
            <h3 class="h3 mb-3">🤖 Rosana Answer:</h3>
            <div id="snippet">
              <pre>
                <code id="resp" class="hljs">
                </code>
              </pre>
            </div>
            <button class="btn btn-secundary btn-sm" id="btn_copy">Copy</button>
        </div>
    </main>
    <script nonce="${nonce}" src="${highlightMinJs}"></script>
    <script nonce="${nonce}">hljs.highlightAll();</script>
    <script nonce="${nonce}" src="${showdownJs}"></script>
    <script nonce="${nonce}">
      var converter = new showdown.Converter();
      var text      = ${cleanResponse};
      var html      = converter.makeHtml(text);
      document.getElementById('resp').innerHTML = html;

      document.getElementById('btn_copy').onclick = function(){
          containerid = 'resp';
          if (document.selection) {
            var range = document.body.createTextRange();
            range.moveToElementText(document.getElementById(containerid));
            range.select().createTextRange();
            document.execCommand("copy");
          } else if (window.getSelection) {
            var range = document.createRange();
            range.selectNode(document.getElementById(containerid));
            window.getSelection().addRange(range);
            document.execCommand("copy");
          }
      }
    </script>
    </body>
</html>`

  console.log(html)
  panel.webview.html = html
}

function getNonce () {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

// Registrar el comando para mostrar el WebView
module.exports = { createWebViewPanel }
