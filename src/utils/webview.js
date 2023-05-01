const vscode = require('vscode')

function getUriMediaResource ({ context, webview, media }) {
  return webview.asWebviewUri(
    vscode.Uri.joinPath(context.extensionUri, 'media', media)
  )
}

function clearResponse ({ response }) {
  const trimmedResponse = response.trim().split('\r\n').join('\n')
  const cleanResponse = JSON.stringify(trimmedResponse, null, 2)
  return cleanResponse
}

// Función para crear y mostrar el WebView
const createWebViewPanel = (type, response, context, chat, copy, title, typing, dataFile) => {
  // New WebView
  const panel = vscode.window.createWebviewPanel(
    'rosana-panel-view', // ID
    'Rosana', // Tab Title
    vscode.ViewColumn.Beside, // Column
    {
      enableScripts: true, // scripts
      localResourceRoots: [
        vscode.Uri.joinPath(context.extensionUri, 'media')
      ]
    }
  )

  if (typeof response === 'undefined') {
    response = 'Oops! Something happened, check the extension settings'
  }

  const { webview } = panel

  const cleanResponse = clearResponse({ response })

  // JS and CSS Files
  const scriptMain = getUriMediaResource({ context, webview, media: 'main.js' })
  const styleVscode = getUriMediaResource({ context, webview, media: 'vscode.css' })
  const styleMain = getUriMediaResource({ context, webview, media: 'main.css' })
  const highlightMinJs = getUriMediaResource({ context, webview, media: 'highlight.min.js' })
  const showdownJs = getUriMediaResource({ context, webview, media: 'showdown.min.js' })
  const markedMindJs = getUriMediaResource({ context, webview, media: 'marked.min.js' })

  // Use a nonce to only allow specific scripts to be run
  const nonce = getNonce()

  let chatHTML = ''
  if (chat) {
    chatHTML = `<footer class="position-fixed d-flex bg-secondary bg-opacity-10">
      <input type="text" class="form-control me-3" placeholder="Ask Rosana..">
      <button class="btn btn-primary">
        <svg class="svg-icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="https://www.w3.org/2000/svg"><path d="M729.173333 469.333333L157.845333 226.496 243.52 469.333333h485.674667z m0 85.333334H243.541333L157.824 797.504 729.173333 554.666667zM45.12 163.541333c-12.352-34.986667 22.762667-67.989333 56.917333-53.482666l853.333334 362.666666c34.645333 14.72 34.645333 63.829333 0 78.549334l-853.333334 362.666666c-34.133333 14.506667-69.269333-18.474667-56.917333-53.482666L168.085333 512 45.098667 163.541333z" fill="" /></svg>
      </button>
    </footer>`
  }

  let copyHTML = ''
  if (copy) {
    copyHTML = `<button class="btn btn-secundary btn-sm" id="btn_copy" style="margin-left: auto; margin-right: 0;">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
        <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
      </svg> Copy
  </button>`
  }

  // tipyng
  let typingHTML = 'document.getElementById(\'resp\').innerHTML = text.documentElement.innerHTML;'
  if (typing) {
    typingHTML = `
      var speed = 20;
      var i = 0;

      function typeWriter() {
          if (i < text.length) {
            document.getElementById("resp").innerHTML += text.charAt(i);
            i++;
            setTimeout(typeWriter, speed);
          }
      }

      typeWriter();
    `
  }

  let dataFileHTML = ''
  if (dataFile.length > 0) {
    dataFileHTML = `<small>${dataFile[0]} ${dataFile[1]}:${dataFile[2]}</small>`
  }

  const html = `
    <!doctype html>
    <html>
    <head>
      <meta charset="UTF-8">

      <meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${webview.cspSource}; script-src 'nonce-${nonce}';">

      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="stylesheet" href="${styleVscode}">
      <link rel="stylesheet" href="${styleMain}">
    </head>

    <body class="background: black">
    <main class="p-3 h-100 w-100 bg-secondary bg-opacity-10">
      <div class="response rounded-4 bg-secondary bg-opacity-10 p-3" id="typing">
        <h3 class="h3 mb-3">${title} ${dataFileHTML}</h3>
        <div id="snippet" class="">
          ${copyHTML}
          <pre>
            <code class="hljs">
              <div id="resp"></div>
            </code>
          </pre>
        </div>
      </div>
    </main>
    ${chatHTML}
    <script nonce="${nonce}" src="${highlightMinJs}"></script>
    <script nonce="${nonce}" src="${showdownJs}"></script>
    <script nonce="${nonce}" src="${showdownJs}"></script>
    <script nonce="${nonce}" src="${markedMindJs}"></script>
    <script nonce="${nonce}">
      const text = new DOMParser().parseFromString(marked.parse(${cleanResponse}), "text/html");
      ${typingHTML}

    </script>
    <script nonce="${nonce}" src="${scriptMain}" >
    </body>
</html>`
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
module.exports = { createWebViewPanel, getUriMediaResource, clearResponse }
