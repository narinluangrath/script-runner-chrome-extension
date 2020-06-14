function SendJSFilesFromIndexFile() {
  const anchorEls = Array.from(document.getElementsByTagName("a"));
  const fileUrls = anchorEls.map((anchorEl) => anchorEl.getAttribute("href"));
  const jsUrls = fileUrls
    .filter((url) => url.endsWith("sr.js"))
    .map((url) => `file://${url}`);
  chrome.runtime.sendMessage({ type: "INDEX_FILE", payload: jsUrls });
}

function ReadScriptRunnerScript() {
  const jsCode = document.body.innerText;
  chrome.runtime.sendMessage({ type: "SCRIPT_FILE", payload: jsCode });
}

function Main() {
  const url = document.URL;
  const isScriptRunnerDir = url.endsWith("script-runner-scripts/");
  const isScriptRunnerScript = url.endsWith("sr.js");

  if (isScriptRunnerDir) {
    SendJSFilesFromIndexFile();
  } else if (isScriptRunnerScript) {
    ReadScriptRunnerScript();
  } else {
    // Normal HTML Document. Check to see if scripts match.
  }
}

Main();
