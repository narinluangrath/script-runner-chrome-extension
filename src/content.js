function sendJSFilesFromIndexFile() {
  const anchorEls = Array.from(document.getElementsByTagName("a"));
  const fileUrls = anchorEls.map((anchorEl) => anchorEl.getAttribute("href"));
  const jsUrls = fileUrls
    .filter((url) => url.endsWith("sr.js"))
    .map((url) => `file://${url}`);
  chrome.runtime.sendMessage({ type: "SCRIPT_FILE_URLS", payload: jsUrls });
}

function readScriptRunnerScript() {
  const jsCode = document.body.innerText;
  chrome.runtime.sendMessage({ type: "SCRIPT_FILE", payload: jsCode });
}

function sanitizeUrl(url) {
  url = (url && url.toLowerCase()) || "";
  url = url[url.length - 1] === "/" ? url.substring(0, url.length - 1) : url;
  return url;
}

function Main() {
  chrome.storage.local.get(["scriptFolder"], ({ scriptFolder }) => {
    // Santize URLs
    let url = sanitizeUrl(document.URL);
    scriptFolder = sanitizeUrl(scriptFolder);

    const isScriptRunnerDir = url === scriptFolder;
    const isScriptRunnerScript = url.endsWith("sr.js");

    if (isScriptRunnerDir) {
      sendJSFilesFromIndexFile();
    } else if (isScriptRunnerScript) {
      readScriptRunnerScript();
    }
  });
}

Main();
