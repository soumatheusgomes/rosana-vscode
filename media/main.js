const $ = (el) => document.querySelector(el);

(function () {
  // const vscode = acquireVsCodeApi()

  // copy to clipboard
  async function copyToClipboard(text) {
    const dummy = document.createElement('textarea');
    dummy.style.cssText = 'position:absolute; left:-9999px; top:-9999px';
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    await navigator.clipboard.writeText(text);
    document.body.removeChild(dummy);
  }


  $('#btn_copy').onclick = function () {
    const text = $('#resp').textContent
    // copyToClipboard
    copyToClipboard(text)

    const copyButton = $('#btn_copy')
    copyButton.innerHTML = 'Copied!'
    setTimeout(function () {
      copyButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
        <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
        </svg> Copy`
    }, 2000)
  }
}())
